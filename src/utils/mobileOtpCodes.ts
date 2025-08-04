
// Simple in-memory storage for mobile OTP verification codes
// In production, you'd use a database with proper expiry
interface MobileOtpCode {
  code: string;
  mobile: string;
  timestamp: number;
  used: boolean;
}

const mobileOtpCodes: MobileOtpCode[] = [];

// Normalize phone number to consistent +256XXXXXXXXX format
const normalizePhoneNumber = (phone: string): string => {
  // Remove all spaces and special characters except +
  const cleaned = phone.replace(/\s+/g, '').replace(/[^\d+]/g, '');
  
  // If it starts with 0, convert to +256 format
  if (cleaned.startsWith('0') && cleaned.length === 10) {
    return '+256' + cleaned.substring(1);
  }
  
  // If it starts with 256, add + prefix
  if (cleaned.startsWith('256') && cleaned.length === 12) {
    return '+' + cleaned;
  }
  
  // If it already starts with +256, return as is
  if (cleaned.startsWith('+256') && cleaned.length === 13) {
    return cleaned;
  }
  
  // If it's just 9 digits (without leading 0), add +256
  if (/^\d{9}$/.test(cleaned)) {
    return '+256' + cleaned;
  }
  
  return cleaned;
};

export const storeMobileOtpCode = (mobile: string, code: string): void => {
  const normalizedMobile = normalizePhoneNumber(mobile);
  
  // Remove any existing codes for this mobile number
  const index = mobileOtpCodes.findIndex(otp => normalizePhoneNumber(otp.mobile) === normalizedMobile);
  if (index !== -1) {
    mobileOtpCodes.splice(index, 1);
  }
  
  // Store new code with current timestamp
  mobileOtpCodes.push({
    code,
    mobile: normalizedMobile,
    timestamp: Date.now(),
    used: false
  });
  
  console.log('Stored OTP code for normalized mobile:', normalizedMobile);
};

export const verifyMobileOtpCode = (mobile: string, code: string): boolean => {
  const normalizedMobile = normalizePhoneNumber(mobile);
  
  const storedCode = mobileOtpCodes.find(
    otp => normalizePhoneNumber(otp.mobile) === normalizedMobile && otp.code === code && !otp.used
  );
  
  if (!storedCode) {
    console.log('OTP code not found for normalized mobile:', normalizedMobile);
    return false;
  }
  
  // Check if code has expired (3 minutes = 180,000 milliseconds)
  const isExpired = (Date.now() - storedCode.timestamp) > 180000;
  if (isExpired) {
    console.log('OTP code expired for normalized mobile:', normalizedMobile);
    return false;
  }
  
  // Mark code as used
  storedCode.used = true;
  console.log('OTP code verified successfully for normalized mobile:', normalizedMobile);
  return true;
};

export const isMobileOtpExpired = (mobile: string): boolean => {
  const normalizedMobile = normalizePhoneNumber(mobile);
  const storedCode = mobileOtpCodes.find(otp => normalizePhoneNumber(otp.mobile) === normalizedMobile && !otp.used);
  if (!storedCode) return true;
  
  return (Date.now() - storedCode.timestamp) > 180000;
};

// Generate a random 6-digit OTP
export const generateOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
