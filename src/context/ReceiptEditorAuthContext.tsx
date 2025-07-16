
import React, { createContext, useContext, useState, useEffect } from 'react';

interface ReceiptEditorAuthContextType {
  isAuthenticated: boolean;
  adminName: string | null;
  signIn: (name: string, password: string) => Promise<{ error?: string }>;
  signOut: () => void;
}

const ReceiptEditorAuthContext = createContext<ReceiptEditorAuthContextType | undefined>(undefined);

export const useReceiptEditorAuth = () => {
  const context = useContext(ReceiptEditorAuthContext);
  if (context === undefined) {
    throw new Error('useReceiptEditorAuth must be used within a ReceiptEditorAuthProvider');
  }
  return context;
};

const VALID_CREDENTIALS = {
  name: "Admin Receipt",
  password: "Receipt@02"
};

export const ReceiptEditorAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminName, setAdminName] = useState<string | null>(null);

  useEffect(() => {
    // Check for stored session on component mount
    const storedSession = sessionStorage.getItem('receiptEditorSession');
    if (storedSession) {
      try {
        const session = JSON.parse(storedSession);
        const now = Date.now();
        if (session.expires > now) {
          setIsAuthenticated(true);
          setAdminName(session.adminName);
        } else {
          sessionStorage.removeItem('receiptEditorSession');
        }
      } catch (error) {
        sessionStorage.removeItem('receiptEditorSession');
      }
    }

    // Clear session when page is about to unload or browser is closed
    const handleBeforeUnload = () => {
      sessionStorage.removeItem('receiptEditorSession');
    };

    // Clear session when user navigates away from the portal
    const handleVisibilityChange = () => {
      if (document.hidden) {
        sessionStorage.removeItem('receiptEditorSession');
        setIsAuthenticated(false);
        setAdminName(null);
      }
    };

    // Clear session when window loses focus
    const handleBlur = () => {
      sessionStorage.removeItem('receiptEditorSession');
      setIsAuthenticated(false);
      setAdminName(null);
    };

    // Clear session when user navigates to a different page
    const handlePopState = () => {
      sessionStorage.removeItem('receiptEditorSession');
      setIsAuthenticated(false);
      setAdminName(null);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const signIn = async (name: string, password: string) => {
    if (name.trim() === VALID_CREDENTIALS.name && password === VALID_CREDENTIALS.password) {
      setIsAuthenticated(true);
      setAdminName(name);
      
      // Store session with short expiration (only for page refresh protection)
      const session = {
        adminName: name,
        expires: Date.now() + (5 * 60 * 1000) // 5 minutes only for refresh protection
      };
      sessionStorage.setItem('receiptEditorSession', JSON.stringify(session));
      
      return {};
    } else {
      return { error: 'Invalid credentials. Please check your name and password.' };
    }
  };

  const signOut = () => {
    setIsAuthenticated(false);
    setAdminName(null);
    sessionStorage.removeItem('receiptEditorSession');
  };

  return (
    <ReceiptEditorAuthContext.Provider value={{ isAuthenticated, adminName, signIn, signOut }}>
      {children}
    </ReceiptEditorAuthContext.Provider>
  );
};
