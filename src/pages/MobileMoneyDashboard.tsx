
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Smartphone, Wallet, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import MobileMoneyTransaction from '@/components/MobileMoneyTransaction';
import MobileMoneyHistory from '@/components/MobileMoneyHistory';

const MobileMoneyDashboard = () => {
  const [clientData, setClientData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // For demo purposes, using a hardcoded client ID
  // In a real app, this would come from authentication context
  const demoClientId = 'demo-client-123';

  const fetchClientData = async () => {
    try {
      // For demo, we'll create a mock client if it doesn't exist
      let { data: client, error } = await supabase
        .from('client_accounts')
        .select('*')
        .eq('id', demoClientId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching client data:', error);
        toast({
          title: "Error",
          description: "Failed to fetch account information",
          variant: "destructive",
        });
        return;
      }

      if (!client) {
        // Create demo client account
        const { data: newClient, error: createError } = await supabase
          .from('client_accounts')
          .insert({
            id: demoClientId,
            account_number: 'ACC-DEMO-001',
            name: 'Demo User',
            email: 'demo@example.com',
            phone: '+256701234567',
            nin: 'CM12345678901234',
            password_hash: 'demo_hash',
            account_balance: 50000,
            status: 'active'
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating demo client:', createError);
          toast({
            title: "Error",
            description: "Failed to create demo account",
            variant: "destructive",
          });
          return;
        }

        client = newClient;
        toast({
          title: "Demo Account Created",
          description: "A demo account has been created for testing mobile money features",
        });
      }

      setClientData(client);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An error occurred while loading account data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClientData();
  }, []);

  const handleTransactionComplete = () => {
    // Refresh client data to get updated balance
    fetchClientData();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-garrison-green" />
          <p className="text-gray-600">Loading your account...</p>
        </div>
      </div>
    );
  }

  if (!clientData) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-red-600">Account Not Found</CardTitle>
            <CardDescription>
              Unable to load account information
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-garrison-black mb-2">
            Mobile Money Dashboard
          </h1>
          <p className="text-gray-600">
            Send and receive money using Airtel and MTN Mobile Money
          </p>
        </div>

        {/* Account Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Account Balance</CardTitle>
              <Wallet className="h-4 w-4 text-garrison-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-garrison-green">
                {clientData.account_balance.toLocaleString()} UGX
              </div>
              <p className="text-xs text-muted-foreground">
                Available for transactions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Account Holder</CardTitle>
              <Smartphone className="h-4 w-4 text-garrison-green" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold">{clientData.name}</div>
              <p className="text-xs text-muted-foreground">
                {clientData.phone}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Account Number</CardTitle>
              <Wallet className="h-4 w-4 text-garrison-green" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-mono">{clientData.account_number}</div>
              <p className="text-xs text-muted-foreground">
                Garrison Financial Nexus
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Mobile Money Features */}
        <Tabs defaultValue="transaction" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="transaction">New Transaction</TabsTrigger>
            <TabsTrigger value="history">Transaction History</TabsTrigger>
          </TabsList>

          <TabsContent value="transaction" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <MobileMoneyTransaction
                  clientId={clientData.id}
                  currentBalance={clientData.account_balance}
                  onTransactionComplete={handleTransactionComplete}
                />
              </div>
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>How Mobile Money Works</CardTitle>
                    <CardDescription>
                      Simple steps to send and receive money
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="bg-garrison-green text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                          1
                        </div>
                        <div>
                          <h4 className="font-medium">Choose Transaction Type</h4>
                          <p className="text-sm text-gray-600">
                            Select whether you want to deposit or withdraw money
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-garrison-green text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                          2
                        </div>
                        <div>
                          <h4 className="font-medium">Select Provider</h4>
                          <p className="text-sm text-gray-600">
                            Choose between Airtel Money or MTN Mobile Money
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-garrison-green text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                          3
                        </div>
                        <div>
                          <h4 className="font-medium">Complete on Phone</h4>
                          <p className="text-sm text-gray-600">
                            Follow the prompts on your mobile phone to authorize the transaction
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-garrison-green text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                          4
                        </div>
                        <div>
                          <h4 className="font-medium">Instant Update</h4>
                          <p className="text-sm text-gray-600">
                            Your account balance will update automatically once confirmed
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <MobileMoneyHistory clientId={clientData.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MobileMoneyDashboard;
