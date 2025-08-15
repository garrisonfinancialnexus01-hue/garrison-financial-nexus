
// Simple in-memory storage for mobile OTP verification codes
// In production, you'd use a database with proper expiry
interface MobileOtpCode {
  code: string;
  mobile: string;
  timestamp: number;
  used: boolean;
}

const mobileOtpCodes: MobileOtpCode[] = [];

export const storeMobileOtpCode = (mobile: string, code: string): void => {
  // Remove any existing codes for this mobile number
  const index = mobileOtpCodes.findIndex(otp => otp.mobile === mobile);
  if (index !== -1) {
    mobileOtpCodes.splice(index, 1);
  }
  
  // Store new code with current timestamp
  mobileOtpCodes.push({
    code,
    mobile,
    timestamp: Date.now(),
    used: false
  });
  
  console.log('Stored OTP code for mobile:', mobile);
};

export const verifyMobileOtpCode = (mobile: string, code: string): boolean => {
  const storedCode = mobileOtpCodes.find(
    otp => otp.mobile === mobile && otp.code === code && !otp.used
  );
  
  if (!storedCode) {
    console.log('OTP code not found for mobile:', mobile);
    return false;
  }
  
  // Check if code has expired (3 minutes = 180,000 milliseconds)
  const isExpired = (Date.now() - storedCode.timestamp) > 180000;
  if (isExpired) {
    console.log('OTP code expired for mobile:', mobile);
    return false;
  }
  
  // Mark code as used
  storedCode.used = true;
  console.log('OTP code verified successfully for mobile:', mobile);
  return true;
};

export const isMobileOtpExpired = (mobile: string): boolean => {
  const storedCode = mobileOtpCodes.find(otp => otp.mobile === mobile && !otp.used);
  if (!storedCode) return true;
  
  return (Date.now() - storedCode.timestamp) > 180000;
};

// Generate a random 6-digit OTP
export const generateOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
