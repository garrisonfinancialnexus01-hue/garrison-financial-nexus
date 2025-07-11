
import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, Clock, XCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useClientAuth } from '@/context/ClientAuthContext';

const TransactionStatus = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentClient } = useClientAuth();
  const [transaction, setTransaction] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const transactionData = location.state;

  useEffect(() => {
    if (!transactionData?.transactionId) {
      navigate('/client-dashboard');
      return;
    }

    fetchTransactionStatus();
    
    // Set up real-time subscription for transaction updates
    const channel = supabase
      .channel('transaction-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'mobile_money_transactions',
          filter: `id=eq.${transactionData.transactionId}`
        },
        (payload) => {
          setTransaction(payload.new);
        }
      )
      .subscribe();

    // Poll for status updates every 10 seconds
    const interval = setInterval(fetchTransactionStatus, 10000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [transactionData?.transactionId]);

  const fetchTransactionStatus = async () => {
    if (!transactionData?.transactionId) return;

    try {
      const { data, error } = await supabase
        .from('mobile_money_transactions')
        .select('*')
        .eq('id', transactionData.transactionId)
        .single();

      if (error) {
        console.error('Error fetching transaction:', error);
      } else {
        setTransaction(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-8 w-8 text-green-600" />;
      case 'failed':
      case 'cancelled':
        return <XCircle className="h-8 w-8 text-red-600" />;
      case 'processing':
        return <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />;
      default:
        return <Clock className="h-8 w-8 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'failed':
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      case 'processing':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-yellow-600 bg-yellow-50';
    }
  };

  const getStatusMessage = (status: string, transactionType: string) => {
    switch (status) {
      case 'pending':
        return transactionType === 'deposit' 
          ? 'Waiting for payment confirmation...' 
          : 'Processing withdrawal request...';
      case 'processing':
        return 'Transaction is being processed...';
      case 'completed':
        return transactionType === 'deposit' 
          ? 'Money successfully added to your account!' 
          : 'Money successfully sent to your phone!';
      case 'failed':
        return 'Transaction failed. Please try again.';
      case 'cancelled':
        return 'Transaction was cancelled.';
      default:
        return 'Processing transaction...';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
          <p className="mt-2 text-gray-600">Loading transaction status...</p>
        </div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p>Transaction not found.</p>
            <Link to="/client-dashboard" className="block mt-4">
              <Button className="w-full">Back to Dashboard</Button>
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
            <h1 className="text-xl font-semibold text-garrison-black">Transaction Status</h1>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {getStatusIcon(transaction.status)}
            </div>
            <CardTitle className="text-xl">
              {transaction.transaction_type === 'deposit' ? 'Deposit' : 'Withdrawal'} Status
            </CardTitle>
            <CardDescription>
              Transaction ID: {transaction.id}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className={`p-4 rounded-lg text-center ${getStatusColor(transaction.status)}`}>
              <p className="font-semibold capitalize">{transaction.status}</p>
              <p className="text-sm mt-1">
                {getStatusMessage(transaction.status, transaction.transaction_type)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Amount</p>
                <p className="text-lg font-semibold">{transaction.amount.toLocaleString()} UGX</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Provider</p>
                <p className="text-lg font-semibold">{transaction.provider}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Phone Number</p>
                <p className="text-lg font-semibold">{transaction.client_phone}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Created</p>
                <p className="text-lg font-semibold">
                  {new Date(transaction.created_at).toLocaleString()}
                </p>
              </div>
            </div>

            {transaction.failure_reason && (
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-red-800">Failure Reason:</p>
                <p className="text-sm text-red-700">{transaction.failure_reason}</p>
              </div>
            )}

            <div className="flex space-x-4">
              <Button 
                onClick={() => navigate('/client-dashboard')}
                className="flex-1"
              >
                Back to Dashboard
              </Button>
              {(transaction.status === 'failed' || transaction.status === 'cancelled') && (
                <Button 
                  onClick={() => navigate(transaction.transaction_type === 'deposit' ? '/mobile-money-deposit' : '/mobile-money-withdraw')}
                  variant="outline"
                  className="flex-1"
                >
                  Try Again
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TransactionStatus;
