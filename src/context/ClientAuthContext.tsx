
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
      setCurrentClient(JSON.parse(storedClient));
    }
    setIsLoading(false);
  }, []);

  const signIn = async (accountNumber: string, password: string) => {
    try {
      setIsLoading(true);
      
      console.log('Attempting to sign in with account number:', accountNumber);
      
      // First check if it's a valid system account number (from our pre-allocated accounts)
      const { data: systemAccount, error: systemError } = await supabase
        .from('client_accounts')
        .select('account_number')
        .eq('account_number', accountNumber)
        .eq('name', 'System Reserved')
        .eq('status', 'suspended')
        .single();

      console.log('System account check:', { systemAccount, systemError });

      if (systemError || !systemAccount) {
        return { error: 'Invalid account number. Please contact the manager to get a valid account number.' };
      }

      // Get pending signup details from localStorage
      const pendingDetails = localStorage.getItem('pendingSignupDetails');
      if (!pendingDetails) {
        return { error: 'Please complete the signup process first by contacting the manager.' };
      }

      const userDetails = JSON.parse(pendingDetails);
      
      // Verify the password matches what they used during signup
      if (userDetails.password !== password) {
        return { error: 'Invalid password. Please use the password you created during signup.' };
      }

      console.log('Creating active account for user...');

      // Create the active account by updating the system reserved account
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
        .eq('account_number', accountNumber)
        .eq('name', 'System Reserved')
        .eq('status', 'suspended')
        .select()
        .single();

      if (updateError || !updatedAccount) {
        console.error('Error creating active account:', updateError);
        return { error: 'Failed to activate account. Please contact the manager.' };
      }

      console.log('Account activated successfully:', updatedAccount);

      setCurrentClient(updatedAccount);
      localStorage.setItem('currentClient', JSON.stringify(updatedAccount));
      
      // Clear the pending signup details as they're no longer needed
      localStorage.removeItem('pendingSignupDetails');
      
      return {};
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: 'An error occurred during sign in' };
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
