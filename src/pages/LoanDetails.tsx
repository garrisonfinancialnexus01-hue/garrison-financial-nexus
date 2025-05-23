import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, Download, AlertCircle, CheckCircle } from 'lucide-react';
import Receipt from '@/components/Receipt';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import IDCardScanner from '@/components/IDCardScanner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';

const VERIFICATION_CODES = [
  '123456', '234567', '345678', '456789', '567890', '678901', '789012', '890123', '901234', '012345',
  '111111', '222222', '333333', '444444', '555555', '666666', '777777', '888888', '999999', '000000',
  '147258', '258369', '369147', '741852', '852963', '963741', '159357', '357159', '159753', '753159',
  '246810', '468102', '681024', '810246', '102468', '024681', '124816', '248162', '481624', '816248',
  '135791', '357913', '579135', '791357', '913579', '135797', '197531', '975319', '753197', '531975',
  '112233', '223344', '334455', '445566', '556677', '667788', '778899', '889900', '990011', '001122',
  '121212', '131313', '141414', '151515', '161616', '171717', '181818', '191919', '202020', '212121',
  '314159', '159314', '271828', '828271', '141421', '421141', '173205', '205173', '223606', '606223',
  '987654', '876543', '765432', '654321', '543210', '432109', '321098', '210987', '109876', '098765',
  '192837', '283746', '374655', '465564', '556473', '647382', '738291', '829100', '910029', '293847'
];

const LoanDetails = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receiptNumber, setReceiptNumber] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [idCardFront, setIdCardFront] = useState<Blob | null>(null);
  const [idCardBack, setIdCardBack] = useState<Blob | null>(null);
  const [scanningStep, setScanningStep] = useState<'front' | 'back' | 'completed'>('front');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [showVerificationInput, setShowVerificationInput] = useState(false);
  const [verificationError, setVerificationError] = useState('');

  const receiptRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { amount, term, interest, totalAmount } = location.state || {};

  const openWhatsApp = () => {
    window.open(`https://wa.me/256761281222`, '_blank');
  };

  const handleIDCardScan = (imageBlob: Blob) => {
    if (scanningStep === 'front') {
      setIdCardFront(imageBlob);
      setScanningStep('back');
      toast({
        title: "Front ID captured",
        description: "Now scan the back of your ID card",
      });
    } else if (scanningStep === 'back') {
      setIdCardBack(imageBlob);
      setScanningStep('completed');
      toast({
        title: "ID scanning completed",
        description: "Both sides of your ID have been captured successfully",
      });
    }
  };

  const generateReceiptPDF = async (): Promise<string> => {
    if (!receiptRef.current) throw new Error('Receipt reference not found');

    try {
      // Hide ID card images for client download
      const idSections = receiptRef.current.querySelectorAll('.internal-only');
      idSections.forEach(section => {
        (section as HTMLElement).style.display = 'none';
      });

      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: true,
        onclone: (document, element) => {
          console.log('Cloning document for PDF generation');
        }
      });

      // Show ID card images again for internal use
      idSections.forEach(section => {
        (section as HTMLElement).style.display = 'block';
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Return base64 encoded PDF
      return pdf.output('datauristring').split(',')[1];
    } catch (error) {
      console.error('PDF generation error:', error);
      throw new Error('Failed to generate receipt PDF');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !phone || !email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (!idCardFront || !idCardBack) {
      toast({
        title: "Error",
        description: "Please scan both sides of your ID card",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate unique receipt number with timestamp to avoid conflicts
      const timestamp = new Date().getTime();
      const newReceiptNumber = `GFN-${timestamp}`;
      setReceiptNumber(newReceiptNumber);
      
      console.log("Generating receipt number:", newReceiptNumber);

      // First store the application in the database
      const { error: dbError } = await supabase
        .from('loan_applications')
        .insert({
          name,
          phone,
          email,
          nin: '', // Empty since we're using ID card scanning instead
          amount,
          term,
          interest,
          total_amount: totalAmount,
          receipt_number: newReceiptNumber
        });

      if (dbError) {
        console.error('Database error:', dbError);
        throw new Error('Failed to save application to database');
      }

      console.log("Database entry created successfully");

      // Generate PDF receipt for email
      const receiptPdf = await generateReceiptPDF();
      console.log("PDF receipt generated successfully");

      // Convert ID card blobs to base64 for email attachment
      const idCardFrontBase64 = await blobToBase64(idCardFront);
      const idCardBackBase64 = await blobToBase64(idCardBack);
      
      console.log("ID card images converted to base64 successfully");

      // Send email with receipt and ID card images
      const { data, error } = await supabase.functions.invoke('send-loan-application', {
        body: {
          name,
          phone,
          email,
          nin: '', // Empty since we're using ID card scanning
          amount,
          term,
          interest,
          totalAmount,
          receiptNumber: newReceiptNumber,
          receiptPdf,
          idCardFront: idCardFrontBase64,
          idCardBack: idCardBackBase64
        }
      });

      if (error) {
        console.error('Email sending error:', error);
        throw new Error('Failed to send application email');
      }

      console.log('Application submitted successfully:', data);
      setIsSubmitted(true);

      toast({
        title: "Application Submitted!",
        description: "Your loan application has been submitted successfully. Contact the manager on WhatsApp for verification.",
      });

    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Submission Error",
        description: error instanceof Error ? error.message : "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerificationCodeSubmit = () => {
    if (VERIFICATION_CODES.includes(verificationCode)) {
      setIsVerified(true);
      setVerificationError('');
      toast({
        title: "Verification Successful",
        description: "You can now download your receipt",
      });
    } else {
      setVerificationError('Invalid verification code. Please check the code provided by the manager.');
      toast({
        title: "Verification Failed",
        description: "Invalid verification code",
        variant: "destructive",
      });
    }
  };

  const downloadReceipt = async () => {
    if (!receiptRef.current || !isVerified) return;

    setIsDownloading(true);

    try {
      const receiptPdf = await generateReceiptPDF();
      
      // Convert base64 to blob and download
      const byteCharacters = atob(receiptPdf);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Loan-Receipt-${receiptNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Receipt Downloaded",
        description: "Your loan receipt has been downloaded successfully",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Download Error",
        description: "Failed to download receipt. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Extract the base64 data part after the comma
        const base64Data = base64String.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  if (!amount || !term) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="text-center">
          <CardContent className="pt-6">
            <p className="text-gray-600 mb-4">No loan information found.</p>
            <Button onClick={() => navigate('/loan-application')}>
              Start New Application
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-garrison-black mb-4">Complete Your Loan Application</h1>
        <p className="text-gray-600">
          Fill in your personal details and scan your ID to complete the application.
        </p>
      </div>

      {!isSubmitted ? (
        <div className="space-y-8">
          {/* Loan Summary */}
          <Card>
            <CardHeader className="bg-garrison-green text-white">
              <CardTitle>Loan Summary</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex justify-between">
                  <span>Loan Amount:</span>
                  <span className="font-medium">{amount?.toLocaleString()} UGX</span>
                </div>
                <div className="flex justify-between">
                  <span>Interest Rate:</span>
                  <span className="font-medium">{interest}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Repayment Term:</span>
                  <span className="font-medium">{term === 'short' ? '14 Days' : '30 Days'}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total Repayment:</span>
                  <span>{totalAmount?.toLocaleString()} UGX</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ID Card Scanning */}
          <Card>
            <CardHeader>
              <CardTitle>Uganda National ID Verification</CardTitle>
              <CardDescription>
                Please scan both sides of your Uganda National ID card
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {scanningStep === 'front' && (
                <div>
                  <Label className="text-lg font-medium mb-4 block">Step 1: Scan Front of ID Card</Label>
                  <IDCardScanner 
                    onImageCapture={handleIDCardScan}
                    onError={(error) => toast({ title: "Error", description: error, variant: "destructive" })}
                    side="front"
                  />
                </div>
              )}

              {scanningStep === 'back' && (
                <div>
                  <Label className="text-lg font-medium mb-4 block">Step 2: Scan Back of ID Card</Label>
                  <IDCardScanner 
                    onImageCapture={handleIDCardScan}
                    onError={(error) => toast({ title: "Error", description: error, variant: "destructive" })}
                    side="back"
                  />
                </div>
              )}

              {scanningStep === 'completed' && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    ID card scanning completed successfully. Both sides have been captured.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Personal Information Form */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Please provide your contact information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-garrison-green hover:bg-green-700"
                  disabled={scanningStep !== 'completed' || isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Success Message */}
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 text-green-800">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Application Submitted Successfully!</span>
              </div>
              <p className="text-green-700 mt-2">
                Receipt Number: <strong>{receiptNumber}</strong>
              </p>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle>Next Steps for Receipt Download</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800">Contact Manager for Verification</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      You must contact our manager on WhatsApp to receive a 6-digit verification code before you can download your receipt.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <Button 
                  onClick={openWhatsApp}
                  className="bg-[#25D366] hover:bg-[#128C7E] text-white flex items-center gap-2 py-6 px-8 text-lg"
                >
                  <MessageSquare className="h-6 w-6" />
                  Contact Manager on WhatsApp
                </Button>
              </div>

              <div className="text-center">
                <Button
                  variant="outline"
                  onClick={() => setShowVerificationInput(!showVerificationInput)}
                  className="text-garrison-green border-garrison-green hover:bg-garrison-green hover:text-white"
                >
                  I have received the verification code
                </Button>
              </div>

              {showVerificationInput && (
                <Card>
                  <CardHeader>
                    <CardTitle>Enter Verification Code</CardTitle>
                    <CardDescription>
                      Enter the 6-digit code provided by our manager
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="verification">Verification Code</Label>
                      <Input
                        id="verification"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        placeholder="Enter 6-digit code"
                        maxLength={6}
                      />
                      {verificationError && (
                        <p className="text-red-500 text-sm">{verificationError}</p>
                      )}
                    </div>
                    <Button 
                      onClick={() => {
                        if (VERIFICATION_CODES.includes(verificationCode)) {
                          setIsVerified(true);
                          setVerificationError('');
                          toast({
                            title: "Verification Successful",
                            description: "You can now download your receipt",
                          });
                        } else {
                          setVerificationError('Invalid verification code. Please check the code provided by the manager.');
                          toast({
                            title: "Verification Failed",
                            description: "Invalid verification code",
                            variant: "destructive",
                          });
                        }
                      }}
                      disabled={verificationCode.length !== 6}
                      className="w-full"
                    >
                      Verify Code
                    </Button>
                  </CardContent>
                </Card>
              )}

              {isVerified && (
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-green-800">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-medium">Verification Successful!</span>
                      </div>
                      <Button 
                        onClick={async () => {
                          if (!receiptRef.current) return;
                          
                          setIsDownloading(true);
                          
                          try {
                            const receiptPdf = await generateReceiptPDF();
                            
                            // Convert base64 to blob and download
                            const byteCharacters = atob(receiptPdf);
                            const byteNumbers = new Array(byteCharacters.length);
                            for (let i = 0; i < byteCharacters.length; i++) {
                              byteNumbers[i] = byteCharacters.charCodeAt(i);
                            }
                            const byteArray = new Uint8Array(byteNumbers);
                            const blob = new Blob([byteArray], { type: 'application/pdf' });
                            
                            const url = URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = `Loan-Receipt-${receiptNumber}.pdf`;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            URL.revokeObjectURL(url);
                          
                            toast({
                              title: "Receipt Downloaded",
                              description: "Your loan receipt has been downloaded successfully",
                            });
                          } catch (error) {
                            console.error('Error generating PDF:', error);
                            toast({
                              title: "Download Error",
                              description: "Failed to download receipt. Please try again.",
                              variant: "destructive",
                            });
                          } finally {
                            setIsDownloading(false);
                          }
                        }}
                        disabled={isDownloading}
                        className="bg-garrison-green hover:bg-green-700"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        {isDownloading ? 'Downloading...' : 'Download Receipt'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>

          {/* Hidden Receipt for PDF Generation */}
          <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
            <Receipt
              ref={receiptRef}
              name={name}
              phone={phone}
              email={email}
              amount={amount}
              term={term}
              interest={interest}
              totalAmount={totalAmount}
              receiptNumber={receiptNumber}
              idCardFront={idCardFront}
              idCardBack={idCardBack}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanDetails;
