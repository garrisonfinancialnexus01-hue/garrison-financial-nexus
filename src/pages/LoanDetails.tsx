
import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { isValidUgandanNIN } from '@/utils/ninValidation';
import Receipt from '@/components/Receipt';
import { supabase } from '@/integrations/supabase/client';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Download } from 'lucide-react';

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
    if (name === 'nin' && value.length >= 10) {
      setIsNinValidating(true);
      try {
        const isValid = await isValidUgandanNIN(value);
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
    } else if (errors.nin) {
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    if (validate()) {
      setIsSubmitting(true);
      
      try {
        // Save to Supabase and get receipt number
        const { data, error } = await supabase
          .rpc('generate_receipt_number')
          .single();
          
        if (error) throw error;
        
        const receiptNum = data as string;
        setReceiptNumber(receiptNum);
        
        // Insert application with receipt number
        await supabase.from('loan_applications').insert({
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
        
        toast({
          title: "Application submitted successfully",
          description: "You can now download your receipt.",
        });
      } catch (error) {
        console.error('Error submitting application:', error);
        toast({
          title: "Error submitting application",
          description: "Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  const downloadReceipt = async () => {
    if (!receiptRef.current) return;
    
    try {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Garrison_Financial_Receipt_${receiptNumber}.pdf`);
      
      toast({
        title: "Receipt downloaded",
        description: "Your receipt has been downloaded successfully.",
      });
      
      // Navigate to homepage after successful download
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error downloading receipt",
        description: "Please try again.",
        variant: "destructive"
      });
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
                />
                {isNinValidating && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="h-4 w-4 border-2 border-garrison-green border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              {errors.nin && <p className="text-red-500 text-sm mt-1">{errors.nin}</p>}
              <p className="text-sm text-gray-500">
                Enter your valid Uganda National ID Number
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
                <span>{term === 'short' ? '2 Weeks' : '1 Month'}</span>
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
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing...
                  </>
                ) : "Submit"}
              </Button>
            ) : (
              <Button 
                onClick={downloadReceipt} 
                className="w-full bg-garrison-green hover:bg-green-700"
                disabled={!receiptRef.current}
              >
                <Download className="mr-2 h-4 w-4" />
                Download Receipt
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Hidden receipt for PDF generation */}
      {receiptNumber && (
        <div className="hidden">
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
