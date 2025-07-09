
import React from 'react';
import { CreditCard, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const RepayLoan = () => {
  const openWhatsApp = () => {
    window.open(`https://wa.me/256761281222`, '_blank');
  };

  return (
    <div className="container mx-auto py-16 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-garrison-green mb-6">Repay Your Loan</h1>
        
        <div className="bg-gray-50 p-6 rounded-md mb-8">
          <p className="text-lg text-center mb-6">
            Ready to repay your loan? Contact our manager on WhatsApp for payment instructions and to complete your repayment process.
          </p>
          
          <div className="flex justify-center">
            <Button 
              onClick={openWhatsApp}
              className="bg-[#25D366] hover:bg-[#128C7E] text-white flex items-center gap-2 py-6 px-8 text-lg"
            >
              <img src="/lovable-uploads/cca0085d-a5e4-45a3-958c-e0e66dc68e16.png" alt="WhatsApp" className="h-6 w-6" />
              Contact Manager on WhatsApp
            </Button>
          </div>
          
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">Manager: +256761281222</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 p-6 rounded-md text-center">
            <CreditCard className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Flexible Payment</h3>
            <p className="text-blue-700">Multiple payment options available to suit your needs</p>
          </div>
          
          <div className="bg-green-50 p-6 rounded-md text-center">
            <Clock className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-800 mb-2">Quick Processing</h3>
            <p className="text-green-700">Fast payment processing and instant confirmation</p>
          </div>
          
          <div className="bg-purple-50 p-6 rounded-md text-center">
            <CheckCircle className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-purple-800 mb-2">Secure & Safe</h3>
            <p className="text-purple-700">All transactions are secure and verified</p>
          </div>
        </div>
        
        <div className="border-t pt-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">Loan Repayment Process</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-medium mb-4 text-garrison-green">Step-by-Step Process:</h3>
              <ol className="list-decimal pl-6 space-y-3">
                <li className="text-gray-700">
                  <strong>Contact Manager:</strong> Click the WhatsApp button above to start a conversation with our loan manager
                </li>
                <li className="text-gray-700">
                  <strong>Provide Loan Details:</strong> Share your loan reference number and personal information for verification
                </li>
                <li className="text-gray-700">
                  <strong>Receive Payment Instructions:</strong> Get detailed payment instructions including amount due and payment methods
                </li>
                <li className="text-gray-700">
                  <strong>Make Payment:</strong> Complete your payment using the provided instructions
                </li>
                <li className="text-gray-700">
                  <strong>Send Confirmation:</strong> Send payment proof/receipt to the manager via WhatsApp
                </li>
                <li className="text-gray-700">
                  <strong>Get Receipt:</strong> Receive your loan closure receipt and updated account statement
                </li>
              </ol>
            </div>
            
            <div>
              <h3 className="text-xl font-medium mb-4 text-garrison-green">What You'll Need:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li className="text-gray-700">Your loan reference number</li>
                <li className="text-gray-700">Valid identification (National ID)</li>
                <li className="text-gray-700">Payment method (Mobile Money, Bank Transfer, etc.)</li>
                <li className="text-gray-700">Phone number for communication</li>
              </ul>
              
              <h3 className="text-xl font-medium mb-4 mt-6 text-garrison-green">Payment Methods Available:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li className="text-gray-700">Mobile Money (MTN, Airtel)</li>
                <li className="text-gray-700">Bank Transfer</li>
                <li className="text-gray-700">Cash Deposit</li>
                <li className="text-gray-700">Online Banking</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-8 bg-garrison-green text-white p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-3">Need Help?</h3>
          <p className="mb-4">
            Our loan manager is available to assist you with any questions about your loan repayment. 
            Don't hesitate to reach out for support throughout the process.
          </p>
          <div className="flex justify-center">
            <Button 
              onClick={openWhatsApp}
              className="bg-white text-garrison-green hover:bg-gray-100"
            >
              <img src="/lovable-uploads/cca0085d-a5e4-45a3-958c-e0e66dc68e16.png" alt="WhatsApp" className="mr-2 h-5 w-5" />
              Get Help via WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepayLoan;
