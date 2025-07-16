import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, DollarSign, User, CreditCard, Lock, Eye, EyeOff, Shield, AlertTriangle, FileText } from 'lucide-react';
import { validateAdminToken, markTokenAsUsed } from '@/utils/adminTokenGenerator';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { DailyTransactionsTable } from '@/components/DailyTransactionsTable';
import { AccountStatusManager } from '@/components/AccountStatusManager';

const AdminBalanceEditor = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isCheckingToken, setIsCheckingToken] = useState(true);
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  
  const [accountNumber, setAccountNumber] = useState('');
  const [newBalance, setNewBalance] = useState('');
  const [clientData, setClientData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState('balance');
  const { toast } = useToast();

  const ADMIN_PASSWORD = 'Nalunda@23';

  useEffect(() => {
    const checkTokenAccess = () => {
      const token = searchParams.get('access_token');
      const expires = searchParams.get('expires');
      
      if (!token || !expires) {
        setIsTokenValid(false);
        setIsCheckingToken(false);
        return;
      }

      const expiryTime = parseInt(expires);
      const now = Date.now();
      
      if (now > expiryTime) {
        toast({
          title: "Access Expired",
          description: "This admin access link has expired",
          variant: "destructive",
        });
        setIsTokenValid(false);
        setIsCheckingToken(false);
        return;
      }

      if (validateAdminToken(token)) {
        setIsTokenValid(true);
        markTokenAsUsed(token);
        toast({
          title: "Secure Access Verified",
          description: "Admin access granted via secure email link",
        });
      } else {
        setIsTokenValid(false);
        toast({
          title: "Invalid Access",
          description: "This admin access link is invalid or has been used",
          variant: "destructive",
        });
      }
      
      setIsCheckingToken(false);
    };

    checkTokenAccess();
  }, [searchParams, toast]);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);

    // Simulate a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      toast({
        title: "Access Granted",
        description: "Welcome to the Admin Balance Editor",
      });
    } else {
      toast({
        title: "Access Denied",
        description: "Incorrect password. Please try again.",
        variant: "destructive",
      });
      setPassword('');
    }
    setIsAuthenticating(false);
  };

  const handleSearchClient = async () => {
    if (!accountNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter an account number",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('client_accounts')
        .select('*')
        .eq('account_number', accountNumber.trim())
        .maybeSingle();

      if (error) {
        console.error('Database error:', error);
        toast({
          title: "Error",
          description: "Failed to search for client account",
          variant: "destructive",
        });
        return;
      }

      if (!data) {
        toast({
          title: "Not Found",
          description: "No client account found with this account number",
          variant: "destructive",
        });
        setClientData(null);
        return;
      }

      setClientData(data);
      setNewBalance(data.account_balance.toString());
      toast({
        title: "Client Found",
        description: `Account found for ${data.name}`,
      });
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Error",
        description: "An error occurred while searching for the client",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateBalance = async () => {
    if (!clientData) {
      toast({
        title: "Error",
        description: "No client selected",
        variant: "destructive",
      });
      return;
    }

    const balanceValue = parseFloat(newBalance);
    if (isNaN(balanceValue) || balanceValue < 0) {
      toast({
        title: "Error",
        description: "Please enter a valid balance amount (must be 0 or greater)",
        variant: "destructive",
      });
      return;
    }

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('client_accounts')
        .update({ 
          account_balance: balanceValue,
          updated_at: new Date().toISOString()
        })
        .eq('id', clientData.id);

      if (error) {
        console.error('Update error:', error);
        toast({
          title: "Error",
          description: "Failed to update account balance",
          variant: "destructive",
        });
        return;
      }

      // Update local client data
      setClientData(prev => ({
        ...prev,
        account_balance: balanceValue
      }));

      toast({
        title: "Success",
        description: `Account balance updated to ${balanceValue.toLocaleString()} UGX for ${clientData.name}`,
      });
    } catch (error) {
      console.error('Update error:', error);
      toast({
        title: "Error",
        description: "An error occurred while updating the balance",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReset = () => {
    setAccountNumber('');
    setNewBalance('');
    setClientData(null);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    setAccountNumber('');
    setNewBalance('');
    setClientData(null);
    setActiveTab('balance');
    toast({
      title: "Logged Out",
      description: "You have been logged out from the admin panel",
    });
  };

  const handleStatusUpdate = (newStatus: string) => {
    if (clientData) {
      setClientData(prev => ({
        ...prev,
        status: newStatus
      }));
    }
  };

  if (isCheckingToken) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-garrison-green" />
          <p className="text-gray-600">Verifying secure access...</p>
        </div>
      </div>
    );
  }

  if (!isTokenValid) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="w-full border-red-200">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-2xl text-red-600">
                <AlertTriangle className="h-6 w-6" />
                Access Denied
              </CardTitle>
              <CardDescription className="text-red-500">
                Invalid or expired admin access link
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                This admin access link is either invalid, expired, or has already been used.
              </p>
              <p className="text-sm text-gray-500">
                Please request a new access link from the authorized email address.
              </p>
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="w-full"
              >
                Return to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="w-full">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                <Lock className="h-6 w-6 text-garrison-green" />
                Admin Access Required
              </CardTitle>
              <CardDescription>
                Enter the admin password to access the Balance Editor
              </CardDescription>
              <div className="flex items-center justify-center gap-2 mt-2 text-xs text-green-600">
                <Shield className="h-3 w-3" />
                <span>Secure email access verified</span>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Admin Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter admin password"
                      className="pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-garrison-green hover:bg-garrison-green/90"
                  disabled={isAuthenticating || !password}
                >
                  {isAuthenticating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Access Admin Panel'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-garrison-black mb-2">
              Admin Balance Editor
            </h1>
            <p className="text-gray-600">
              Manage client account balances, daily transactions, and account status for Garrison Financial Nexus
            </p>
            <div className="flex items-center gap-2 mt-2 text-xs text-green-600">
              <Shield className="h-3 w-3" />
              <span>Secure email access • Password verified</span>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="text-red-600 border-red-600 hover:bg-red-50"
          >
            <Lock className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('balance')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'balance'
                  ? 'border-garrison-green text-garrison-green'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <DollarSign className="h-4 w-4 inline mr-2" />
              Balance Editor
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'transactions'
                  ? 'border-garrison-green text-garrison-green'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <FileText className="h-4 w-4 inline mr-2" />
              Daily Transactions
            </button>
          </nav>
        </div>

        {activeTab === 'balance' && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Search Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-garrison-green" />
                    Search Client Account
                  </CardTitle>
                  <CardDescription>
                    Enter the client's account number to find their account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input
                      id="accountNumber"
                      type="text"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder="Enter account number"
                      className="mt-1"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSearchClient}
                      disabled={isLoading}
                      className="bg-garrison-green hover:bg-garrison-green/90"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Searching...
                        </>
                      ) : (
                        'Search Client'
                      )}
                    </Button>
                    <Button
                      onClick={handleReset}
                      variant="outline"
                      disabled={isLoading}
                    >
                      Reset
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Client Details Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-garrison-green" />
                    Client Information
                  </CardTitle>
                  <CardDescription>
                    Review client details before updating balance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {clientData ? (
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Name</Label>
                        <p className="text-garrison-black font-semibold">{clientData.name}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Account Number</Label>
                        <p className="text-garrison-black font-mono">{clientData.account_number}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Email</Label>
                        <p className="text-garrison-black">{clientData.email}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Phone</Label>
                        <p className="text-garrison-black">{clientData.phone}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Current Balance</Label>
                        <p className="text-garrison-green font-bold text-lg">
                          {parseFloat(clientData.account_balance).toLocaleString()} UGX
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Account Status</Label>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          clientData.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : clientData.status === 'suspended'
                            ? 'bg-red-100 text-red-800'
                            : clientData.status === 'inactive'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {clientData.status.charAt(0).toUpperCase() + clientData.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No client selected</p>
                      <p className="text-sm">Search for a client account to view details</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Balance Update Section */}
              {clientData && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-garrison-green" />
                      Update Account Balance
                    </CardTitle>
                    <CardDescription>
                      Enter the new balance amount for {clientData.name}'s account
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="newBalance">New Balance Amount (UGX)</Label>
                      <Input
                        id="newBalance"
                        type="number"
                        step="1"
                        min="0"
                        value={newBalance}
                        onChange={(e) => setNewBalance(e.target.value)}
                        placeholder="Enter new balance amount"
                        className="mt-1"
                      />
                    </div>
                    <div className="flex gap-4 pt-4">
                      <Button
                        onClick={handleUpdateBalance}
                        disabled={isUpdating || !newBalance}
                        className="bg-garrison-green hover:bg-garrison-green/90"
                      >
                        {isUpdating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          'Update Balance'
                        )}
                      </Button>
                      <div className="flex-1 text-right">
                        <p className="text-sm text-gray-600">
                          Current: <span className="font-semibold">{parseFloat(clientData.account_balance).toLocaleString()} UGX</span>
                        </p>
                        {newBalance && !isNaN(parseFloat(newBalance)) && (
                          <p className="text-sm text-garrison-green font-semibold">
                            New: {parseFloat(newBalance).toLocaleString()} UGX
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Account Status Management */}
              <AccountStatusManager 
                clientData={clientData}
                onStatusUpdate={handleStatusUpdate}
              />
            </div>
          </>
        )}

        {activeTab === 'transactions' && (
          <DailyTransactionsTable />
        )}
      </div>
    </div>
  );
};

export default AdminBalanceEditor;
