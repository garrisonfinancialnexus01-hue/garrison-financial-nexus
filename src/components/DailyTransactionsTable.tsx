import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Download, Plus, Save, Trash2 } from 'lucide-react';
import { ReceiptGenerator } from './ReceiptGenerator';

interface TransactionRecord {
  id?: string;
  record_number: number;
  account_number: string;
  amount_deposited: number;
  amount_withdrawn: number;
  account_balance: number;
  transaction_date: string;
  transaction_time: string;
  receipt_data?: any;
}

export const DailyTransactionsTable = () => {
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('daily_transaction_records')
        .select('*')
        .order('record_number', { ascending: true });

      if (error) {
        console.error('Error fetching transactions:', error);
        toast({
          title: "Error",
          description: "Failed to load transaction records",
          variant: "destructive",
        });
        return;
      }

      setTransactions(data || []);
      
      // Add an empty row if no transactions exist
      if (!data || data.length === 0) {
        addNewRow();
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast({
        title: "Error",
        description: "An error occurred while loading records",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addNewRow = () => {
    const newRecord: TransactionRecord = {
      record_number: transactions.length + 1,
      account_number: '',
      amount_deposited: 0,
      amount_withdrawn: 0,
      account_balance: 0,
      transaction_date: new Date().toISOString().split('T')[0],
      transaction_time: new Date().toISOString(),
    };
    setTransactions([...transactions, newRecord]);
  };

  const updateTransaction = (index: number, field: keyof TransactionRecord, value: any) => {
    const updatedTransactions = [...transactions];
    updatedTransactions[index] = {
      ...updatedTransactions[index],
      [field]: value
    };
    setTransactions(updatedTransactions);
  };

  const saveTransaction = async (index: number) => {
    const transaction = transactions[index];
    
    if (!transaction.account_number.trim()) {
      toast({
        title: "Error",
        description: "Account number is required",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      // Create receipt data as a plain object that conforms to Json type
      const receiptData = {
        company_name: "Garrison Financial Nexus",
        motto: "Your Gateway To Financial Prosperity",
        transaction_details: {
          record_number: transaction.record_number,
          account_number: transaction.account_number,
          amount_deposited: transaction.amount_deposited,
          amount_withdrawn: transaction.amount_withdrawn,
          account_balance: transaction.account_balance,
          transaction_date: transaction.transaction_date,
          transaction_time: transaction.transaction_time
        },
        generated_at: new Date().toISOString()
      };

      const transactionData = {
        record_number: transaction.record_number,
        account_number: transaction.account_number,
        amount_deposited: parseFloat(transaction.amount_deposited.toString()) || 0,
        amount_withdrawn: parseFloat(transaction.amount_withdrawn.toString()) || 0,
        account_balance: parseFloat(transaction.account_balance.toString()) || 0,
        transaction_date: transaction.transaction_date,
        receipt_data: receiptData
      };

      let result;
      if (transaction.id) {
        result = await supabase
          .from('daily_transaction_records')
          .update(transactionData)
          .eq('id', transaction.id)
          .select()
          .single();
      } else {
        result = await supabase
          .from('daily_transaction_records')
          .insert(transactionData)
          .select()
          .single();
      }

      if (result.error) {
        console.error('Save error:', result.error);
        toast({
          title: "Error",
          description: "Failed to save transaction record",
          variant: "destructive",
        });
        return;
      }

      // Update the local state with the saved record
      const updatedTransactions = [...transactions];
      updatedTransactions[index] = result.data;
      setTransactions(updatedTransactions);

      toast({
        title: "Success",
        description: "Transaction record saved successfully",
      });

      // Add a new empty row if this is the last row
      if (index === transactions.length - 1) {
        addNewRow();
      }
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Error",
        description: "An error occurred while saving",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const deleteTransaction = async (index: number) => {
    const transaction = transactions[index];
    
    if (transaction.id) {
      try {
        const { error } = await supabase
          .from('daily_transaction_records')
          .delete()
          .eq('id', transaction.id);

        if (error) {
          console.error('Delete error:', error);
          toast({
            title: "Error",
            description: "Failed to delete transaction record",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Success",
          description: "Transaction record deleted successfully",
        });
      } catch (error) {
        console.error('Delete error:', error);
        toast({
          title: "Error",
          description: "An error occurred while deleting",
          variant: "destructive",
        });
        return;
      }
    }

    // Remove from local state
    const updatedTransactions = transactions.filter((_, i) => i !== index);
    setTransactions(updatedTransactions);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-garrison-green" />
        <span className="ml-2">Loading transaction records...</span>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Daily Transactions Tracking Record
          <Button
            onClick={addNewRow}
            className="bg-garrison-green hover:bg-garrison-green/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Row
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-2 py-2 text-left">No.</th>
                <th className="border border-gray-300 px-2 py-2 text-left">A/C No.</th>
                <th className="border border-gray-300 px-2 py-2 text-left">Amount Deposited</th>
                <th className="border border-gray-300 px-2 py-2 text-left">Amount Withdrawn</th>
                <th className="border border-gray-300 px-2 py-2 text-left">A/C Bal</th>
                <th className="border border-gray-300 px-2 py-2 text-left">Date</th>
                <th className="border border-gray-300 px-2 py-2 text-left">Time</th>
                <th className="border border-gray-300 px-2 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr key={transaction.id || `new-${index}`} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-2 py-2">
                    <Input
                      type="number"
                      value={transaction.record_number}
                      onChange={(e) => updateTransaction(index, 'record_number', parseInt(e.target.value) || 0)}
                      className="w-20"
                    />
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    <Input
                      value={transaction.account_number}
                      onChange={(e) => updateTransaction(index, 'account_number', e.target.value)}
                      placeholder="Account Number"
                      className="w-32"
                    />
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    <Input
                      type="number"
                      step="0.01"
                      value={transaction.amount_deposited}
                      onChange={(e) => updateTransaction(index, 'amount_deposited', parseFloat(e.target.value) || 0)}
                      className="w-32"
                    />
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    <Input
                      type="number"
                      step="0.01"
                      value={transaction.amount_withdrawn}
                      onChange={(e) => updateTransaction(index, 'amount_withdrawn', parseFloat(e.target.value) || 0)}
                      className="w-32"
                    />
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    <Input
                      type="number"
                      step="0.01"
                      value={transaction.account_balance}
                      onChange={(e) => updateTransaction(index, 'account_balance', parseFloat(e.target.value) || 0)}
                      className="w-32"
                    />
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    <Input
                      type="date"
                      value={transaction.transaction_date}
                      onChange={(e) => updateTransaction(index, 'transaction_date', e.target.value)}
                      className="w-36"
                    />
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    <div className="text-sm text-gray-600 w-40">
                      {transaction.transaction_time 
                        ? new Date(transaction.transaction_time).toLocaleString('en-UG', {
                            timeZone: 'Africa/Kampala',
                            hour12: false,
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                          })
                        : 'Auto-generated'
                      }
                    </div>
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    <div className="flex gap-1">
                      <Button
                        onClick={() => saveTransaction(index)}
                        disabled={isSaving}
                        size="sm"
                        className="bg-garrison-green hover:bg-garrison-green/90"
                      >
                        <Save className="h-3 w-3" />
                      </Button>
                      {transaction.id && transaction.receipt_data && (
                        <ReceiptGenerator 
                          receiptData={transaction.receipt_data}
                        />
                      )}
                      <Button
                        onClick={() => deleteTransaction(index)}
                        size="sm"
                        variant="destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
