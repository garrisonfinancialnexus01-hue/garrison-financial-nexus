
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
  
  // Count numbers and letters in the NIN
  const numbers = (formattedNIN.match(/[0-9]/g) || []).length;
  const letters = (formattedNIN.match(/[A-Z]/g) || []).length;
  
  // Check for valid character compositions:
  // Case 1: 8 numbers, 6 letters (including CM/CF)
  // Case 2: 9 numbers, 5 letters (including CM/CF)
  const isValidCase1 = numbers === 8 && letters === 6;
  const isValidCase2 = numbers === 9 && letters === 5;
  
  if (!isValidCase1 && !isValidCase2) {
    return false;
  }
  
  // Verify that there are exactly 2 letters in the "CM" or "CF" prefix
  // and 4 more capital letters for case 1, or 3 more capital letters for case 2
  const prefixLetters = 2; // CM or CF
  const requiredExtraLetters = isValidCase1 ? 4 : 3;
  
  // The total letters should match our requirements
  if (letters !== (prefixLetters + requiredExtraLetters)) {
    return false;
  }
  
  // Enhanced format validation
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
