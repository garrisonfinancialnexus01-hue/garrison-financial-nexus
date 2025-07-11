
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Smartphone, DollarSign } from 'lucide-react';
import { useClientAuth } from '@/context/ClientAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const MobileMoneyDeposit = () => {
  const { currentClient } = useClientAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [amount, setAmount] = useState('');
  const [provider, setProvider] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentClient) {
      toast({
        title: "Error",
        description: "Please log in to continue",
        variant: "destructive",
      });
      return;
    }

    if (!amount || !provider || !phoneNumber) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const depositAmount = parseFloat(amount);
    if (depositAmount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Create mobile money transaction record
      const { data: transaction, error } = await supabase
        .from('mobile_money_transactions')
        .insert({
          client_id: currentClient.id,
          transaction_type: 'deposit',
          provider: provider,
          amount: depositAmount,
          client_phone: phoneNumber,
          status: 'pending'
        })
        .select()
        .single();

      if (error) {
        console.error('Transaction creation error:', error);
        toast({
          title: "Error",
          description: "Failed to create transaction. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Transaction Initiated",
        description: `Your deposit request of ${depositAmount.toLocaleString()} UGX has been created. You will receive a prompt on your phone shortly.`,
      });

      // Navigate to transaction status page
      navigate('/transaction-status', { 
        state: { 
          transactionId: transaction.id,
          transactionType: 'deposit',
          amount: depositAmount,
          provider: provider
        } 
      });

    } catch (error) {
      console.error('Deposit error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center">Please log in to access this page.</p>
            <Link to="/client-auth" className="block mt-4">
              <Button className="w-full">Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link to="/client-dashboard" className="flex items-center text-garrison-green hover:text-garrison-black mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
            <img 
              src="/lovable-uploads/8514a459-83a5-4a3a-9728-47047e5e465e.png" 
              alt="Garrison Financial Nexus Logo" 
              className="h-8 w-auto mr-3" 
            />
            <h1 className="text-xl font-semibold text-garrison-black">Mobile Money Deposit</h1>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-green-600" />
              Deposit Money
            </CardTitle>
            <CardDescription>
              Add money to your account using Mobile Money (MTN or Airtel)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (UGX)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="1000"
                  step="1000"
                  required
                />
                <p className="text-sm text-gray-500">Minimum deposit: 1,000 UGX</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="provider">Mobile Money Provider</Label>
                <Select value={provider} onValueChange={setProvider} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MTN">MTN Mobile Money</SelectItem>
                    <SelectItem value="AIRTEL">Airtel Money</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Your Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="e.g., 0700123456"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
                <p className="text-sm text-gray-500">
                  Enter the phone number registered with your mobile money account
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 flex items-center mb-2">
                  <Smartphone className="h-4 w-4 mr-2" />
                  How it works:
                </h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>1. Fill in the amount and your phone number</li>
                  <li>2. You'll receive a payment prompt on your phone</li>
                  <li>3. Confirm the payment using your Mobile Money PIN</li>
                  <li>4. Your account balance will be updated automatically</li>
                </ul>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Initiate Deposit"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MobileMoneyDeposit;
