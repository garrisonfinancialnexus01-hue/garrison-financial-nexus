
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  isAuthenticated: boolean;
  adminName: string | null;
  login: (adminName: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const CentralDashboardAuthContext = createContext<AuthContextType | undefined>(undefined);

export const useCentralDashboardAuth = () => {
  const context = useContext(CentralDashboardAuthContext);
  if (context === undefined) {
    throw new Error('useCentralDashboardAuth must be used within a CentralDashboardAuthProvider');
  }
  return context;
};

interface CentralDashboardAuthProviderProps {
  children: ReactNode;
}

export const CentralDashboardAuthProvider: React.FC<CentralDashboardAuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminName, setAdminName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const sessionToken = localStorage.getItem('central_dashboard_token');
      if (sessionToken) {
        const { data } = await supabase
          .from('central_dashboard_sessions')
          .select('*')
          .eq('session_token', sessionToken)
          .eq('is_active', true)
          .gte('expires_at', new Date().toISOString())
          .single();

        if (data) {
          setIsAuthenticated(true);
          setAdminName(data.admin_name);
        } else {
          localStorage.removeItem('central_dashboard_token');
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (adminName: string, password: string): Promise<boolean> => {
    if (adminName === 'Central admin' && password === 'Harrypotter@2012') {
      try {
        const sessionToken = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const { error } = await supabase
          .from('central_dashboard_sessions')
          .insert({
            admin_name: adminName,
            session_token: sessionToken,
          });

        if (!error) {
          localStorage.setItem('central_dashboard_token', sessionToken);
          setIsAuthenticated(true);
          setAdminName(adminName);
          return true;
        }
      } catch (error) {
        console.error('Login error:', error);
      }
    }
    return false;
  };

  const logout = async () => {
    try {
      const sessionToken = localStorage.getItem('central_dashboard_token');
      if (sessionToken) {
        await supabase
          .from('central_dashboard_sessions')
          .update({ is_active: false })
          .eq('session_token', sessionToken);
      }
      
      localStorage.removeItem('central_dashboard_token');
      setIsAuthenticated(false);
      setAdminName(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <CentralDashboardAuthContext.Provider value={{
      isAuthenticated,
      adminName,
      login,
      logout,
      loading
    }}>
      {children}
    </CentralDashboardAuthContext.Provider>
  );
};
