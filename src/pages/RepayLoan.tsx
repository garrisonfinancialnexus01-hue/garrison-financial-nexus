
import React from 'react';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

const RepayLoan = () => {
  const openWhatsApp = () => {
    window.open(`https://wa.me/256761281222`, '_blank');
  };

  return (
    <div className="container mx-auto py-16 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-garrison-green mb-6">Repay Your Loan</h1>
        
        <div className="bg-gray-50 p-6 rounded-md mb-8">
          <p className="text-lg text-center mb-4">
            Want to repay your loan? Contact our Manager on WhatsApp for payment instructions and verification.
          </p>
          
          <div className="flex justify-center">
            <Button 
              onClick={openWhatsApp}
              className="bg-[#25D366] hover:bg-[#128C7E] text-white flex items-center gap-2 py-6 px-8 text-lg"
            >
              <MessageSquare className="h-6 w-6" />
              Contact Manager on WhatsApp
            </Button>
          </div>
        </div>
        
        <div className="mt-8 border-t pt-6">
          <h2 className="text-2xl font-semibold mb-4">Repayment Process</h2>
          <ol className="list-decimal pl-6 space-y-3">
            <li>Contact our manager via WhatsApp using the button above</li>
            <li>Provide your loan reference number</li>
            <li>You will receive payment instructions</li>
            <li>Make your payment using the provided details</li>
            <li>Send payment confirmation to the manager</li>
            <li>Receive your updated loan statement</li>
          </ol>
        </div>
        
        <div className="mt-8 border-t pt-6">
          <h2 className="text-2xl font-semibold mb-4">Verification Process for Receipt Download</h2>
          <p className="mb-4">
            To download your loan receipt, you will need to complete the following verification steps:
          </p>
          <ol className="list-decimal pl-6 space-y-3">
            <li>After submitting your loan application, contact our manager on WhatsApp</li>
            <li>The manager will verify your application details</li>
            <li>Upon verification, the manager will provide you with a 6-digit verification code</li>
            <li>Enter this verification code in the application to unlock your receipt download</li>
            <li>Download and save your receipt for future reference</li>
          </ol>
          <p className="mt-4 text-sm text-gray-600">
            This verification process helps ensure the security of your loan information and prevents unauthorized access to your financial documents.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RepayLoan;
