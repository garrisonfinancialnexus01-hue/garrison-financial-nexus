import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const RegularClientApplication = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const loanData = location.state;

  if (!loanData || !loanData.existingClient) {
    navigate('/loan-application');
    return null;
  }

  const { amount, term, interest, totalAmount, existingClient } = loanData;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Generate receipt number
      const { data: receiptData, error: receiptError } = await supabase.rpc('generate_receipt_number');
      
      if (receiptError) {
        throw receiptError;
      }

      const receiptNumber = receiptData;

      // Insert loan application
      const { error: insertError } = await supabase
        .from('loan_applications')
        .insert({
          amount,
          interest,
          total_amount: totalAmount,
          name: existingClient.name,
          phone: existingClient.phone,
          email: existingClient.email,
          nin: existingClient.nin,
          term,
          receipt_number: receiptNumber
        });

      if (insertError) {
        throw insertError;
      }

      // Send email notification
      const { error: emailError } = await supabase.functions.invoke('send-loan-application', {
        body: {
          name: existingClient.name,
          phone: existingClient.phone,
          email: existingClient.email,
          nin: existingClient.nin,
          amount,
          interest,
          totalAmount,
          term,
          receiptNumber,
          isRegularClient: true
        }
      });

      if (emailError) {
        console.error('Email error:', emailError);
        // Don't throw here, as the application was still saved
      }

      toast({
        title: "Loan Application Submitted Successfully!",
        description: `Your application for ${amount.toLocaleString()} UGX has been submitted. Receipt number: ${receiptNumber}`,
      });

      navigate('/');
    } catch (error) {
      console.error('Error submitting loan application:', error);
      toast({
        title: "Error",
        description: "Failed to submit loan application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/regular-client-search', { state: { amount, term, interest, totalAmount } });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={handleBack}
          className="text-garrison-green border-garrison-green hover:bg-garrison-green hover:text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Search
        </Button>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-garrison-black mb-4">Regular Client Loan Application</h1>
        <p className="text-gray-600">
          Review your loan details and submit your application.
        </p>
      </div>

      <div className="space-y-6">
        {/* Client Information */}
        <Card className="shadow-lg">
          <CardHeader className="bg-blue-600 text-white">
            <CardTitle>Client Information</CardTitle>
            <CardDescription className="text-white/80">
              Your existing client details
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium text-gray-700">Name:</span>
                <p className="text-garrison-black">{existingClient.name}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Phone:</span>
                <p className="text-garrison-black">{existingClient.phone}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Email:</span>
                <p className="text-garrison-black">{existingClient.email}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">NIN:</span>
                <p className="text-garrison-black">{existingClient.nin}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loan Details */}
        <Card className="shadow-lg">
          <CardHeader className="bg-garrison-green text-white">
            <CardTitle>Loan Details</CardTitle>
            <CardDescription className="text-white/80">
              Your loan application summary
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Loan Amount:</span>
                <span className="text-garrison-black font-semibold">{amount.toLocaleString()} UGX</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Interest Rate:</span>
                <span className="text-garrison-black font-semibold">{interest}%</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Repayment Term:</span>
                <span className="text-garrison-black font-semibold">{term === 'short' ? '14 Days' : '30 Days'}</span>
              </div>
              <div className="flex justify-between border-t pt-4">
                <span className="font-bold text-gray-800">Total Repayment:</span>
                <span className="text-garrison-green font-bold text-lg">{totalAmount.toLocaleString()} UGX</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Information Notice */}
        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Regular Client Benefits</h3>
              <p className="text-blue-700 text-sm">
                As a regular client, we already have your documents on file, so you don't need to resubmit them. 
                Your application will be processed faster using your existing information.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="w-full bg-garrison-green hover:bg-green-700 py-3 text-lg"
            >
              <Send className="mr-2 h-5 w-5" />
              {isSubmitting ? 'Submitting Application...' : 'Submit Loan Application'}
            </Button>
            
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                By submitting this application, you confirm that all information is accurate and agree to our terms and conditions.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegularClientApplication;