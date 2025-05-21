
import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { isValidUgandanNIN } from '@/utils/ninValidation';
import { verifyCode } from '@/utils/verificationCodes';
import Receipt from '@/components/Receipt';
import { supabase } from '@/integrations/supabase/client';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Download, MessageSquare, CheckCircle2, ShieldCheck } from 'lucide-react';

const LoanDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const receiptRef = useRef<HTMLDivElement>(null);
  
  const state = location.state as { 
    amount: number, 
    term: 'short' | 'medium',
    interest: number,
    totalAmount: number
  } | null;

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    nin: ''
  });

  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    email: '',
    nin: ''
  });

  const [isNinValidating, setIsNinValidating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receiptNumber, setReceiptNumber] = useState<string | null>(null);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showVerificationForm, setShowVerificationForm] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationError, setVerificationError] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  // Check for verification from localStorage
  useEffect(() => {
    const checkVerificationStatus = () => {
      const verificationStatus = localStorage.getItem('receiptVerified');
      if (verificationStatus === 'true') {
        setIsVerified(true);
      }
    };

    // Check immediately and then on focus
    checkVerificationStatus();
    window.addEventListener('focus', checkVerificationStatus);
    
    return () => {
      window.removeEventListener('focus', checkVerificationStatus);
    };
  }, []);

  if (!state) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-3xl font-bold text-garrison-black mb-4">Loan Details Not Found</h1>
        <p className="text-gray-600 mb-8">
          Please start your loan application process again.
        </p>
        <Button asChild className="bg-garrison-green hover:bg-green-700">
          <a href="/loan-application">Return to Application</a>
        </Button>
      </div>
    );
  }

  const { amount, term, interest, totalAmount } = state;

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
    
    // Special handling for NIN validation
    if (name === 'nin') {
      const cleanedValue = value.replace(/\s+/g, '').toUpperCase();
      
      // Update with cleaned value
      setFormData(prev => ({ ...prev, [name]: cleanedValue }));
      
      if (cleanedValue.length > 0) {
        // Length validation
        if (cleanedValue.length !== 14) {
          setErrors(prev => ({
            ...prev,
            nin: 'NIN must be exactly 14 characters.'
          }));
          return;
        }
        
        // Prefix validation
        if (!cleanedValue.startsWith('CM') && !cleanedValue.startsWith('CF')) {
          setErrors(prev => ({
            ...prev,
            nin: 'NIN must start with either CM or CF.'
          }));
          return;
        }
        
        // Count letters and numbers
        const numbers = (cleanedValue.match(/[0-9]/g) || []).length;
        const letters = (cleanedValue.match(/[A-Z]/g) || []).length;
        
        // Check for valid character compositions
        const isValidCase1 = numbers === 8 && letters === 6;
        const isValidCase2 = numbers === 9 && letters === 5;
        
        if (!isValidCase1 && !isValidCase2) {
          setErrors(prev => ({
            ...prev,
            nin: 'NIN must contain either 8 numbers and 6 letters, or 9 numbers and 5 letters.'
          }));
          return;
        }
        
        // Full validation
        setIsNinValidating(true);
        try {
          const isValid = await isValidUgandanNIN(cleanedValue);
          if (!isValid) {
            setErrors(prev => ({
              ...prev,
              nin: 'Invalid NIN. Please enter a valid Ugandan National ID Number.'
            }));
          }
        } catch (error) {
          console.error('NIN validation error:', error);
        } finally {
          setIsNinValidating(false);
        }
      }
    }
  };

  const validate = () => {
    let valid = true;
    const newErrors = { ...errors };

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      valid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
      valid = false;
    } else if (!/^\+?[0-9]{10,15}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
      valid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
      valid = false;
    }

    if (!formData.nin.trim()) {
      newErrors.nin = 'NIN is required';
      valid = false;
    } else if (formData.nin.length !== 14) {
      newErrors.nin = 'NIN must be exactly 14 characters';
      valid = false;
    } else if (!formData.nin.startsWith('CM') && !formData.nin.startsWith('CF')) {
      newErrors.nin = 'NIN must start with either CM or CF';
      valid = false;
    } else {
      // Count numbers and letters
      const numbers = (formData.nin.match(/\d/g) || []).length;
      const letters = (formData.nin.match(/[A-Z]/g) || []).length;
      
      // Check for valid character compositions
      const isValidCase1 = numbers === 8 && letters === 6;
      const isValidCase2 = numbers === 9 && letters === 5;
      
      if (!isValidCase1 && !isValidCase2) {
        newErrors.nin = 'NIN must contain either 8 numbers and 6 letters, or 9 numbers and 5 letters';
        valid = false;
      }
    }

    setErrors(newErrors);
    return valid;
  };

  const generatePDF = async (): Promise<{pdf: jsPDF, pdfBase64: string}> => {
    if (!receiptRef.current) {
      throw new Error("Receipt reference is not available");
    }
    
    try {
      console.log("Starting PDF generation process");
      
      // Force any pending renders to complete
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Create canvas with higher quality settings
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2, // Good balance between quality and performance
        logging: false,
        useCORS: true,
        backgroundColor: '#ffffff',
        allowTaint: true
      });
      
      console.log("Canvas generated with dimensions:", canvas.width, "x", canvas.height);
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      
      // Use A4 paper size for the PDF (210mm x 297mm)
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Add image to PDF, fitting it to the page
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      console.log("PDF generated successfully");
      
      return {
        pdf,
        pdfBase64: pdf.output('datauristring').split(',')[1]
      };
    } catch (error) {
      console.error("Error in generatePDF:", error);
      throw error;
    }
  };

  const generateSimplePDF = async (): Promise<{pdf: jsPDF, pdfBase64: string}> => {
    if (!receiptRef.current) {
      throw new Error("Receipt reference is not available");
    }
    
    try {
      console.log("Starting simple PDF generation as fallback");
      
      // Create a new PDF directly
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Add text directly to PDF
      pdf.setFontSize(16);
      pdf.text("Garrison Financial Nexus", 20, 20);
      
      pdf.setFontSize(12);
      pdf.text(`Receipt #${receiptNumber}`, 20, 30);
      pdf.text(`Date: ${new Date().toLocaleDateString()}`, 20, 40);
      
      pdf.setFontSize(14);
      pdf.text("Loan Application Details", 20, 60);
      
      pdf.setFontSize(12);
      pdf.text(`Name: ${formData.name}`, 20, 70);
      pdf.text(`Phone: ${formData.phone}`, 20, 80);
      pdf.text(`Email: ${formData.email}`, 20, 90);
      pdf.text(`NIN: ${formData.nin}`, 20, 100);
      
      pdf.setFontSize(14);
      pdf.text("Loan Summary", 20, 120);
      
      pdf.setFontSize(12);
      pdf.text(`Loan Amount: ${amount.toLocaleString()} UGX`, 20, 130);
      pdf.text(`Term: ${term === 'short' ? '14 Days' : '30 Days'}`, 20, 140);
      pdf.text(`Interest Rate: ${interest}%`, 20, 150);
      pdf.text(`Total Repayment: ${totalAmount.toLocaleString()} UGX`, 20, 160);
      
      pdf.setFontSize(10);
      pdf.text("Thank you for choosing Garrison Financial Nexus for your financial needs.", 20, 180);
      pdf.text("For inquiries: garrisonfinancialnexus01@gmail.com", 20, 190);
      
      console.log("Simple PDF generated successfully");
      
      return {
        pdf,
        pdfBase64: pdf.output('datauristring').split(',')[1]
      };
    } catch (error) {
      console.error("Error in generateSimplePDF:", error);
      throw error;
    }
  };

  const sendApplicationEmail = async (receiptNum: string) => {
    try {
      setIsSendingEmail(true);
      console.log("Starting email sending process");
      
      // Try primary PDF generation first, fallback to simple one if it fails
      let pdfBase64 = "";
      try {
        const { pdfBase64: generatedPdfBase64 } = await generatePDF();
        pdfBase64 = generatedPdfBase64;
      } catch (pdfError) {
        console.error("Primary PDF generation failed, using fallback:", pdfError);
        const { pdfBase64: fallbackPdfBase64 } = await generateSimplePDF();
        pdfBase64 = fallbackPdfBase64;
      }
      
      if (!pdfBase64) {
        throw new Error("Failed to generate PDF");
      }
      
      console.log("PDF generated, sending email");
      
      // Multiple attempts for sending email
      let attempts = 0;
      const maxAttempts = 3;
      let success = false;
      
      while (attempts < maxAttempts && !success) {
        try {
          attempts++;
          console.log(`Email sending attempt ${attempts}`);
          
          // Call the Supabase edge function to send email with PDF
          const { data, error } = await supabase.functions.invoke('send-loan-application', {
            body: {
              name: formData.name,
              phone: formData.phone,
              email: formData.email,
              nin: formData.nin,
              amount: amount,
              term: term,
              interest: interest,
              totalAmount: totalAmount,
              receiptNumber: receiptNum,
              receiptPdf: pdfBase64
            }
          });
          
          if (error) {
            console.error(`Email function attempt ${attempts} failed:`, error);
            if (attempts === maxAttempts) throw error;
          } else {
            success = true;
            console.log("Email function call succeeded:", data);
          }
        } catch (attemptError) {
          console.error(`Email sending attempt ${attempts} failed:`, attemptError);
          if (attempts === maxAttempts) throw attemptError;
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      if (success) {
        console.log("Email sent successfully");
        toast({
          title: "Application sent successfully",
          description: "We've received your application and will contact you soon.",
        });
      } else {
        throw new Error("Failed to send email after multiple attempts");
      }
    } catch (error) {
      console.error('Error sending application email:', error);
      toast({
        title: "Application saved",
        description: "Your application has been saved. You can download your receipt now.",
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleSubmit = async () => {
    if (validate()) {
      setIsSubmitting(true);
      
      try {
        console.log("Submitting application");
        // Check Supabase connection
        const { data: connectionTest, error: connectionError } = await supabase.from('loan_applications').select('count').limit(1);
        
        if (connectionError) {
          console.error("Supabase connection test failed:", connectionError);
          throw new Error("Database connection failed. Please try again later.");
        }
        
        console.log("Database connection successful");
        
        // Save to Supabase and get receipt number
        const { data, error } = await supabase
          .rpc('generate_receipt_number')
          .single();
          
        if (error) {
          console.error("Error generating receipt number:", error);
          throw error;
        }
        
        const receiptNum = data as string;
        console.log("Generated receipt number:", receiptNum);
        setReceiptNumber(receiptNum);
        
        // Insert application with receipt number
        const { error: insertError } = await supabase.from('loan_applications').insert({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          nin: formData.nin,
          amount: amount,
          term: term,
          interest: interest,
          total_amount: totalAmount,
          receipt_number: receiptNum
        });
        
        if (insertError) {
          console.error("Error inserting application:", insertError);
          throw insertError;
        }
        
        console.log("Application data saved successfully");
        
        toast({
          title: "Application submitted successfully",
          description: "Contact the manager on WhatsApp for verification to download your receipt.",
        });
        
        // Send application email after submission with a slight delay to ensure receipt rendering
        setTimeout(() => {
          sendApplicationEmail(receiptNum).catch(emailError => {
            console.error("Failed to send email in background:", emailError);
          });
        }, 500);
      } catch (error) {
        console.error('Error submitting application:', error);
        toast({
          title: "Error submitting application",
          description: error instanceof Error ? error.message : "Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  const openWhatsApp = () => {
    // Track that user has clicked the WhatsApp button
    localStorage.setItem('whatsAppOpened', 'true');
    setShowVerificationForm(true);
    
    // Open WhatsApp
    window.open(`https://wa.me/256761281222`, '_blank');
    
    toast({
      title: "WhatsApp verification initiated",
      description: "After contacting the manager, you'll need to enter the verification code they provide.",
    });
  };

  const handleVerifyCode = () => {
    if (!verificationCode) {
      setVerificationError('Please enter the verification code');
      return;
    }

    if (verificationCode.length !== 6) {
      setVerificationError('Verification code must be 6 digits');
      return;
    }

    // Check if the code is valid
    if (verifyCode(verificationCode)) {
      // Success - mark as verified
      setIsVerified(true);
      localStorage.setItem('receiptVerified', 'true');
      
      toast({
        title: "Verification successful",
        description: "You can now download your receipt.",
      });
      
      setVerificationError('');
    } else {
      setVerificationError('Invalid verification code. Please check and try again.');
    }
  };
  
  const downloadReceipt = async () => {
    if (!receiptRef.current) return;
    
    try {
      setIsDownloading(true);
      console.log("Starting receipt download");
      
      // Method 1: Direct PDF generation
      try {
        const { pdf } = await generatePDF();
        
        // Save the PDF file with a unique name
        pdf.save(`Garrison_Financial_Receipt_${receiptNumber}.pdf`);
        
        console.log("Receipt downloaded successfully using method 1");
        
        toast({
          title: "Receipt downloaded",
          description: "Your receipt has been downloaded successfully.",
        });
        
        // Navigate to homepage after successful download with a delay
        setTimeout(() => {
          navigate('/');
        }, 2000);
        
        return;
      } catch (method1Error) {
        console.error("Method 1 download failed, trying method 2:", method1Error);
      }
      
      // Method 2: Use a different approach
      try {
        const { pdf } = await generateSimplePDF();
        pdf.save(`Garrison_Financial_Receipt_${receiptNumber}.pdf`);
        
        console.log("Receipt downloaded successfully using method 2");
        
        toast({
          title: "Receipt downloaded",
          description: "Your receipt has been downloaded successfully.",
        });
        
        // Navigate to homepage after successful download with a delay
        setTimeout(() => {
          navigate('/');
        }, 2000);
        
        return;
      } catch (method2Error) {
        console.error("Method 2 download failed, trying method 3:", method2Error);
      }
      
      // Method 3: Direct data URL download as final fallback
      try {
        // Create a simple PDF
        const pdf = new jsPDF();
        pdf.text(`Garrison Financial Receipt #${receiptNumber}`, 20, 20);
        pdf.text(`Name: ${formData.name}`, 20, 30);
        pdf.text(`Amount: ${amount.toLocaleString()} UGX`, 20, 40);
        
        // Create a download link
        const blob = pdf.output('blob');
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Garrison_Financial_Receipt_${receiptNumber}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
        
        console.log("Receipt downloaded successfully using method 3");
        
        toast({
          title: "Receipt downloaded",
          description: "Your receipt has been downloaded using alternative method.",
        });
        
        // Navigate to homepage after successful download with a delay
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } catch (method3Error) {
        console.error("All methods failed:", method3Error);
        throw new Error("Download failed. Please try again.");
      }
      
    } catch (error) {
      console.error('Error downloading receipt:', error);
      toast({
        title: "Error downloading receipt",
        description: "Please try again or contact support.",
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-garrison-black mb-4">Complete Your Loan Application</h1>
        <p className="text-gray-600">
          Please provide your personal details to complete the application process.
        </p>
      </div>

      <Card className="shadow-lg">
        <CardHeader className="bg-garrison-green text-white">
          <CardTitle>Personal Information</CardTitle>
          <CardDescription className="text-white/80">
            Fill in your details for verification
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={errors.name ? "border-red-500" : ""}
                disabled={!!receiptNumber}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. +256700000000"
                className={errors.phone ? "border-red-500" : ""}
                disabled={!!receiptNumber}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                className={errors.email ? "border-red-500" : ""}
                disabled={!!receiptNumber}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nin">National Identification Number (NIN)</Label>
              <div className="relative">
                <Input
                  id="nin"
                  name="nin"
                  value={formData.nin}
                  onChange={handleChange}
                  placeholder="e.g. CM1234567ABC8"
                  className={errors.nin ? "border-red-500" : ""}
                  disabled={!!receiptNumber || isNinValidating}
                  maxLength={14}
                />
                {isNinValidating && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="h-4 w-4 border-2 border-garrison-green border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              {errors.nin && <p className="text-red-500 text-sm mt-1">{errors.nin}</p>}
              <p className="text-sm text-gray-500">
                Enter your valid Uganda National ID Number (14 characters, starting with CM or CF)
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-garrison-black mb-2">Loan Summary:</h3>
              <div className="flex justify-between mt-2 text-sm">
                <span>Loan Amount:</span>
                <span>{amount.toLocaleString()} UGX</span>
              </div>
              <div className="flex justify-between mt-1 text-sm">
                <span>Interest Rate:</span>
                <span>{interest}%</span>
              </div>
              <div className="flex justify-between mt-1 text-sm">
                <span>Repayment Term:</span>
                <span>{term === 'short' ? '14 Days' : '30 Days'}</span>
              </div>
              <div className="flex justify-between mt-3 font-medium">
                <span>Total Repayment:</span>
                <span>{totalAmount.toLocaleString()} UGX</span>
              </div>
            </div>

            {!receiptNumber ? (
              <Button 
                onClick={handleSubmit} 
                className="w-full bg-garrison-green hover:bg-green-700"
                disabled={isSubmitting || isSendingEmail}
              >
                {isSubmitting || isSendingEmail ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    {isSubmitting ? "Processing..." : "Sending application..."}
                  </>
                ) : "Submit"}
              </Button>
            ) : (
              <div className="space-y-4">
                {isVerified ? (
                  <div className="bg-green-50 p-4 rounded-md border border-green-200 flex items-center space-x-3 mb-4">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <p className="text-green-700">Verification complete. You can now download your receipt.</p>
                  </div>
                ) : showVerificationForm ? (
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-md border border-blue-200 mb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <ShieldCheck className="h-5 w-5 text-blue-500" />
                        <h3 className="font-medium text-blue-800">Verification Required</h3>
                      </div>
                      <p className="text-blue-800 mb-4">Please contact the manager on WhatsApp and ask for a verification code. Enter the 6-digit code below:</p>
                      
                      <div className="space-y-2">
                        <Label htmlFor="verificationCode">Verification Code</Label>
                        <div className="flex space-x-2">
                          <Input
                            id="verificationCode"
                            value={verificationCode}
                            onChange={(e) => {
                              setVerificationCode(e.target.value);
                              if (verificationError) setVerificationError('');
                            }}
                            placeholder="Enter 6-digit code"
                            className={verificationError ? "border-red-500" : ""}
                            maxLength={6}
                          />
                          <Button 
                            onClick={handleVerifyCode}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Verify
                          </Button>
                        </div>
                        {verificationError && (
                          <p className="text-red-500 text-sm mt-1">{verificationError}</p>
                        )}
                      </div>
                      
                      <div className="mt-4 text-sm text-blue-700">
                        <p>Need to contact the manager?</p>
                        <Button 
                          onClick={openWhatsApp}
                          variant="outline" 
                          className="mt-2 border-blue-300 text-blue-700 hover:bg-blue-50"
                        >
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Contact Manager on WhatsApp
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-amber-50 p-4 rounded-md border border-amber-200 mb-4">
                    <p className="text-amber-800 mb-2">Please contact the manager on WhatsApp to receive your verification code.</p>
                    <Button 
                      onClick={openWhatsApp}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Contact Manager on WhatsApp
                    </Button>
                  </div>
                )}
                
                <Button 
                  onClick={downloadReceipt} 
                  className="w-full bg-garrison-green hover:bg-green-700"
                  disabled={isDownloading || !isVerified}
                >
                  {isDownloading ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Preparing download...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Download Receipt
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Receipt for PDF generation with improved rendering */}
      {receiptNumber && (
        <div style={{ position: 'absolute', left: '-9999px', top: '-9999px', width: '210mm', height: '297mm' }}>
          <div ref={receiptRef}>
            <Receipt 
              name={formData.name}
              phone={formData.phone}
              email={formData.email}
              nin={formData.nin}
              amount={amount}
              term={term}
              interest={interest}
              totalAmount={totalAmount}
              receiptNumber={receiptNumber}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanDetails;
