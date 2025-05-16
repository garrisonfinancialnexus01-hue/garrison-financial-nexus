
// Utility function to validate Ugandan National Identification Numbers (NINs)
// Note: This is a simplified validation that checks the format
// For real-world use, you would need to integrate with Uganda's NIRA API

export const isValidUgandanNIN = async (nin: string): Promise<boolean> => {
  // Remove whitespace and convert to uppercase
  const formattedNIN = nin.replace(/\s+/g, '').toUpperCase();
  
  // Basic format validation for Ugandan NINs
  // Format: CM[A-Z][0-9]{7}[A-Z]{3}[0-9]{1}
  const ninRegex = /^CM[A-Z][0-9]{7}[A-Z]{3}[0-9]$/;
  
  if (!ninRegex.test(formattedNIN)) {
    return false;
  }
  
  // Add additional validation if needed
  // In a real implementation, you would call an API to validate the NIN
  
  // For demo purposes, we'll simulate an API call with a timeout
  return new Promise((resolve) => {
    setTimeout(() => {
      // For demo purposes: Simple validation that returns true for NIns with
      // even last digit and false for odd last digit
      const lastDigit = parseInt(formattedNIN.slice(-1));
      resolve(lastDigit % 2 === 0);
    }, 500);
  });
};
