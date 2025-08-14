// This file is now deprecated - using secure database-backed OTP system
// All OTP operations are now handled through Supabase database functions

// Legacy functions kept for backward compatibility during transition
// These will be removed in a future update once all components are migrated

interface VerificationCode {
  code: string;
  email: string;
  timestamp: number;
  used: boolean;
}

const verificationCodes: VerificationCode[] = [];

export const storeVerificationCode = (email: string, code: string): void => {
  console.warn('DEPRECATED: storeVerificationCode - Use secure database OTP system instead');
  // Remove any existing codes for this email
  const index = verificationCodes.findIndex(vc => vc.email === email);
  if (index !== -1) {
    verificationCodes.splice(index, 1);
  }
  
  // Store new code with current timestamp
  verificationCodes.push({
    code,
    email,
    timestamp: Date.now(),
    used: false
  });
  
  console.log('Stored verification code for email:', email);
};

export const verifyPasswordResetCode = (email: string, code: string): boolean => {
  console.warn('DEPRECATED: verifyPasswordResetCode - Use secure database OTP system instead');
  const storedCode = verificationCodes.find(
    vc => vc.email === email && vc.code === code && !vc.used
  );
  
  if (!storedCode) {
    console.log('Code not found for email:', email);
    return false;
  }
  
  // Check if code has expired (3 minutes = 180,000 milliseconds)
  const isExpired = (Date.now() - storedCode.timestamp) > 180000;
  if (isExpired) {
    console.log('Code expired for email:', email);
    return false;
  }
  
  // Mark code as used
  storedCode.used = true;
  console.log('Code verified successfully for email:', email);
  return true;
};

export const isCodeExpired = (email: string): boolean => {
  console.warn('DEPRECATED: isCodeExpired - Use secure database OTP system instead');
  const storedCode = verificationCodes.find(vc => vc.email === email && !vc.used);
  if (!storedCode) return true;
  
  return (Date.now() - storedCode.timestamp) > 180000;
};
