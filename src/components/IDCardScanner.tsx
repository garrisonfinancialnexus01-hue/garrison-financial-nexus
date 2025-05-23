
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { validateImage, processImage } from '@/utils/imageValidation';
import { Upload, X, Camera, AlertCircle, Check } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface IDCardScannerProps {
  onImagesCapture?: (frontImage: Blob, backImage: Blob) => void;
  onImageCapture?: (imageBlob: Blob) => void;
  onError: (error: string) => void;
  side?: 'front' | 'back';
}

const IDCardScanner: React.FC<IDCardScannerProps> = ({ 
  onImagesCapture, 
  onImageCapture, 
  onError, 
  side 
}) => {
  const [frontImage, setFrontImage] = useState<Blob | null>(null);
  const [backImage, setBackImage] = useState<Blob | null>(null);
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentError, setCurrentError] = useState<string | null>(null);

  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);
  const singleInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    imageSide: 'front' | 'back'
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    setIsProcessing(true);
    setCurrentError(null);
    
    try {
      // Validate image
      const validationResult = await validateImage(file);
      
      if (!validationResult.valid) {
        setCurrentError(validationResult.message);
        return;
      }
      
      // Process image for optimal quality
      const processedImage = await processImage(file);
      
      if (side && onImageCapture) {
        // Single side mode
        onImageCapture(processedImage);
        return;
      }
      
      // Dual side mode
      if (imageSide === 'front') {
        setFrontImage(processedImage);
        setFrontPreview(URL.createObjectURL(processedImage));
      } else {
        setBackImage(processedImage);
        setBackPreview(URL.createObjectURL(processedImage));
      }
    } catch (error) {
      setCurrentError('Failed to process image. Please try again.');
      console.error('Image processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const clearImage = (imageSide: 'front' | 'back') => {
    if (imageSide === 'front') {
      if (frontPreview) URL.revokeObjectURL(frontPreview);
      setFrontImage(null);
      setFrontPreview(null);
      if (frontInputRef.current) frontInputRef.current.value = '';
    } else {
      if (backPreview) URL.revokeObjectURL(backPreview);
      setBackImage(null);
      setBackPreview(null);
      if (backInputRef.current) backInputRef.current.value = '';
    }
  };

  const handleSubmit = () => {
    if (!frontImage || !backImage) {
      setCurrentError('Please scan both sides of your ID card');
      return;
    }
    
    if (onImagesCapture) {
      onImagesCapture(frontImage, backImage);
    }
  };

  // Single side scanner for individual front/back scanning
  if (side && onImageCapture) {
    return (
      <div className="space-y-4">
        <div className="border rounded-md p-4 space-y-3">
          <Label className="font-medium">
            {side === 'front' ? 'Front Side of ID Card' : 'Back Side of ID Card'}
          </Label>
          
          <div className="mt-2">
            <div className="flex items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                onClick={() => singleInputRef.current?.click()}>
              <div className="text-center">
                <Camera className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">
                  Click to scan {side} side
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  For best results, ensure good lighting and that all card edges are visible
                </p>
              </div>
            </div>
            <input
              ref={singleInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => handleImageUpload(e, side)}
              className="hidden"
            />
            <Button
              variant="outline"
              className="w-full mt-2"
              onClick={() => singleInputRef.current?.click()}
            >
              <Upload className="mr-2 h-4 w-4" /> Upload {side === 'front' ? 'Front' : 'Back'} Image
            </Button>
          </div>
        </div>
        
        {isProcessing && (
          <div className="text-center py-2">
            <div className="inline-block h-6 w-6 border-2 border-gray-300 border-t-garrison-green rounded-full animate-spin"></div>
            <p className="mt-1 text-sm text-gray-600">Processing image...</p>
          </div>
        )}

        {currentError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{currentError}</AlertDescription>
          </Alert>
        )}
      </div>
    );
  }

  // Dual side scanner (original functionality)
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="font-medium text-lg">ID Card Verification</h3>
        <p className="text-sm text-muted-foreground">
          Please scan both sides of your Uganda National ID card for verification purposes.
        </p>
      </div>

      {currentError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{currentError}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {/* Front side scanner */}
        <div className="border rounded-md p-4 space-y-3">
          <Label htmlFor="front-id-image" className="font-medium">
            Front Side of ID Card
          </Label>
          
          {!frontPreview ? (
            <div className="mt-2">
              <div className="flex items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                  onClick={() => frontInputRef.current?.click()}>
                <div className="text-center">
                  <Camera className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">Click to scan front side</p>
                  <p className="text-xs text-gray-500 mt-1">
                    For best results, ensure good lighting and that all card edges are visible
                  </p>
                </div>
              </div>
              <input
                ref={frontInputRef}
                id="front-id-image"
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => handleImageUpload(e, 'front')}
                className="hidden"
              />
              <Button
                variant="outline"
                className="w-full mt-2"
                onClick={() => frontInputRef.current?.click()}
              >
                <Upload className="mr-2 h-4 w-4" /> Upload Front Image
              </Button>
            </div>
          ) : (
            <div className="relative mt-2">
              <img
                src={frontPreview}
                alt="Front of ID Card"
                className="w-full h-auto object-contain border rounded-md"
              />
              <Button
                variant="outline"
                size="icon"
                className="absolute top-2 right-2 rounded-full bg-white"
                onClick={() => clearImage('front')}
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="mt-2 flex items-center text-green-600 text-sm">
                <Check className="h-4 w-4 mr-1" />
                Front side successfully captured
              </div>
            </div>
          )}
        </div>
        
        {/* Back side scanner */}
        <div className="border rounded-md p-4 space-y-3">
          <Label htmlFor="back-id-image" className="font-medium">
            Back Side of ID Card
          </Label>
          
          {!backPreview ? (
            <div className="mt-2">
              <div className="flex items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                  onClick={() => backInputRef.current?.click()}>
                <div className="text-center">
                  <Camera className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">Click to scan back side</p>
                  <p className="text-xs text-gray-500 mt-1">
                    For best results, ensure good lighting and that all card edges are visible
                  </p>
                </div>
              </div>
              <input
                ref={backInputRef}
                id="back-id-image"
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => handleImageUpload(e, 'back')}
                className="hidden"
              />
              <Button
                variant="outline"
                className="w-full mt-2"
                onClick={() => backInputRef.current?.click()}
              >
                <Upload className="mr-2 h-4 w-4" /> Upload Back Image
              </Button>
            </div>
          ) : (
            <div className="relative mt-2">
              <img
                src={backPreview}
                alt="Back of ID Card"
                className="w-full h-auto object-contain border rounded-md"
              />
              <Button
                variant="outline"
                size="icon"
                className="absolute top-2 right-2 rounded-full bg-white"
                onClick={() => clearImage('back')}
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="mt-2 flex items-center text-green-600 text-sm">
                <Check className="h-4 w-4 mr-1" />
                Back side successfully captured
              </div>
            </div>
          )}
        </div>
      </div>
      
      {isProcessing && (
        <div className="text-center py-2">
          <div className="inline-block h-6 w-6 border-2 border-gray-300 border-t-garrison-green rounded-full animate-spin"></div>
          <p className="mt-1 text-sm text-gray-600">Processing image...</p>
        </div>
      )}

      <Button
        className="w-full bg-garrison-green hover:bg-green-700"
        onClick={handleSubmit}
        disabled={isProcessing || !frontImage || !backImage}
      >
        Continue
      </Button>
      
      <p className="text-xs text-center text-gray-500">
        Your ID card images are only used for verification purposes and are stored securely.
      </p>
    </div>
  );
};

export default IDCardScanner;
