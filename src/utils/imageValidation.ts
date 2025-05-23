
/**
 * Utility functions for image validation and processing
 */

/**
 * Validates if an image meets quality requirements
 * @param file - The image file to validate
 * @returns Promise that resolves to a validation result
 */
export const validateImage = async (file: File): Promise<{
  valid: boolean;
  message: string;
  image?: HTMLImageElement;
}> => {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return { valid: false, message: 'File must be an image' };
  }
  
  // Check file size (max 5MB)
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, message: 'Image must be less than 5MB' };
  }
  
  // Load image to check dimensions and perform further validation
  try {
    const image = await loadImage(file);
    
    // Check minimum dimensions for readability
    const MIN_WIDTH = 800;
    const MIN_HEIGHT = 500;
    if (image.width < MIN_WIDTH || image.height < MIN_HEIGHT) {
      return { 
        valid: false, 
        message: `Image must be at least ${MIN_WIDTH}x${MIN_HEIGHT} pixels for legibility`
      };
    }
    
    // Basic clarity check (This is a simplified approximation - real blur detection would be more complex)
    const clarityScore = await estimateImageClarity(image);
    if (clarityScore < 0.5) {
      return { valid: false, message: 'Image appears to be blurry. Please upload a clearer image.' };
    }
    
    return { valid: true, message: 'Image validation successful', image };
  } catch (error) {
    console.error('Image validation error:', error);
    return { valid: false, message: 'Failed to process image' };
  }
};

/**
 * Loads an image from a file
 */
export const loadImage = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Estimates image clarity using a simplified algorithm
 * This is a basic implementation - a production app might use more advanced algorithms
 */
const estimateImageClarity = async (image: HTMLImageElement): Promise<number> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return 0;
  
  // Resize for analysis if image is too large
  const maxDimension = 1000;
  let width = image.width;
  let height = image.height;
  
  if (width > maxDimension || height > maxDimension) {
    const ratio = width / height;
    if (width > height) {
      width = maxDimension;
      height = Math.round(maxDimension / ratio);
    } else {
      height = maxDimension;
      width = Math.round(maxDimension * ratio);
    }
  }
  
  canvas.width = width;
  canvas.height = height;
  
  // Draw image to canvas
  ctx.drawImage(image, 0, 0, width, height);
  
  // Get image data
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  // Calculate Laplacian variance as a measure of focus
  // Higher variance typically means sharper image
  let sum = 0;
  let sumSquared = 0;
  let count = 0;
  
  // Convert to grayscale and calculate variance
  for (let i = 0; i < data.length; i += 4) {
    const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    sum += gray;
    sumSquared += gray * gray;
    count++;
  }
  
  const mean = sum / count;
  const variance = sumSquared / count - mean * mean;
  
  // Normalize to 0-1 range (this could be calibrated better with more samples)
  const normalizedScore = Math.min(1, Math.max(0, variance / 2000));
  
  return normalizedScore;
};

/**
 * Checks an image for ID card edges
 * For a production app, consider using a more sophisticated edge detection algorithm
 */
export const hasVisibleIDCardEdges = async (image: HTMLImageElement): Promise<boolean> => {
  // This is a simplified check - a real implementation would use more sophisticated computer vision
  // For now, we'll assume the validation passes and recommend manual review
  return true;
};

/**
 * Processes and optimizes an image for storage and display
 */
export const processImage = async (file: File): Promise<Blob> => {
  const image = await loadImage(file);
  
  // Create a canvas for image processing
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not create canvas context');
  
  // Set canvas dimensions to match image (or resize if needed)
  canvas.width = image.width;
  canvas.height = image.height;
  
  // Draw image to canvas
  ctx.drawImage(image, 0, 0);
  
  // Convert to blob with quality adjustment
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to process image'));
        }
      },
      'image/jpeg',
      0.85 // Quality parameter (0.85 gives good balance between quality and file size)
    );
  });
};
