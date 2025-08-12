
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
  // Case 1: 8 numbers, 6 letters (including CM/CF prefix)
  // Case 2: 9 numbers, 5 letters (including CM/CF prefix)
  // Case 3: 10 numbers, 4 letters (including CM/CF prefix)
  const isValidCase1 = numbers === 8 && letters === 6;
  const isValidCase2 = numbers === 9 && letters === 5;
  const isValidCase3 = numbers === 10 && letters === 4;
  
  if (!isValidCase1 && !isValidCase2 && !isValidCase3) {
    return false;
  }
  
  // Verify that there are exactly 2 letters in the "CM" or "CF" prefix
  // and the correct number of additional letters for each case
  const prefixLetters = 2; // CM or CF
  let requiredExtraLetters: number;
  
  if (isValidCase1) {
    requiredExtraLetters = 4; // 6 total letters - 2 prefix = 4 additional
  } else if (isValidCase2) {
    requiredExtraLetters = 3; // 5 total letters - 2 prefix = 3 additional
  } else if (isValidCase3) {
    requiredExtraLetters = 2; // 4 total letters - 2 prefix = 2 additional
  } else {
    return false;
  }
  
  // The total letters should match our requirements
  if (letters !== (prefixLetters + requiredExtraLetters)) {
    return false;
  }
  
  // Enhanced format validation - must start with CM or CF and contain only letters and numbers
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
