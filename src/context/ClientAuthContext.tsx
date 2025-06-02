
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
      
      // Query the client account with the provided credentials
      const { data, error } = await supabase
        .from('client_accounts')
        .select('*')
        .eq('account_number', accountNumber)
        .eq('password_hash', password) // In production, this should be hashed
        .single();

      if (error || !data) {
        return { error: 'Invalid account number or password' };
      }

      if (data.status !== 'active') {
        return { error: 'Account is not active. Please contact manager.' };
      }

      // Set the account number for RLS policy
      await supabase.rpc('set_config', {
        setting_name: 'app.current_account_number',
        setting_value: accountNumber,
        is_local: false
      });

      setCurrentClient(data);
      localStorage.setItem('currentClient', JSON.stringify(data));
      
      return {};
    } catch (error) {
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
