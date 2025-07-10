
// Utility for generating secure admin access tokens
export const generateAdminToken = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
};

export const generateAccessLink = (baseUrl: string = window.location.origin): string => {
  const token = generateAdminToken();
  const timestamp = Date.now();
  const expiryTime = timestamp + (24 * 60 * 60 * 1000); // 24 hours
  
  // Store the token temporarily (in production, this would be in a secure database)
  const tokenData = {
    token,
    expires: expiryTime,
    used: false
  };
  
  localStorage.setItem(`admin_token_${token}`, JSON.stringify(tokenData));
  
  return `${baseUrl}/admin-balance-editor?access_token=${token}&expires=${expiryTime}`;
};

export const validateAdminToken = (token: string): boolean => {
  if (!token) return false;
  
  const tokenData = localStorage.getItem(`admin_token_${token}`);
  if (!tokenData) return false;
  
  try {
    const parsed = JSON.parse(tokenData);
    const now = Date.now();
    
    if (parsed.used || now > parsed.expires) {
      localStorage.removeItem(`admin_token_${token}`);
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
};

export const markTokenAsUsed = (token: string): void => {
  const tokenData = localStorage.getItem(`admin_token_${token}`);
  if (tokenData) {
    try {
      const parsed = JSON.parse(tokenData);
      parsed.used = true;
      localStorage.setItem(`admin_token_${token}`, JSON.stringify(parsed));
    } catch {
      // Token cleanup on error
      localStorage.removeItem(`admin_token_${token}`);
    }
  }
};
