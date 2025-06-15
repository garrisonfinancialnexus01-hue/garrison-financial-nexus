
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
      
      console.log('=== DEBUGGING CLIENT AUTHENTICATION ===');
      console.log('Input account number:', accountNumber);
      console.log('Input password:', password);
      
      // First, let's check what accounts actually exist in the database
      const { data: allAccounts, error: listError } = await supabase
        .from('client_accounts')
        .select('account_number, name, status')
        .limit(10);
      
      console.log('Sample accounts in database:', allAccounts);
      if (listError) {
        console.log('Error fetching sample accounts:', listError);
      }
      
      // Clean the account number input
      const cleanAccountNumber = accountNumber.trim();
      console.log('Cleaned account number:', cleanAccountNumber);
      
      // Check if account exists with exact string match
      const { data: existingAccount, error: checkError } = await supabase
        .from('client_accounts')
        .select('*')
        .eq('account_number', cleanAccountNumber)
        .maybeSingle();

      console.log('Database query result:', { existingAccount, checkError });

      if (checkError) {
        console.error('Database error during account lookup:', checkError);
        return { error: 'Database error occurred. Please try again.' };
      }

      if (!existingAccount) {
        console.log('No account found with number:', cleanAccountNumber);
        
        // Let's also try a broader search to see if there are similar account numbers
        const { data: similarAccounts } = await supabase
          .from('client_accounts')
          .select('account_number')
          .like('account_number', `%${cleanAccountNumber}%`)
          .limit(5);
        
        console.log('Similar account numbers found:', similarAccounts);
        
        return { error: 'Account not found. Please verify your account number or contact the manager to get your account number.' };
      }

      console.log('Found account:', existingAccount);

      // If account exists and is active, authenticate
      if (existingAccount.status === 'active') {
        console.log('Account is active, checking password...');
        
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
