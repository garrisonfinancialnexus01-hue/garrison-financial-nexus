
import React, { forwardRef } from 'react';
import { format } from 'date-fns';

interface LoanRepaymentReceiptData {
  receiptNo: string;
  date: string;
  time: string;
  paymentMethod: string;
  otherPaymentMethod: string;
  paymentRefNo: string;
  borrowerName: string;
  loanAccountNo: string;
  idNo: string;
  phone: string;
  email: string;
  amountPaid: number;
  amountInWords: string;
  principal: number;
  interest: number;
  penalty: number;
  otherCharges: number;
  balanceAfterPayment: number;
  nextDueDate: string;
  loanAmount: number;
  disbursementDate: string;
  interestRate: number;
  tenure: number;
  repaymentFrequency: string;
  previousBalance: number;
  receivedByStaff: string;
  staffSignatureDate: string;
  borrowerSignatureDate: string;
  notes: string;
}

interface LoanRepaymentReceiptProps {
  data: LoanRepaymentReceiptData;
}

const LoanRepaymentReceipt = forwardRef<HTMLDivElement, LoanRepaymentReceiptProps>(({ data }, ref) => {
  const currentDateTime = format(new Date(), 'MMMM dd, yyyy - h:mm a');

  return (
    <div ref={ref} className="p-8 bg-white text-black max-w-4xl mx-auto" style={{width: '210mm', margin: '0 auto'}}>
      {/* Header */}
      <div className="text-center mb-6 border-b-2 border-garrison-green pb-4">
        <div className="flex items-center justify-center mb-2">
          <img 
            src="/lovable-uploads/fd715cbb-c401-4f16-989c-400d699b5baf.png" 
            alt="Garrison Financial Nexus Logo" 
            className="h-16 w-16 mr-4" 
          />
          <div>
            <h1 className="text-2xl font-bold" style={{color: '#399B53'}}>
              GARRISON FINANCIAL NEXUS
            </h1>
            <p className="text-sm text-gray-600 italic">
              "Your Gateway To Financial Nexus"
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Tel: +256756530349 or +256761281222
            </p>
          </div>
        </div>
        <h2 className="text-xl font-bold mt-4" style={{color: '#000000'}}>
          LOAN REPAYMENT RECEIPT
        </h2>
      </div>

      {/* Receipt Info */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-3 text-garrison-green border-b border-gray-300 pb-1">
          RECEIPT INFO
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="font-semibold">Receipt No.: </span>
            <span className="border-b border-gray-400 inline-block min-w-32">{data.receiptNo}</span>
          </div>
          <div>
            <span className="font-semibold">Date: </span>
            <span className="border-b border-gray-400 inline-block min-w-24">{data.date}</span>
            <span className="font-semibold ml-4">Time: </span>
            <span className="border-b border-gray-400 inline-block min-w-20">{data.time}</span>
          </div>
        </div>
        <div className="mt-3">
          <span className="font-semibold">Payment Method: </span>
          <span className="ml-2">
            {['Cash', 'Bank', 'Mobile Money', 'Cheque'].map(method => (
              <span key={method} className="mr-4">
                <span className="border border-black inline-block w-4 h-4 mr-1 text-center text-xs">
                  {data.paymentMethod === method ? '✓' : ''}
                </span>
                {method}
              </span>
            ))}
            <span className="mr-2">Other:</span>
            <span className="border-b border-gray-400 inline-block min-w-20">
              {data.paymentMethod === 'Other' ? data.otherPaymentMethod : ''}
            </span>
          </span>
        </div>
        <div className="mt-3">
          <span className="font-semibold">Payment Ref. No.: </span>
          <span className="border-b border-gray-400 inline-block min-w-48">{data.paymentRefNo}</span>
        </div>
      </div>

      {/* Borrower Info */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-3 text-garrison-green border-b border-gray-300 pb-1">
          BORROWER INFO
        </h3>
        <div className="space-y-3">
          <div>
            <span className="font-semibold">Name: </span>
            <span className="border-b border-gray-400 inline-block min-w-64">{data.borrowerName}</span>
          </div>
          <div>
            <span className="font-semibold">Loan A/C No.: </span>
            <span className="border-b border-gray-400 inline-block min-w-48">{data.loanAccountNo}</span>
          </div>
          <div>
            <span className="font-semibold">ID No.: </span>
            <span className="border-b border-gray-400 inline-block min-w-48">{data.idNo}</span>
          </div>
          <div>
            <span className="font-semibold">Phone: </span>
            <span className="border-b border-gray-400 inline-block min-w-32">{data.phone}</span>
            <span className="font-semibold ml-8">Email: </span>
            <span className="border-b border-gray-400 inline-block min-w-40">{data.email}</span>
          </div>
        </div>
      </div>

      {/* Payment Details */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-3 text-garrison-green border-b border-gray-300 pb-1">
          PAYMENT DETAILS
        </h3>
        <div className="space-y-3">
          <div>
            <span className="font-semibold">Amount Paid: </span>
            <span className="border-b border-gray-400 inline-block min-w-32 text-right pr-2">
              {data.amountPaid.toLocaleString()} UGX
            </span>
          </div>
          <div>
            <span className="font-semibold">In Words: </span>
            <span className="border-b border-gray-400 inline-block min-w-96">{data.amountInWords}</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-semibold">Principal: </span>
              <span className="border-b border-gray-400 inline-block min-w-24 text-right pr-2">
                {data.principal.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="font-semibold">Interest: </span>
              <span className="border-b border-gray-400 inline-block min-w-24 text-right pr-2">
                {data.interest.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-semibold">Penalty: </span>
              <span className="border-b border-gray-400 inline-block min-w-24 text-right pr-2">
                {data.penalty.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="font-semibold">Other Charges: </span>
              <span className="border-b border-gray-400 inline-block min-w-24 text-right pr-2">
                {data.otherCharges.toLocaleString()}
              </span>
            </div>
          </div>
          <div>
            <span className="font-semibold">Balance After Payment: </span>
            <span className="border-b border-gray-400 inline-block min-w-32 text-right pr-2 font-bold">
              {data.balanceAfterPayment.toLocaleString()} UGX
            </span>
          </div>
          <div>
            <span className="font-semibold">Next Due Date: </span>
            <span className="border-b border-gray-400 inline-block min-w-32">{data.nextDueDate}</span>
          </div>
        </div>
      </div>

      {/* Loan Summary */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-3 text-garrison-green border-b border-gray-300 pb-1">
          LOAN SUMMARY
        </h3>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-semibold">Loan Amount: </span>
              <span className="border-b border-gray-400 inline-block min-w-32 text-right pr-2">
                {data.loanAmount.toLocaleString()} UGX
              </span>
            </div>
            <div>
              <span className="font-semibold">Disbursement Date: </span>
              <span className="border-b border-gray-400 inline-block min-w-24">{data.disbursementDate}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-semibold">Interest Rate: </span>
              <span className="border-b border-gray-400 inline-block min-w-16 text-right pr-2">
                {data.interestRate}
              </span>
              <span className="ml-1">% p.a.</span>
            </div>
            <div>
              <span className="font-semibold">Tenure: </span>
              <span className="border-b border-gray-400 inline-block min-w-16 text-right pr-2">
                {data.tenure}
              </span>
              <span className="ml-1">Days</span>
            </div>
          </div>
          <div>
            <span className="font-semibold">Repayment Frequency: </span>
            <span className="ml-2">
              {['Weekly', 'Monthly', 'Quarterly'].map(freq => (
                <span key={freq} className="mr-4">
                  <span className="border border-black inline-block w-4 h-4 mr-1 text-center text-xs">
                    {data.repaymentFrequency === freq ? '✓' : ''}
                  </span>
                  {freq}
                </span>
              ))}
            </span>
          </div>
          <div>
            <span className="font-semibold">Previous Balance: </span>
            <span className="border-b border-gray-400 inline-block min-w-32 text-right pr-2">
              {data.previousBalance.toLocaleString()} UGX
            </span>
          </div>
        </div>
      </div>

      {/* Authorization */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-3 text-garrison-green border-b border-gray-300 pb-1">
          AUTHORIZATION
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <span className="font-semibold">Received By (Staff): </span>
              <div className="border-b border-gray-400 inline-block min-w-40 mt-2">{data.receivedByStaff}</div>
            </div>
            <div>
              <span className="font-semibold">Borrower's Signature: </span>
              <div className="border-b border-gray-400 inline-block min-w-40 mt-2 h-8"></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <span className="font-semibold">Signature: </span>
              <div className="border-b border-gray-400 inline-block min-w-32 mt-2 h-8"></div>
              <span className="font-semibold ml-4">Date: </span>
              <span className="border-b border-gray-400 inline-block min-w-24">{data.staffSignatureDate}</span>
            </div>
            <div>
              <span className="font-semibold">Date: </span>
              <span className="border-b border-gray-400 inline-block min-w-24">{data.borrowerSignatureDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-3 text-garrison-green border-b border-gray-300 pb-1">
          NOTES
        </h3>
        <div className="space-y-2">
          <p className="text-sm">This receipt confirms the above payment.</p>
          <p className="text-sm">Please keep this document safe for future reference.</p>
          {data.notes && (
            <div className="mt-3">
              <span className="font-semibold">Additional Notes: </span>
              <p className="text-sm mt-1">{data.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-500">
        <p>Generated on: {currentDateTime}</p>
        <p className="mt-1">This is a computer-generated receipt and is valid without signature.</p>
      </div>
    </div>
  );
});

LoanRepaymentReceipt.displayName = 'LoanRepaymentReceipt';

export default LoanRepaymentReceipt;
