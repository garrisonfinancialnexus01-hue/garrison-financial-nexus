import React, { forwardRef } from 'react';
import { format } from 'date-fns';

interface ReceiptProps {
  name: string;
  phone: string;
  email: string;
  amount: number;
  term: 'short' | 'medium';
  interest: number;
  totalAmount: number;
  receiptNumber: string;
  idCardFront?: Blob | null;
  idCardBack?: Blob | null;
}

const Receipt = forwardRef<HTMLDivElement, ReceiptProps>(({ 
  name, 
  phone, 
  email, 
  amount, 
  term, 
  interest, 
  totalAmount, 
  receiptNumber,
  idCardFront,
  idCardBack
}, ref) => {
  // Format the current date with time
  const currentDateTime = format(new Date(), 'MMMM dd, yyyy - h:mm a');
  
  return (
    <div ref={ref} className="p-8 bg-white text-black" id="receipt" style={{width: '210mm', height: '297mm', margin: '0 auto'}}>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/fd715cbb-c401-4f16-989c-400d699b5baf.png" 
            alt="Garrison Financial Nexus Logo" 
            className="h-16 w-16 mr-3" 
          />
          <div className="font-bold text-xl text-garrison-green">Garrison Financial Nexus</div>
        </div>
        <div className="text-right">
          <div>Receipt #{receiptNumber}</div>
          <div>{currentDateTime}</div>
        </div>
      </div>
      
      <div className="border-t border-b border-gray-300 py-4 my-4">
        <h2 className="text-xl font-bold mb-4">Loan Application Details</h2>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="text-gray-600">Applicant Name:</div>
          <div>{name}</div>
          
          <div className="text-gray-600">Phone Number:</div>
          <div>{phone}</div>
          
          <div className="text-gray-600">Email Address:</div>
          <div>{email}</div>
        </div>
      </div>
      
      <div className="my-4">
        <h2 className="text-xl font-bold mb-4">Loan Summary</h2>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="text-gray-600">Loan Amount:</div>
          <div>{amount.toLocaleString()} UGX</div>
          
          <div className="text-gray-600">Loan Term:</div>
          <div>{term === 'short' ? '14 Days' : '30 Days'}</div>
          
          <div className="text-gray-600">Interest Rate:</div>
          <div>{interest}%</div>
          
          <div className="text-gray-600 font-bold">Total Repayment Amount:</div>
          <div className="font-bold">{totalAmount.toLocaleString()} UGX</div>
        </div>
      </div>
      
      {/* ID Card images for internal receipt only (not for client download) */}
      {(idCardFront || idCardBack) && (
        <div className="my-4 border-t border-gray-300 pt-4 internal-only">
          <h2 className="text-xl font-bold mb-4">Identity Verification (Internal Use Only)</h2>
          
          <div className="grid grid-cols-2 gap-4">
            {idCardFront && (
              <div>
                <p className="text-gray-600 mb-2">ID Card Front:</p>
                <img 
                  src={URL.createObjectURL(idCardFront)} 
                  alt="ID Card Front" 
                  className="border rounded-md w-full object-contain"
                  style={{maxHeight: '200px'}}
                />
              </div>
            )}
            
            {idCardBack && (
              <div>
                <p className="text-gray-600 mb-2">ID Card Back:</p>
                <img 
                  src={URL.createObjectURL(idCardBack)} 
                  alt="ID Card Back" 
                  className="border rounded-md w-full object-contain"
                  style={{maxHeight: '200px'}}
                />
              </div>
            )}
          </div>
          
          <p className="text-sm text-red-600 mt-2">
            Note: ID card images are for internal verification purposes only and should not be shared.
          </p>
        </div>
      )}
      
      <div className="mt-8 pt-4 border-t border-gray-300 text-center text-sm text-gray-500">
        <p>Thank you for choosing Garrison Financial Nexus for your financial needs.</p>
        <p>For any inquiries, please contact our customer service at garrisonfinancialnexus01@gmail.com</p>
        <p>Date and Time of Issue: {currentDateTime}</p>
      </div>
      
      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            .internal-only {
              display: none !important;
            }
          }
        `
      }} />
    </div>
  );
});

Receipt.displayName = 'Receipt';

export default Receipt;
