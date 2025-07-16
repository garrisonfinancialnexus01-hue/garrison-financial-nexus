
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ReceiptData {
  company_name: string;
  motto: string;
  transaction_details: {
    record_number: number;
    account_number: string;
    amount_deposited: number;
    amount_withdrawn: number;
    account_balance: number;
    transaction_date: string;
    transaction_time: string;
  };
  generated_at: string;
}

interface ReceiptGeneratorProps {
  receiptData: ReceiptData;
}

export const ReceiptGenerator: React.FC<ReceiptGeneratorProps> = ({ receiptData }) => {
  const { toast } = useToast();

  const generateReceipt = () => {
    try {
      const { transaction_details } = receiptData;
      
      // Create receipt content as plain text (thermal printer style)
      const receiptContent = `
========================================
${receiptData.company_name}
"${receiptData.motto}"
========================================

TRANSACTION RECEIPT
Record No: ${transaction_details.record_number}

Account Number: ${transaction_details.account_number}
Date: ${new Date(transaction_details.transaction_date).toLocaleDateString('en-GB')}
Time: ${new Date(transaction_details.transaction_time).toLocaleString('en-UG', {
        timeZone: 'Africa/Kampala',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })}

----------------------------------------
TRANSACTION DETAILS:
Amount Deposited: ${transaction_details.amount_deposited.toLocaleString()} UGX
Amount Withdrawn: ${transaction_details.amount_withdrawn.toLocaleString()} UGX
Account Balance: ${transaction_details.account_balance.toLocaleString()} UGX
----------------------------------------

Generated: ${new Date(receiptData.generated_at).toLocaleString('en-UG', {
        timeZone: 'Africa/Kampala'
      })}

Thank you for banking with us!
========================================
      `.trim();

      // Create and download the receipt file
      const blob = new Blob([receiptContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `receipt-${transaction_details.record_number}-${transaction_details.account_number}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Receipt downloaded successfully",
      });
    } catch (error) {
      console.error('Error generating receipt:', error);
      toast({
        title: "Error",
        description: "Failed to generate receipt",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      onClick={generateReceipt}
      size="sm"
      variant="outline"
      className="text-blue-600 border-blue-600 hover:bg-blue-50"
    >
      <Download className="h-3 w-3" />
    </Button>
  );
};
