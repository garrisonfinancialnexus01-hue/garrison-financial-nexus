
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ClientAccount {
  id: string;
  account_number: string;
  name: string;
  email: string;
  phone: string;
  nin: string;
  account_balance: number;
  status: 'pending' | 'active' | 'suspended';
}

interface ClientAuthContextType {
  currentClient: ClientAccount | null;
  signIn: (accountNumber: string, password: string) => Promise<{ error?: string }>;
  signOut: () => void;
  isLoading: boolean;
}

const ClientAuthContext = createContext<ClientAuthContextType | undefined>(undefined);

export const useClientAuth = () => {
  const context = useContext(ClientAuthContext);
  if (context === undefined) {
    throw new Error('useClientAuth must be used within a ClientAuthProvider');
  }
  return context;
};

export const ClientAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentClient, setCurrentClient] = useState<ClientAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored session
    const storedClient = localStorage.getItem('currentClient');
    if (storedClient) {
      try {
        setCurrentClient(JSON.parse(storedClient));
      } catch (error) {
        console.error('Error parsing stored client data:', error);
        localStorage.removeItem('currentClient');
      }
    }
    setIsLoading(false);
  }, []);

  const signIn = async (accountNumber: string, password: string) => {
    try {
      setIsLoading(true);
      
      console.log('=== COMPREHENSIVE AUTHENTICATION DEBUG ===');
      console.log('Input account number:', accountNumber);
      console.log('Input password length:', password.length);
      
      // First, let's get a complete picture of what's in the database
      console.log('--- Step 1: Checking database connection and table structure ---');
      const { data: tableExists, error: structureError } = await supabase
        .from('client_accounts')
        .select('count')
        .limit(1);
      
      console.log('Database connection test:', { tableExists, structureError });
      
      if (structureError) {
        console.error('Database structure error:', structureError);
        return { error: 'Database connection failed. Please try again.' };
      }
      
      // Get total count of accounts
      const { count: totalAccounts, error: countError } = await supabase
        .from('client_accounts')
        .select('*', { count: 'exact', head: true });
      
      console.log('Total accounts in database:', totalAccounts);
      if (countError) {
        console.error('Error counting accounts:', countError);
      }
      
      // Get sample of all accounts to see what's actually there
      const { data: allAccounts, error: listError } = await supabase
        .from('client_accounts')
        .select('account_number, name, status, created_at')
        .order('account_number')
        .limit(20);
      
      console.log('Sample accounts in database:', allAccounts);
      if (listError) {
        console.error('Error fetching sample accounts:', listError);
      }
      
      // Clean the account number input
      const cleanAccountNumber = accountNumber.trim();
      console.log('--- Step 2: Account lookup ---');
      console.log('Original input:', `"${accountNumber}"`);
      console.log('Cleaned input:', `"${cleanAccountNumber}"`);
      console.log('Input length:', cleanAccountNumber.length);
      console.log('Input type:', typeof cleanAccountNumber);
      
      // Try multiple search strategies
      console.log('--- Step 3: Multiple search strategies ---');
      
      // Strategy 1: Exact match
      console.log('Strategy 1: Exact string match');
      const { data: exactMatch, error: exactError } = await supabase
        .from('client_accounts')
        .select('*')
        .eq('account_number', cleanAccountNumber)
        .maybeSingle();
      
      console.log('Exact match result:', { exactMatch, exactError });
      
      // Strategy 2: Case insensitive search
      console.log('Strategy 2: Case insensitive search');
      const { data: caseInsensitive, error: caseError } = await supabase
        .from('client_accounts')
        .select('*')
        .ilike('account_number', cleanAccountNumber)
        .maybeSingle();
      
      console.log('Case insensitive result:', { caseInsensitive, caseError });
      
      // Strategy 3: Partial match to see similar numbers
      console.log('Strategy 3: Partial match search');
      const { data: partialMatches, error: partialError } = await supabase
        .from('client_accounts')
        .select('account_number, name, status')
        .like('account_number', `%${cleanAccountNumber}%`)
        .limit(10);
      
      console.log('Partial matches:', { partialMatches, partialError });
      
      // Strategy 4: Check for accounts starting with the same digits
      const firstFourDigits = cleanAccountNumber.substring(0, 4);
      console.log('Strategy 4: Accounts starting with', firstFourDigits);
      const { data: similarStart, error: similarError } = await supabase
        .from('client_accounts')
        .select('account_number, name, status')
        .like('account_number', `${firstFourDigits}%`)
        .limit(10);
      
      console.log('Similar start accounts:', { similarStart, similarError });
      
      // Use the exact match for further processing
      const existingAccount = exactMatch;
      
      if (!existingAccount) {
        console.log('--- No account found with any strategy ---');
        console.log('Searched for account number:', cleanAccountNumber);
        console.log('Account length:', cleanAccountNumber.length);
        console.log('Expected range: 10000001-10000200');
        
        // Additional debugging: check if the account number is in expected range
        const accountNum = parseInt(cleanAccountNumber);
        console.log('Parsed as integer:', accountNum);
        console.log('Is in expected range (10000001-10000200)?', accountNum >= 10000001 && accountNum <= 10000200);
        
        return { error: 'Account not found. Please verify your account number or contact the manager to get your account number.' };
      }

      console.log('--- Step 4: Account found, checking status and password ---');
      console.log('Found account:', {
        id: existingAccount.id,
        account_number: existingAccount.account_number,
        name: existingAccount.name,
        status: existingAccount.status,
        email: existingAccount.email,
        created_at: existingAccount.created_at
      });

      // If account exists and is active, authenticate
      if (existingAccount.status === 'active') {
        console.log('Account is active, checking password...');
        console.log('Stored password hash:', existingAccount.password_hash);
        console.log('Input password:', password);
        
        if (existingAccount.password_hash !== password) {
          console.log('Password mismatch');
          return { error: 'Invalid password. Please check your password and try again.' };
        }

        console.log('Password match! Signing in...');
        setCurrentClient(existingAccount);
        localStorage.setItem('currentClient', JSON.stringify(existingAccount));
        return {};
      }

      // If account exists but is suspended (system reserved), we need signup details
      if (existingAccount.status === 'suspended' && existingAccount.name === 'System Reserved') {
        console.log('Found system reserved account, checking for pending signup details...');
        
        // Get pending signup details from localStorage
        const pendingDetails = localStorage.getItem('pendingSignupDetails');
        if (!pendingDetails) {
          console.log('No pending signup details found');
          return { error: 'Please complete the signup process first. Go to signup, enter your details, then return here with your manager-provided account number.' };
        }

        let userDetails;
        try {
          userDetails = JSON.parse(pendingDetails);
          console.log('Found pending signup details:', userDetails);
        } catch (error) {
          console.error('Error parsing pending details:', error);
          localStorage.removeItem('pendingSignupDetails');
          return { error: 'Invalid signup data. Please complete the signup process again.' };
        }
        
        // Verify the password matches what they used during signup
        if (userDetails.password !== password) {
          console.log('Password does not match signup password');
          return { error: 'Invalid password. Please use the password you created during signup.' };
        }

        console.log('Activating system reserved account with user details...');

        // Activate the account by updating the system reserved account
        const { data: updatedAccount, error: updateError } = await supabase
          .from('client_accounts')
          .update({
            name: userDetails.name,
            email: userDetails.email,
            phone: userDetails.phone,
            nin: userDetails.nin,
            password_hash: userDetails.password,
            account_balance: 0.00,
            status: 'active'
          })
          .eq('id', existingAccount.id)
          .select()
          .single();

        if (updateError || !updatedAccount) {
          console.error('Error activating account:', updateError);
          return { error: 'Failed to activate account. Please contact the manager.' };
        }

        console.log('Account activated successfully:', updatedAccount);

        // Send email notification about new signup
        try {
          const response = await supabase.functions.invoke('send-signup-notification', {
            body: {
              userDetails: userDetails,
              accountNumber: cleanAccountNumber
            }
          });
          console.log('Signup notification sent:', response);
        } catch (emailError) {
          console.error('Failed to send signup notification:', emailError);
          // Don't fail the signup if email fails
        }

        setCurrentClient(updatedAccount);
        localStorage.setItem('currentClient', JSON.stringify(updatedAccount));
        
        // Clear the pending signup details as they're no longer needed
        localStorage.removeItem('pendingSignupDetails');
        
        return {};
      }

      // If we get here, account has an unexpected status
      console.log('Account has unexpected status:', existingAccount.status);
      return { error: `Account status: ${existingAccount.status}. Please contact the manager for assistance.` };
      
    } catch (error) {
      console.error('Unexpected sign in error:', error);
      return { error: 'An error occurred during sign in. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    setCurrentClient(null);
    localStorage.removeItem('currentClient');
  };

  return (
    <ClientAuthContext.Provider value={{ currentClient, signIn, signOut, isLoading }}>
      {children}
    </ClientAuthContext.Provider>
  );
};
