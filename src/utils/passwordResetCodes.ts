
// Enhanced in-memory storage for verification codes
// In production, you'd use a database with proper expiry
interface VerificationCode {
  code: string;
  email: string;
  timestamp: number;
  used: boolean;
  attempts: number;
}

const verificationCodes: VerificationCode[] = [];
const MAX_ATTEMPTS = 3;
const CODE_EXPIRY_TIME = 180000; // 3 minutes

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
    used: false,
    attempts: 0
  });
  
  console.log('Stored verification code for email:', email, 'Code:', code);
};

export const verifyPasswordResetCode = (email: string, code: string): { success: boolean; message: string } => {
  const storedCodeEntry = verificationCodes.find(
    vc => vc.email === email && !vc.used
  );
  
  if (!storedCodeEntry) {
    console.log('No active code found for email:', email);
    return { success: false, message: 'No verification code found. Please request a new one.' };
  }
  
  // Check if code has expired
  const isExpired = (Date.now() - storedCodeEntry.timestamp) > CODE_EXPIRY_TIME;
  if (isExpired) {
    console.log('Code expired for email:', email);
    return { success: false, message: 'Verification code has expired. Please request a new one.' };
  }
  
  // Check attempts
  if (storedCodeEntry.attempts >= MAX_ATTEMPTS) {
    console.log('Max attempts exceeded for email:', email);
    return { success: false, message: 'Too many incorrect attempts. Please request a new code.' };
  }
  
  // Verify code
  if (storedCodeEntry.code !== code) {
    storedCodeEntry.attempts++;
    console.log('Invalid code for email:', email, 'Attempts:', storedCodeEntry.attempts);
    return { 
      success: false, 
      message: `Invalid code. ${MAX_ATTEMPTS - storedCodeEntry.attempts} attempts remaining.` 
    };
  }
  
  // Mark code as used
  storedCodeEntry.used = true;
  console.log('Code verified successfully for email:', email);
  return { success: true, message: 'Code verified successfully' };
};

export const isCodeExpired = (email: string): boolean => {
  const storedCode = verificationCodes.find(vc => vc.email === email && !vc.used);
  if (!storedCode) return true;
  
  return (Date.now() - storedCode.timestamp) > CODE_EXPIRY_TIME;
};

export const getRemainingTime = (email: string): number => {
  const storedCode = verificationCodes.find(vc => vc.email === email && !vc.used);
  if (!storedCode) return 0;
  
  const elapsed = Date.now() - storedCode.timestamp;
  const remaining = CODE_EXPIRY_TIME - elapsed;
  return Math.max(0, Math.floor(remaining / 1000));
};
