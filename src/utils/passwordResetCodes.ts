
// Enhanced verification code management with expiry
interface VerificationCode {
  code: string;
  email: string;
  timestamp: number;
  used: boolean;
  expiresAt: number;
}

const verificationCodes: VerificationCode[] = [];

export const storeVerificationCode = (email: string, code: string): void => {
  // Remove any existing codes for this email
  const index = verificationCodes.findIndex(vc => vc.email.toLowerCase() === email.toLowerCase());
  if (index !== -1) {
    verificationCodes.splice(index, 1);
  }
  
  const now = Date.now();
  const expiresAt = now + 180000; // Exactly 3 minutes (180,000 milliseconds)
  
  // Store new code with expiry
  verificationCodes.push({
    code,
    email: email.toLowerCase(),
    timestamp: now,
    expiresAt,
    used: false
  });
  
  console.log(`Code stored for ${email} - expires at ${new Date(expiresAt).toLocaleTimeString()}`);
};

export const verifyPasswordResetCode = (email: string, code: string): boolean => {
  const normalizedEmail = email.toLowerCase();
  const storedCode = verificationCodes.find(
    vc => vc.email === normalizedEmail && vc.code === code && !vc.used
  );
  
  if (!storedCode) {
    console.log('Code not found for email:', normalizedEmail);
    return false;
  }
  
  // Check if code has expired
  const now = Date.now();
  if (now > storedCode.expiresAt) {
    console.log('Code expired for email:', normalizedEmail);
    return false;
  }
  
  // Mark code as used
  storedCode.used = true;
  console.log('Code verified successfully for email:', normalizedEmail);
  return true;
};

export const getTimeRemaining = (email: string): number => {
  const normalizedEmail = email.toLowerCase();
  const storedCode = verificationCodes.find(vc => vc.email === normalizedEmail && !vc.used);
  
  if (!storedCode) return 0;
  
  const now = Date.now();
  const remaining = Math.max(0, storedCode.expiresAt - now);
  return Math.ceil(remaining / 1000); // Return seconds remaining
};

export const isCodeExpired = (email: string): boolean => {
  return getTimeRemaining(email) <= 0;
};
