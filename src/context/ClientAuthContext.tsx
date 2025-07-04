
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
      
      const cleanAccountNumber = accountNumber.trim();
      
      // Search for the account
      const { data: account, error: fetchError } = await supabase
        .from('client_accounts')
        .select('*')
        .eq('account_number', cleanAccountNumber)
        .maybeSingle();

      if (fetchError) {
        console.error('Database error:', fetchError);
        return { error: 'Database connection failed. Please try again.' };
      }

      if (!account) {
        return { error: 'Account not found. Please verify your account number.' };
      }

      // Check account status
      if (account.status === 'suspended') {
        return { error: 'Account is suspended. Please contact the manager.' };
      }

      if (account.status === 'pending') {
        return { error: 'Account is pending activation. Please contact the manager.' };
      }

      // Verify password
      if (account.password_hash !== password) {
        return { error: 'Invalid password. Please check your password and try again.' };
      }

      // Sign in successful
      setCurrentClient(account);
      localStorage.setItem('currentClient', JSON.stringify(account));
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
