
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
      
      console.log('Attempting to sign in with account number:', accountNumber);
      
      // First, validate that the account number is one of our pre-allocated accounts (10000001-10000200)
      const accountNum = parseInt(accountNumber);
      if (isNaN(accountNum) || accountNum < 10000001 || accountNum > 10000200) {
        console.log('Account number not in valid range:', accountNumber);
        return { error: 'Invalid account number. Please use the 8-digit account number provided by the manager (10000001-10000200).' };
      }

      // Check if this account exists in our system
      const { data: existingAccount, error: checkError } = await supabase
        .from('client_accounts')
        .select('*')
        .eq('account_number', accountNumber)
        .maybeSingle();

      console.log('Account lookup result:', { existingAccount, checkError });

      if (checkError) {
        console.error('Error checking account:', checkError);
        return { error: 'Error checking account. Please try again.' };
      }

      // If account exists and is active, sign them in directly
      if (existingAccount && existingAccount.status === 'active') {
        console.log('Found active account, checking password...');
        
        if (existingAccount.password_hash !== password) {
          return { error: 'Invalid password. Please check your password and try again.' };
        }

        setCurrentClient(existingAccount);
        localStorage.setItem('currentClient', JSON.stringify(existingAccount));
        console.log('Successfully signed in existing account');
        return {};
      }

      // If account exists but is suspended (system reserved), activate it with pending signup details
      if (existingAccount && existingAccount.status === 'suspended' && existingAccount.name === 'System Reserved') {
        console.log('Found system reserved account, activating...');
        
        // Get pending signup details from localStorage
        const pendingDetails = localStorage.getItem('pendingSignupDetails');
        if (!pendingDetails) {
          return { error: 'Please complete the signup process first. Contact the manager for an account number, then sign up with your details.' };
        }

        let userDetails;
        try {
          userDetails = JSON.parse(pendingDetails);
        } catch (error) {
          console.error('Error parsing pending details:', error);
          localStorage.removeItem('pendingSignupDetails');
          return { error: 'Invalid signup data. Please complete the signup process again.' };
        }
        
        // Verify the password matches what they used during signup
        if (userDetails.password !== password) {
          return { error: 'Invalid password. Please use the password you created during signup.' };
        }

        console.log('Activating account with user details...');

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

        setCurrentClient(updatedAccount);
        localStorage.setItem('currentClient', JSON.stringify(updatedAccount));
        
        // Clear the pending signup details as they're no longer needed
        localStorage.removeItem('pendingSignupDetails');
        
        return {};
      }

      // If we get here, the account number is valid but doesn't exist in our system
      // Check if user has pending signup details to create new account
      console.log('Valid account number but not found in database, checking for signup details...');
      
      const pendingDetails = localStorage.getItem('pendingSignupDetails');
      if (!pendingDetails) {
        return { error: 'Please complete the signup process first. Go to the signup page, enter your details, then return here with your manager-provided account number.' };
      }

      let userDetails;
      try {
        userDetails = JSON.parse(pendingDetails);
      } catch (error) {
        console.error('Error parsing pending details:', error);
        localStorage.removeItem('pendingSignupDetails');
        return { error: 'Invalid signup data. Please complete the signup process again.' };
      }
      
      // Verify the password matches what they used during signup
      if (userDetails.password !== password) {
        return { error: 'Invalid password. Please use the password you created during signup.' };
      }

      // Check if user already has an account with this email to prevent duplicates
      const { data: existingByEmail, error: emailCheckError } = await supabase
        .from('client_accounts')
        .select('*')
        .eq('email', userDetails.email)
        .maybeSingle();

      if (emailCheckError) {
        console.error('Error checking email:', emailCheckError);
        return { error: 'Error checking account. Please try again.' };
      }

      if (existingByEmail) {
        return { error: 'An account with this email already exists. Please use a different email or contact the manager.' };
      }

      console.log('Creating new account with user details...');

      // Create a new account with the provided account number
      const { data: newAccount, error: createError } = await supabase
        .from('client_accounts')
        .insert({
          account_number: accountNumber,
          name: userDetails.name,
          email: userDetails.email,
          phone: userDetails.phone,
          nin: userDetails.nin,
          password_hash: userDetails.password,
          account_balance: 0.00,
          status: 'active'
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating account:', createError);
        
        // Check if it's a duplicate account number error
        if (createError.code === '23505') {
          return { error: 'This account number is already in use. Please contact the manager for a different account number.' };
        }
        
        return { error: 'Failed to create account. Please try again or contact the manager.' };
      }

      if (!newAccount) {
        return { error: 'Failed to create account. Please contact the manager.' };
      }

      console.log('Account created successfully:', newAccount);

      // Send email notification about new signup
      try {
        await fetch('/api/send-signup-notification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userDetails: userDetails,
            accountNumber: accountNumber
          })
        });
        console.log('Signup notification email sent');
      } catch (emailError) {
        console.error('Failed to send signup notification:', emailError);
        // Don't fail the signup if email fails
      }

      setCurrentClient(newAccount);
      localStorage.setItem('currentClient', JSON.stringify(newAccount));
      
      // Clear the pending signup details as they're no longer needed
      localStorage.removeItem('pendingSignupDetails');
      
      return {};
      
    } catch (error) {
      console.error('Sign in error:', error);
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
