
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import LoanDetailsForm, { LoanFormData } from '@/components/LoanDetailsForm';
import { supabase } from '@/integrations/supabase/client';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const LoanDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { amount, term, interest, totalAmount } = location.state || {};

  if (!amount || !term) {
    navigate('/loan-application');
    return null;
  }

  const termText = term === 'short' ? '14 days' : '30 days';

  const generateReceiptPDF = async (formData: LoanFormData, receiptNumber: string): Promise<string> => {
    const pdf = new jsPDF();
    
    // Add company header
    pdf.setFontSize(20);
    pdf.setTextColor(57, 155, 83);
    pdf.text('Garrison Financial Nexus', 105, 20, { align: 'center' });
    
    pdf.setFontSize(16);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Loan Application Receipt', 105, 35, { align: 'center' });
    
    // Add receipt details
    pdf.setFontSize(12);
    const startY = 55;
    const lineHeight = 8;
    let currentY = startY;
    
    const addLine = (label: string, value: string) => {
      pdf.text(`${label}: ${value}`, 20, currentY);
      currentY += lineHeight;
    };
    
    addLine('Receipt Number', receiptNumber);
    addLine('Date', new Date().toLocaleDateString());
    addLine('Name', formData.name);
    addLine('WhatsApp Number', formData.whatsappNumber);
    addLine('Gender', formData.gender);
    addLine('Education', formData.educationDegree);
    addLine('Work Status', formData.workStatus);
    addLine('Monthly Income', formData.monthlyIncome);
    addLine('Marital Status', formData.maritalStatus);
    
    currentY += 5;
    addLine('Emergency Contact Name', formData.emergencyContactName);
    addLine('Emergency Contact Phone', formData.emergencyContactPhone);
    addLine('Emergency Contact Relation', formData.emergencyContactRelation);
    
    currentY += 10;
    pdf.setFontSize(14);
    pdf.setTextColor(57, 155, 83);
    pdf.text('Loan Details', 20, currentY);
    currentY += 10;
    
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    addLine('Loan Amount', `${amount.toLocaleString()} UGX`);
    addLine('Interest Rate', `${interest}%`);
    addLine('Repayment Term', termText);
    addLine('Total Repayment Amount', `${totalAmount.toLocaleString()} UGX`);
    
    currentY += 15;
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text('This receipt confirms your loan application submission.', 20, currentY);
    pdf.text('Our manager will contact you within 24 hours for approval.', 20, currentY + 5);
    
    return pdf.output('datauristring').split(',')[1];
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleFormSubmit = async (formData: LoanFormData, idCardFront: Blob, idCardBack: Blob) => {
    setIsSubmitting(true);
    
    try {
      // Generate receipt number
      const { data: receiptData, error: receiptError } = await supabase.rpc('generate_receipt_number');
      
      if (receiptError) {
        throw new Error('Failed to generate receipt number');
      }
      
      const receiptNumber = receiptData;
      console.log("Generated receipt number:", receiptNumber);

      // Store client information in loan_applications table
      const { error: insertError } = await supabase
        .from('loan_applications')
        .insert({
          amount,
          interest,
          total_amount: totalAmount,
          name: formData.name,
          phone: formData.whatsappNumber,
          email: formData.whatsappNumber, // Using WhatsApp number as contact
          nin: 'N/A', // Will be extracted from ID card
          term: term,
          receipt_number: receiptNumber,
          gender: formData.gender,
          whatsapp_number: formData.whatsappNumber,
          education_degree: formData.educationDegree,
          work_status: formData.workStatus,
          monthly_income: formData.monthlyIncome,
          marital_status: formData.maritalStatus,
          emergency_contact_name: formData.emergencyContactName,
          emergency_contact_phone: formData.emergencyContactPhone,
          emergency_contact_relation: formData.emergencyContactRelation
        });

      if (insertError) {
        console.error('Error storing application:', insertError);
        throw new Error('Failed to store loan application');
      }

      console.log('Application stored in database successfully');

      // Generate PDF receipt
      const receiptPdf = await generateReceiptPDF(formData, receiptNumber);
      console.log("PDF receipt generated successfully");

      // Convert ID card blobs to base64 for email attachment
      const idCardFrontBase64 = await blobToBase64(idCardFront);
      const idCardBackBase64 = await blobToBase64(idCardBack);
      
      console.log("ID card images converted to base64 successfully");

      // Send email with receipt and ID card images
      const { error: emailError } = await supabase.functions.invoke('send-loan-application', {
        body: {
          ...formData,
          amount,
          term,
          interest,
          totalAmount,
          receiptNumber,
          receiptPdf,
          idCardFront: idCardFrontBase64,
          idCardBack: idCardBackBase64
        }
      });

      if (emailError) {
        console.error('Error sending email:', emailError);
        // Don't throw here, as the application was already saved
      }

      console.log('Application submitted successfully');

      toast({
        title: "Application Submitted Successfully!",
        description: `Your receipt number is ${receiptNumber}. Our manager will contact you within 24 hours.`,
      });

      // Navigate to a success page or show receipt download
      navigate('/', { replace: true });

    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <h1 className="text-3xl font-bold text-garrison-black mb-4">Complete Your Loan Application</h1>
        <p className="text-gray-600">
          Please fill in all required information to complete your loan application.
        </p>
      </div>

      {/* Loan Summary */}
      <Card className="mb-8">
        <CardHeader className="bg-garrison-green text-white">
          <CardTitle>Loan Summary</CardTitle>
          <CardDescription className="text-white/80">
            Review your loan details before proceeding
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Loan Amount</p>
              <p className="text-lg font-semibold">{amount.toLocaleString()} UGX</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Interest Rate</p>
              <p className="text-lg font-semibold">{interest}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Repayment Term</p>
              <p className="text-lg font-semibold">{termText}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Repayment</p>
              <p className="text-lg font-semibold text-garrison-green">{totalAmount.toLocaleString()} UGX</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loan Details Form */}
      <LoanDetailsForm 
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default LoanDetails;
