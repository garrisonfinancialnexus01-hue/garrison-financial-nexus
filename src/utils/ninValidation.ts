
// Utility function to validate Ugandan National Identification Numbers (NIns)

export const isValidUgandanNIN = async (nin: string): Promise<boolean> => {
  // Remove whitespace and convert to uppercase
  const formattedNIN = nin.replace(/\s+/g, '').toUpperCase();
  
  // NIN must be exactly 14 characters
  if (formattedNIN.length !== 14) {
    return false;
  }
  
  // NIN must start with either CM or CF
  if (!formattedNIN.startsWith('CM') && !formattedNIN.startsWith('CF')) {
    return false;
  }
  
  // Check that the NIN contains exactly 8 numbers
  const numberCount = (formattedNIN.match(/[0-9]/g) || []).length;
  if (numberCount !== 8) {
    return false;
  }
  
  // Check that the NIN contains at least 4 letters (excluding the CM/CF prefix)
  // We already know it starts with CM or CF (2 letters), so we need 4 more letters
  const letterCount = (formattedNIN.match(/[A-Z]/g) || []).length;
  if (letterCount !== 6) {  // 2 from prefix + 4 more letters
    return false;
  }
  
  // Enhanced format validation for Ugandan NINs
  // The first two characters must be CM or CF
  // Overall must have 8 digits and 6 letters (including CM/CF)
  const ninRegex = /^(CM|CF)[A-Z0-9]{12}$/;
  
  if (!ninRegex.test(formattedNIN)) {
    return false;
  }
  
  // For demo purposes, we'll simulate an API call with a timeout
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 500);
  });
};
