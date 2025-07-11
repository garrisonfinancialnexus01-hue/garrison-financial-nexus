
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, History, Download, Upload, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useClientAuth } from '@/context/ClientAuthContext';
import { useToast } from '@/hooks/use-toast';

const TransactionHistory = () => {
  const { currentClient } = useClientAuth();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (currentClient) {
      fetchTransactions();
    }
  }, [currentClient]);

  const fetchTransactions = async () => {
    if (!currentClient) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('mobile_money_transactions')
        .select('*')
        .eq('client_id', currentClient.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching transactions:', error);
        toast({
          title: "Error",
          description: "Failed to load transaction history",
          variant: "destructive",
        });
      } else {
        setTransactions(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getTransactionIcon = (type: string) => {
    return type === 'deposit' ? (
      <Download className="h-4 w-4 text-green-600" />
    ) : (
      <Upload className="h-4 w-4 text-blue-600" />
    );
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
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <Link to="/client-dashboard" className="flex items-center text-garrison-green hover:text-garrison-black mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
              <img 
                src="/lovable-uploads/8514a459-83a5-4a3a-9728-47047e5e465e.png" 
                alt="Garrison Financial Nexus Logo" 
                className="h-8 w-auto mr-3" 
              />
              <h1 className="text-xl font-semibold text-garrison-black">Transaction History</h1>
            </div>
            <Button onClick={fetchTransactions} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <History className="h-5 w-5 mr-2" />
              Mobile Money Transactions
            </CardTitle>
            <CardDescription>
              View all your deposit and withdrawal transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto text-blue-600" />
                <p className="mt-2 text-gray-600">Loading transactions...</p>
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-8">
                <History className="h-12 w-12 mx-auto text-gray-400" />
                <p className="mt-4 text-gray-600">No transactions found</p>
                <p className="text-sm text-gray-500">Your mobile money transactions will appear here</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          <div className="flex items-center">
                            {getTransactionIcon(transaction.transaction_type)}
                            <span className="ml-2 capitalize">{transaction.transaction_type}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {transaction.amount.toLocaleString()} UGX
                        </TableCell>
                        <TableCell>{transaction.provider}</TableCell>
                        <TableCell>{transaction.client_phone}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(transaction.status)}`}>
                            {transaction.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          {new Date(transaction.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TransactionHistory;
