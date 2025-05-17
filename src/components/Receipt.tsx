
import React from 'react';
import { format } from 'date-fns';

interface ReceiptProps {
  name: string;
  phone: string;
  email: string;
  nin: string;
  amount: number;
  term: 'short' | 'medium';
  interest: number;
  totalAmount: number;
  receiptNumber: string;
}

const Receipt = ({ name, phone, email, nin, amount, term, interest, totalAmount, receiptNumber }: ReceiptProps) => {
  return (
    <div className="p-8 bg-white text-black" id="receipt" style={{width: '210mm', minHeight: '297mm'}}>
      <div className="flex justify-between items-center mb-6">
        <div className="font-bold text-xl text-garrison-green">Garrison Financial Nexus</div>
        <div className="text-right">
          <div>Receipt #{receiptNumber}</div>
          <div>{format(new Date(), 'MMMM dd, yyyy')}</div>
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
          
          <div className="text-gray-600">NIN:</div>
          <div>{nin}</div>
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
      
      <div className="mt-8 pt-4 border-t border-gray-300 text-center text-sm text-gray-500">
        <p>Thank you for choosing Garrison Financial Nexus for your financial needs.</p>
        <p>For any inquiries, please contact our customer service.</p>
      </div>
    </div>
  );
};

export default Receipt;
