
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
  
  // Basic format validation for Ugandan NINs
  // Format: (CM|CF)[A-Z][0-9]{7}[A-Z]{3}[0-9]{1}
  const ninRegex = /^(CM|CF)[A-Z][0-9]{7}[A-Z]{3}[0-9]$/;
  
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
