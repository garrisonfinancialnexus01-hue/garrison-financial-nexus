
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, AlertCircle } from 'lucide-react';

const LoanApplication = () => {
  const [amount, setAmount] = useState('');
  const [term, setTerm] = useState<'short' | 'medium'>('short');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const termParam = params.get('term');
    if (termParam && (termParam === 'short' || termParam === 'medium')) {
      setTerm(termParam);
    }
  }, [location.search]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    
    if (value && (Number(value) < 10000 || Number(value) > 500000)) {
      setError('Please enter an amount between 10,000 UGX and 500,000 UGX');
    } else {
      setError('');
    }
  };

  const openWhatsApp = () => {
    window.open(`https://wa.me/256761281222`, '_blank');
  };

  const handleConfirm = () => {
    if (!amount) {
      setError('Please enter a loan amount');
      return;
    }

    const amountNum = Number(amount);
    if (isNaN(amountNum) || amountNum < 10000 || amountNum > 500000) {
      setError('Please enter an amount between 10,000 UGX and 500,000 UGX');
      return;
    }

    const interest = term === 'short' ? 0.1 : 0.18;
    const totalAmount = amountNum + (amountNum * interest);

    navigate('/loan-details', { 
      state: { 
        amount: amountNum, 
        term: term, 
        interest: interest * 100, 
        totalAmount: totalAmount 
      } 
    });

    toast({
      title: "Loan application initiated",
      description: `${amountNum.toLocaleString()} UGX with ${term === 'short' ? '14 days' : '30 days'} term`,
    });
  };

  const calculateTotal = () => {
    if (!amount || isNaN(Number(amount))) return '';
    
    const amountNum = Number(amount);
    const interest = term === 'short' ? 0.1 : 0.18;
    return (amountNum + (amountNum * interest)).toLocaleString();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-garrison-black mb-4">Loan Application</h1>
        <p className="text-gray-600">
          Please fill in the details below to apply for your loan.
        </p>
      </div>

      <Card className="shadow-lg">
        <CardHeader className="bg-garrison-green text-white">
          <CardTitle>Loan Details</CardTitle>
          <CardDescription className="text-white/80">
            Enter your loan amount and select a repayment term
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="amount">Loan Amount (UGX)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount (10,000 - 500,000 UGX)"
                value={amount}
                onChange={handleAmountChange}
                className={error ? "border-red-500" : ""}
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
              <p className="text-sm text-gray-500">
                Please input amount that ranges from 10,000 UGX to 500,000 UGX
              </p>
            </div>

            <div className="space-y-2">
              <Label>Repayment Term</Label>
              <RadioGroup value={term} onValueChange={(value) => setTerm(value as 'short' | 'medium')} className="flex flex-col space-y-4">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="short" id="short" />
                  <Label htmlFor="short" className="cursor-pointer">
                    Pay after 14 days (10% interest)
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium" className="cursor-pointer">
                    Pay after 30 days (18% interest)
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {amount && !error && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-garrison-black">Loan Summary:</p>
                <div className="flex justify-between mt-2 text-sm">
                  <span>Loan Amount:</span>
                  <span>{Number(amount).toLocaleString()} UGX</span>
                </div>
                <div className="flex justify-between mt-1 text-sm">
                  <span>Interest Rate:</span>
                  <span>{term === 'short' ? '10%' : '18%'}</span>
                </div>
                <div className="flex justify-between mt-1 text-sm">
                  <span>Repayment Term:</span>
                  <span>{term === 'short' ? '14 Days' : '30 Days'}</span>
                </div>
                <div className="flex justify-between mt-3 font-medium">
                  <span>Total Repayment:</span>
                  <span>{calculateTotal()} UGX</span>
                </div>
              </div>
            )}

            <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800">Important Verification Info</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    After submitting your application, you'll need to scan your National ID card and 
                    contact our manager on WhatsApp to receive a verification code before downloading your receipt.
                  </p>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleConfirm} 
              disabled={!!error || !amount}
              className="w-full bg-garrison-green hover:bg-green-700"
            >
              Continue
            </Button>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-600 mb-2">Need help with your loan?</p>
              <Button
                variant="outline"
                onClick={openWhatsApp}
                className="text-garrison-green border-garrison-green hover:bg-garrison-green hover:text-white"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Contact Manager on WhatsApp
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoanApplication;
