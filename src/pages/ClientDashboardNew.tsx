
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogOut, DollarSign, CreditCard, User, Calendar } from 'lucide-react';

interface ClientAccount {
  id: string;
  account_number: string;
  name: string;
  email: string;
  phone: string;
  nin: string;
  account_balance: number;
  status: 'pending' | 'active' | 'suspended';
  created_at: string;
}

const ClientDashboardNew = () => {
  const [currentClient, setCurrentClient] = useState<ClientAccount | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedClient = localStorage.getItem('currentClient');
    if (storedClient) {
      try {
        setCurrentClient(JSON.parse(storedClient));
      } catch (error) {
        console.error('Error parsing stored client data:', error);
        navigate('/client-signin');
      }
    } else {
      navigate('/client-signin');
    }
  }, [navigate]);

  const handleTransaction = (transactionType: string) => {
    navigate('/transaction-request', { state: { transactionType } });
  };

  const handleSignOut = () => {
    localStorage.removeItem('currentClient');
    navigate('/');
  };

  if (!currentClient) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/8514a459-83a5-4a3a-9728-47047e5e465e.png" 
                alt="Garrison Financial Nexus Logo" 
                className="h-8 w-auto mr-3" 
              />
              <h1 className="text-xl font-semibold text-garrison-black">Client Dashboard</h1>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-garrison-black mb-2">
              Welcome, {currentClient.name}!
            </h2>
            <p className="text-gray-600">Manage your account and transactions below.</p>
          </div>

          {/* Account Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Account Number</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentClient.account_number}</div>
                <p className="text-xs text-muted-foreground">
                  Active Account
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Account Balance</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {currentClient.account_balance.toLocaleString()} UGX
                </div>
                <p className="text-xs text-muted-foreground">
                  Available balance
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Account Status</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold capitalize text-green-600">
                  {currentClient.status}
                </div>
                <p className="text-xs text-muted-foreground">
                  Member since {new Date(currentClient.created_at).getFullYear()}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Your registered account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Full Name</label>
                  <p className="text-sm">{currentClient.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email Address</label>
                  <p className="text-sm">{currentClient.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone Number</label>
                  <p className="text-sm">{currentClient.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Account Number</label>
                  <p className="text-sm">{currentClient.account_number}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Account Balance</label>
                  <p className="text-sm">{currentClient.account_balance.toLocaleString()} UGX</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <p className="text-sm capitalize text-green-600">{currentClient.status}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transaction Buttons */}
          <Card>
            <CardHeader>
              <CardTitle>Account Transactions</CardTitle>
              <CardDescription>Deposit or withdraw money from your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  onClick={() => handleTransaction('deposit money')}
                  className="h-20 flex flex-col items-center justify-center space-y-2 bg-green-600 hover:bg-green-700 text-white"
                >
                  <DollarSign className="h-6 w-6" />
                  <span>Deposit Money</span>
                </Button>
                <Button 
                  onClick={() => handleTransaction('withdraw money')}
                  className="h-20 flex flex-col items-center justify-center space-y-2 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <CreditCard className="h-6 w-6" />
                  <span>Withdraw Money</span>
                </Button>
              </div>
              <div className="text-center pt-4">
                <p className="text-sm text-gray-600">
                  All transactions are processed through our manager via WhatsApp (+256761281222)
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboardNew;
