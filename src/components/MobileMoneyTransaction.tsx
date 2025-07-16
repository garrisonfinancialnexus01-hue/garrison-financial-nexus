
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Smartphone, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { mobileMoneyService, MobileMoneyProvider, TransactionType } from '@/services/mobileMoneyService';

interface MobileMoneyTransactionProps {
  clientId: string;
  currentBalance: number;
  onTransactionComplete: () => void;
}

const MobileMoneyTransaction = ({ clientId, currentBalance, onTransactionComplete }: MobileMoneyTransactionProps) => {
  const [transactionType, setTransactionType] = useState<TransactionType>('deposit');
  const [provider, setProvider] = useState<MobileMoneyProvider>('airtel');
  const [amount, setAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !phoneNumber) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    if (transactionType === 'withdraw' && amountValue > currentBalance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough balance for this withdrawal",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      let result;
      if (transactionType === 'deposit') {
        result = await mobileMoneyService.initiateDeposit(clientId, amountValue, phoneNumber, provider);
      } else {
        result = await mobileMoneyService.initiateWithdrawal(clientId, amountValue, phoneNumber, provider);
      }

      if (result.success && result.transaction) {
        setTransactionId(result.transaction.id);
        toast({
          title: "Transaction Initiated",
          description: `${transactionType === 'deposit' ? 'Deposit' : 'Withdrawal'} request sent to ${provider.toUpperCase()}. Please complete the payment on your phone.`,
        });
        
        // Start checking transaction status
        checkTransactionStatus(result.transaction.id);
      } else {
        toast({
          title: "Transaction Failed",
          description: result.error || 'Failed to initiate transaction',
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Transaction error:', error);
      toast({
        title: "Error",
        description: "An error occurred while processing the transaction",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const checkTransactionStatus = async (txId: string) => {
    setIsCheckingStatus(true);
    
    const maxAttempts = 30; // Check for up to 5 minutes (30 attempts * 10 seconds)
    let attempts = 0;

    const statusInterval = setInterval(async () => {
      attempts++;
      
      try {
        const result = await mobileMoneyService.checkTransactionStatus(txId);
        
        if (result.success && result.status) {
          if (result.status === 'completed') {
            clearInterval(statusInterval);
            setIsCheckingStatus(false);
            setTransactionId(null);
            toast({
              title: "Transaction Completed",
              description: `${transactionType === 'deposit' ? 'Deposit' : 'Withdrawal'} completed successfully!`,
            });
            onTransactionComplete();
            resetForm();
          } else if (result.status === 'failed') {
            clearInterval(statusInterval);
            setIsCheckingStatus(false);
            setTransactionId(null);
            toast({
              title: "Transaction Failed",
              description: "The transaction was not completed. Please try again.",
              variant: "destructive",
            });
          }
        }
        
        if (attempts >= maxAttempts) {
          clearInterval(statusInterval);
          setIsCheckingStatus(false);
          setTransactionId(null);
          toast({
            title: "Transaction Timeout",
            description: "Transaction is taking longer than expected. Please check your transaction history.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Status check error:', error);
      }
    }, 10000); // Check every 10 seconds
  };

  const resetForm = () => {
    setAmount('');
    setPhoneNumber('');
    setTransactionId(null);
  };

  const cancelTransaction = () => {
    setIsCheckingStatus(false);
    setTransactionId(null);
    resetForm();
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="h-5 w-5 text-garrison-green" />
          Mobile Money Transaction
        </CardTitle>
        <CardDescription>
          Send or receive money using Airtel or MTN Mobile Money
        </CardDescription>
      </CardHeader>
      <CardContent>
        {transactionId && isCheckingStatus ? (
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-garrison-green" />
              <span>Waiting for payment confirmation...</span>
            </div>
            <p className="text-sm text-gray-600">
              Please complete the payment on your phone. This may take a few minutes.
            </p>
            <Button onClick={cancelTransaction} variant="outline" className="w-full">
              Cancel
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="transactionType">Transaction Type</Label>
              <Select value={transactionType} onValueChange={(value: TransactionType) => setTransactionType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="deposit">
                    <div className="flex items-center gap-2">
                      <ArrowDownLeft className="h-4 w-4 text-green-600" />
                      Deposit Money
                    </div>
                  </SelectItem>
                  <SelectItem value="withdraw">
                    <div className="flex items-center gap-2">
                      <ArrowUpRight className="h-4 w-4 text-blue-600" />
                      Withdraw Money
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="provider">Mobile Money Provider</Label>
              <Select value={provider} onValueChange={(value: MobileMoneyProvider) => setProvider(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="airtel">Airtel Money</SelectItem>
                  <SelectItem value="mtn">MTN Mobile Money</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (UGX)</Label>
              <Input
                id="amount"
                type="number"
                min="1000"
                step="1000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                required
              />
              {transactionType === 'withdraw' && (
                <p className="text-xs text-gray-600">
                  Available balance: {currentBalance.toLocaleString()} UGX
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="256701234567"
                required
              />
              <p className="text-xs text-gray-500">
                Enter your {provider === 'airtel' ? 'Airtel' : 'MTN'} phone number
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-garrison-green hover:bg-garrison-green/90"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                `${transactionType === 'deposit' ? 'Request Deposit' : 'Request Withdrawal'}`
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default MobileMoneyTransaction;
