
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
  
  // Create safe object URLs with error handling
  const createSafeObjectURL = (blob: Blob | null) => {
    try {
      return blob ? URL.createObjectURL(blob) : null;
    } catch (error) {
      console.warn('Failed to create object URL:', error);
      return null;
    }
  };

  const frontImageUrl = createSafeObjectURL(idCardFront);
  const backImageUrl = createSafeObjectURL(idCardBack);
  
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
          <div>Receipt #{receiptNumber || 'N/A'}</div>
          <div>{currentDateTime}</div>
        </div>
      </div>
      
      <div className="border-t border-b border-gray-300 py-4 my-4">
        <h2 className="text-xl font-bold mb-4">Loan Application Details</h2>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="text-gray-600">Applicant Name:</div>
          <div>{name || 'N/A'}</div>
          
          <div className="text-gray-600">Phone Number:</div>
          <div>{phone || 'N/A'}</div>
          
          <div className="text-gray-600">Email Address:</div>
          <div>{email || 'N/A'}</div>
        </div>
      </div>
      
      <div className="my-4">
        <h2 className="text-xl font-bold mb-4">Loan Summary</h2>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="text-gray-600">Loan Amount:</div>
          <div>{amount ? amount.toLocaleString() : '0'} UGX</div>
          
          <div className="text-gray-600">Loan Term:</div>
          <div>{term === 'short' ? '14 Days' : '30 Days'}</div>
          
          <div className="text-gray-600">Interest Rate:</div>
          <div>{interest || 0}%</div>
          
          <div className="text-gray-600 font-bold">Total Repayment Amount:</div>
          <div className="font-bold">{totalAmount ? totalAmount.toLocaleString() : '0'} UGX</div>
        </div>
      </div>
      
      {/* ID Card images for internal receipt only (not for client download) */}
      {(frontImageUrl || backImageUrl) && (
        <div className="my-4 border-t border-gray-300 pt-4 internal-only">
          <h2 className="text-xl font-bold mb-4">Identity Verification (Internal Use Only)</h2>
          
          <div className="grid grid-cols-2 gap-4">
            {frontImageUrl && (
              <div>
                <p className="text-gray-600 mb-2">ID Card Front:</p>
                <img 
                  src={frontImageUrl} 
                  alt="ID Card Front" 
                  className="border rounded-md w-full object-contain"
                  style={{maxHeight: '200px'}}
                  onError={() => console.warn('Failed to load front ID image')}
                />
              </div>
            )}
            
            {backImageUrl && (
              <div>
                <p className="text-gray-600 mb-2">ID Card Back:</p>
                <img 
                  src={backImageUrl} 
                  alt="ID Card Back" 
                  className="border rounded-md w-full object-contain"
                  style={{maxHeight: '200px'}}
                  onError={() => console.warn('Failed to load back ID image')}
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
    </div>
  );
});

Receipt.displayName = 'Receipt';

export default Receipt;
