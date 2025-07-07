
// Simple in-memory storage for verification codes
// In production, you'd use a database with proper expiry
interface VerificationCode {
  code: string;
  email: string;
  timestamp: number;
  used: boolean;
}

const verificationCodes: VerificationCode[] = [];

export const storeVerificationCode = (email: string, code: string): void => {
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
  const storedCode = verificationCodes.find(vc => vc.email === email && !vc.used);
  if (!storedCode) return true;
  
  return (Date.now() - storedCode.timestamp) > 180000;
};
