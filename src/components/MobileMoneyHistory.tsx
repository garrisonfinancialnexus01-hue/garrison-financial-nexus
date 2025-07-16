
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, Smartphone, ArrowDownLeft, ArrowUpRight, Clock, CheckCircle, XCircle } from 'lucide-react';
import { mobileMoneyService, MobileMoneyTransaction } from '@/services/mobileMoneyService';
import { format } from 'date-fns';

interface MobileMoneyHistoryProps {
  clientId: string;
}

const MobileMoneyHistory = ({ clientId }: MobileMoneyHistoryProps) => {
  const [transactions, setTransactions] = useState<MobileMoneyTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const fetchTransactions = async () => {
    try {
      const result = await mobileMoneyService.getTransactionHistory(clientId);
      
      if (result.success && result.transactions) {
        setTransactions(result.transactions);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to fetch transaction history",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        title: "Error",
        description: "An error occurred while fetching transactions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [clientId]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchTransactions();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTransactionIcon = (type: string) => {
    return type === 'deposit' 
      ? <ArrowDownLeft className="h-4 w-4 text-green-600" />
      : <ArrowUpRight className="h-4 w-4 text-blue-600" />;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-garrison-green" />
            Mobile Money History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-garrison-green" />
            <span className="ml-2">Loading transactions...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-garrison-green" />
              Mobile Money History
            </CardTitle>
            <CardDescription>
              Your recent mobile money transactions
            </CardDescription>
          </div>
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Smartphone className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No mobile money transactions found</p>
            <p className="text-sm">Your transactions will appear here once you make them</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {getTransactionIcon(transaction.transaction_type)}
                    {getStatusIcon(transaction.status)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium capitalize">
                        {transaction.transaction_type}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {transaction.provider.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      {transaction.client_phone}
                    </div>
                    <div className="text-xs text-gray-500">
                      {format(new Date(transaction.created_at), 'MMM dd, yyyy HH:mm')}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-semibold text-lg">
                    {transaction.transaction_type === 'deposit' ? '+' : '-'}
                    {transaction.amount.toLocaleString()} UGX
                  </div>
                  <div className="flex justify-end">
                    {getStatusBadge(transaction.status)}
                  </div>
                  {transaction.transaction_reference && (
                    <div className="text-xs text-gray-500 mt-1">
                      Ref: {transaction.transaction_reference}
                    </div>
                  )}
                  {transaction.failure_reason && (
                    <div className="text-xs text-red-600 mt-1">
                      {transaction.failure_reason}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MobileMoneyHistory;
