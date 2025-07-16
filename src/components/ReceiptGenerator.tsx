
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generatePDFReceipt } from '@/utils/pdfReceiptGenerator';

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
      generatePDFReceipt(receiptData);
      
      toast({
        title: "Success",
        description: "Receipt PDF downloaded successfully",
      });
    } catch (error) {
      console.error('Error generating PDF receipt:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF receipt",
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
