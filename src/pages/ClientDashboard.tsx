
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useClientAuth } from '@/context/ClientAuthContext';
import { LogOut, DollarSign, CreditCard, MessageCircle } from 'lucide-react';

const ClientDashboard = () => {
  const { currentClient, signOut } = useClientAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentClient) {
      navigate('/client-auth');
    }
  }, [currentClient, navigate]);

  const handleContactManager = (action: string) => {
    const message = `Hello, I would like to ${action} from my account (Account Number: ${currentClient?.account_number}). Please assist me with this transaction.`;
    const whatsappUrl = `https://wa.me/256761281222?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleSignOut = () => {
    signOut();
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
              Welcome back, {currentClient.name}!
            </h2>
            <p className="text-gray-600">Manage your account and transactions below.</p>
          </div>

          {/* Account Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Account Number</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentClient.account_number}</div>
                <p className="text-xs text-muted-foreground">
                  Status: <span className="capitalize text-green-600">{currentClient.status}</span>
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
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-sm">{currentClient.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="text-sm">{currentClient.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">NIN</label>
                  <p className="text-sm">{currentClient.nin}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Account Status</label>
                  <p className="text-sm capitalize text-green-600">{currentClient.status}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your account transactions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  onClick={() => handleContactManager('deposit money')}
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  variant="outline"
                >
                  <DollarSign className="h-6 w-6" />
                  <span>Deposit Money</span>
                </Button>
                <Button 
                  onClick={() => handleContactManager('withdraw money')}
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  variant="outline"
                >
                  <CreditCard className="h-6 w-6" />
                  <span>Withdraw Money</span>
                </Button>
              </div>
              <div className="text-center pt-4">
                <p className="text-sm text-gray-600 mb-4">
                  For all transactions, you will be connected to our manager via WhatsApp.
                </p>
                <Button 
                  onClick={() => handleContactManager('get assistance')}
                  variant="outline"
                  className="w-full md:w-auto"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact Manager Directly
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
