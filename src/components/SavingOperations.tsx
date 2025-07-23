
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash, Download, DollarSign, TrendingUp, Calendar, FileText, Save, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface SavingsAccount {
  id: string;
  client_name: string;
  client_id: string;
  account_number: string;
  contact_details: string;
  account_type: string;
  start_date: string;
  status: 'active' | 'dormant' | 'closed';
  current_balance: number;
  initial_deposit: number;
  total_deposited: number;
  total_withdrawn: number;
  interest_earned: number;
  savings_goal?: number;
  maturity_date?: string;
  saving_frequency: string;
  interest_rate: number;
  created_at: string;
  updated_at: string;
}

interface SavingsTransaction {
  id: string;
  account_id: string;
  transaction_date: string;
  transaction_type: 'deposit' | 'withdrawal';
  amount: number;
  balance_after: number;
  payment_method: string;
  reference_number?: string;
  notes?: string;
  created_at: string;
}

interface SavingsPlan {
  id: string;
  account_id: string;
  next_deposit_date?: string;
  advisory_suggestions?: string;
  missed_contributions: number;
  created_at: string;
  updated_at: string;
}

interface InterestSettings {
  id: string;
  account_id: string;
  calculation_method: 'simple' | 'compound';
  interest_period: 'monthly' | 'quarterly' | 'annually';
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

const SavingOperations: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // States for forms
  const [isNewAccountOpen, setIsNewAccountOpen] = useState(false);
  const [isTransactionOpen, setIsTransactionOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<SavingsAccount | null>(null);
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  
  // Form states
  const [accountForm, setAccountForm] = useState({
    client_name: '',
    client_id: '',
    contact_details: '',
    account_type: '',
    start_date: '',
    savings_goal: '',
    maturity_date: '',
    saving_frequency: '',
    interest_rate: '',
    initial_deposit: ''
  });

  const [transactionForm, setTransactionForm] = useState({
    account_id: '',
    transaction_type: '',
    amount: '',
    payment_method: '',
    reference_number: '',
    notes: '',
    transaction_date: new Date().toISOString().split('T')[0]
  });

  const accountTypeOptions = ['Daily Savings', 'Fixed Deposit', 'Target Savings', 'Group Savings', 'Youth Savings'];
  const frequencyOptions = ['Daily', 'Weekly', 'Monthly', 'Ad-hoc'];
  const paymentMethods = ['Cash', 'Mobile Money', 'Bank Transfer', 'Cheque'];

  // Fetch savings accounts
  const { data: savingsAccounts = [], isLoading: accountsLoading } = useQuery({
    queryKey: ['savings-accounts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('savings_accounts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as SavingsAccount[];
    }
  });

  // Fetch transactions
  const { data: transactions = [] } = useQuery({
    queryKey: ['savings-transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('savings_transactions')
        .select('*')
        .order('transaction_date', { ascending: false });
      
      if (error) throw error;
      return data as SavingsTransaction[];
    }
  });

  // Create account mutation
  const createAccountMutation = useMutation({
    mutationFn: async (accountData: any) => {
      // Generate account number
      const { data: accountNumber, error: accountError } = await supabase
        .rpc('generate_savings_account_number');
      
      if (accountError) throw accountError;

      const { data, error } = await supabase
        .from('savings_accounts')
        .insert([{
          ...accountData,
          account_number: accountNumber,
          current_balance: parseFloat(accountData.initial_deposit) || 0,
          total_deposited: parseFloat(accountData.initial_deposit) || 0,
          savings_goal: accountData.savings_goal ? parseFloat(accountData.savings_goal) : null,
          interest_rate: parseFloat(accountData.interest_rate) || 0,
          initial_deposit: parseFloat(accountData.initial_deposit) || 0
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savings-accounts'] });
      toast({ title: "Success", description: "Savings account created successfully" });
      setIsNewAccountOpen(false);
      resetAccountForm();
    },
    onError: (error) => {
      toast({ title: "Error", description: `Failed to create account: ${error.message}`, variant: "destructive" });
    }
  });

  // Create transaction mutation
  const createTransactionMutation = useMutation({
    mutationFn: async (transactionData: any) => {
      const account = savingsAccounts.find(acc => acc.id === transactionData.account_id);
      if (!account) throw new Error('Account not found');

      const amount = parseFloat(transactionData.amount);
      const isDeposit = transactionData.transaction_type === 'deposit';
      const newBalance = isDeposit 
        ? account.current_balance + amount 
        : account.current_balance - amount;

      if (!isDeposit && newBalance < 0) {
        throw new Error('Insufficient balance');
      }

      // Insert transaction
      const { data: transaction, error: transactionError } = await supabase
        .from('savings_transactions')
        .insert([{
          ...transactionData,
          amount,
          balance_after: newBalance
        }])
        .select()
        .single();

      if (transactionError) throw transactionError;

      // Update account balance
      const { error: updateError } = await supabase
        .from('savings_accounts')
        .update({
          current_balance: newBalance,
          total_deposited: isDeposit ? account.total_deposited + amount : account.total_deposited,
          total_withdrawn: !isDeposit ? account.total_withdrawn + amount : account.total_withdrawn,
          updated_at: new Date().toISOString()
        })
        .eq('id', transactionData.account_id);

      if (updateError) throw updateError;

      return transaction;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savings-accounts'] });
      queryClient.invalidateQueries({ queryKey: ['savings-transactions'] });
      toast({ title: "Success", description: "Transaction recorded successfully" });
      setIsTransactionOpen(false);
      resetTransactionForm();
    },
    onError: (error) => {
      toast({ title: "Error", description: `Failed to record transaction: ${error.message}`, variant: "destructive" });
    }
  });

  const resetAccountForm = () => {
    setAccountForm({
      client_name: '',
      client_id: '',
      contact_details: '',
      account_type: '',
      start_date: '',
      savings_goal: '',
      maturity_date: '',
      saving_frequency: '',
      interest_rate: '',
      initial_deposit: ''
    });
    setEditingAccount(null);
  };

  const resetTransactionForm = () => {
    setTransactionForm({
      account_id: '',
      transaction_type: '',
      amount: '',
      payment_method: '',
      reference_number: '',
      notes: '',
      transaction_date: new Date().toISOString().split('T')[0]
    });
  };

  const handleAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createAccountMutation.mutate(accountForm);
  };

  const handleTransactionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTransactionMutation.mutate(transactionForm);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-100 text-green-800',
      dormant: 'bg-yellow-100 text-yellow-800',
      closed: 'bg-red-100 text-red-800'
    };
    return variants[status as keyof typeof variants] || variants.active;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const calculateProgress = (current: number, goal?: number) => {
    if (!goal) return 0;
    return Math.min((current / goal) * 100, 100);
  };

  const getAccountTransactions = (accountId: string) => {
    return transactions.filter(t => t.account_id === accountId);
  };

  if (accountsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Savings Operations</h2>
        <Dialog open={isNewAccountOpen} onOpenChange={setIsNewAccountOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Savings Account
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Savings Account</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAccountSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="client_name">Client Name</Label>
                  <Input
                    id="client_name"
                    value={accountForm.client_name}
                    onChange={(e) => setAccountForm({...accountForm, client_name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="client_id">Client ID</Label>
                  <Input
                    id="client_id"
                    value={accountForm.client_id}
                    onChange={(e) => setAccountForm({...accountForm, client_id: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="contact_details">Contact Details</Label>
                  <Input
                    id="contact_details"
                    value={accountForm.contact_details}
                    onChange={(e) => setAccountForm({...accountForm, contact_details: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="account_type">Account Type</Label>
                  <Select value={accountForm.account_type} onValueChange={(value) => setAccountForm({...accountForm, account_type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                    <SelectContent>
                      {accountTypeOptions.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={accountForm.start_date}
                    onChange={(e) => setAccountForm({...accountForm, start_date: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="saving_frequency">Saving Frequency</Label>
                  <Select value={accountForm.saving_frequency} onValueChange={(value) => setAccountForm({...accountForm, saving_frequency: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      {frequencyOptions.map(freq => (
                        <SelectItem key={freq} value={freq}>{freq}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="interest_rate">Interest Rate (%)</Label>
                  <Input
                    id="interest_rate"
                    type="number"
                    step="0.01"
                    value={accountForm.interest_rate}
                    onChange={(e) => setAccountForm({...accountForm, interest_rate: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="initial_deposit">Initial Deposit</Label>
                  <Input
                    id="initial_deposit"
                    type="number"
                    value={accountForm.initial_deposit}
                    onChange={(e) => setAccountForm({...accountForm, initial_deposit: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="savings_goal">Savings Goal (Optional)</Label>
                  <Input
                    id="savings_goal"
                    type="number"
                    value={accountForm.savings_goal}
                    onChange={(e) => setAccountForm({...accountForm, savings_goal: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="maturity_date">Maturity Date (Optional)</Label>
                  <Input
                    id="maturity_date"
                    type="date"
                    value={accountForm.maturity_date}
                    onChange={(e) => setAccountForm({...accountForm, maturity_date: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsNewAccountOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createAccountMutation.isPending}>
                  {createAccountMutation.isPending ? 'Creating...' : 'Create Account'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Account Overview</TabsTrigger>
          <TabsTrigger value="details">Account Details</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="interest">Interest & Growth</TabsTrigger>
          <TabsTrigger value="plans">Savings Plans</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Savings Accounts Overview</CardTitle>
            </CardHeader>
            <CardContent>
              {savingsAccounts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No savings accounts found. Create your first account to get started.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client Name</TableHead>
                      <TableHead>Account Type</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {savingsAccounts.map((account) => (
                      <TableRow key={account.id}>
                        <TableCell className="font-medium">{account.client_name}</TableCell>
                        <TableCell>{account.account_type}</TableCell>
                        <TableCell className="font-mono">{formatCurrency(account.current_balance)}</TableCell>
                        <TableCell>{new Date(account.start_date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(account.status)}>
                            {account.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                setSelectedAccountId(account.id);
                                setTransactionForm({...transactionForm, account_id: account.id});
                                setIsTransactionOpen(true);
                              }}
                            >
                              <DollarSign className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details">
          {savingsAccounts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No savings accounts found. Create your first account to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {savingsAccounts.map((account) => (
                <Card key={account.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {account.client_name}
                      <Badge className={getStatusBadge(account.status)}>
                        {account.status}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <Label>Account Number</Label>
                        <p className="font-mono font-medium">{account.account_number}</p>
                      </div>
                      <div>
                        <Label>Account Type</Label>
                        <p className="font-medium">{account.account_type}</p>
                      </div>
                      <div>
                        <Label>Contact</Label>
                        <p className="font-medium">{account.contact_details}</p>
                      </div>
                      <div>
                        <Label>Start Date</Label>
                        <p className="font-medium">{new Date(account.start_date).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <Label>Current Balance</Label>
                        <p className="font-mono font-bold text-green-600">{formatCurrency(account.current_balance)}</p>
                      </div>
                      <div>
                        <Label>Interest Rate</Label>
                        <p className="font-medium">{account.interest_rate}% p.a.</p>
                      </div>
                    </div>
                    
                    {account.savings_goal && (
                      <div className="space-y-2">
                        <Label>Savings Goal Progress</Label>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${calculateProgress(account.current_balance, account.savings_goal)}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-gray-600">
                          {formatCurrency(account.current_balance)} of {formatCurrency(account.savings_goal)} 
                          ({calculateProgress(account.current_balance, account.savings_goal).toFixed(1)}%)
                        </p>
                      </div>
                    )}

                    <div className="flex space-x-2 pt-4">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setSelectedAccountId(account.id);
                          setTransactionForm({...transactionForm, account_id: account.id});
                          setIsTransactionOpen(true);
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Transaction
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Account
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Print Summary
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Transaction History
                <Dialog open={isTransactionOpen} onOpenChange={setIsTransactionOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Record Transaction
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Record New Transaction</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleTransactionSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="transaction_account">Client Account</Label>
                        <Select value={transactionForm.account_id} onValueChange={(value) => setTransactionForm({...transactionForm, account_id: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select account" />
                          </SelectTrigger>
                          <SelectContent>
                            {savingsAccounts.map((account) => (
                              <SelectItem key={account.id} value={account.id}>
                                {account.client_name} - {account.account_number}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="transaction_type">Transaction Type</Label>
                        <Select value={transactionForm.transaction_type} onValueChange={(value) => setTransactionForm({...transactionForm, transaction_type: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="deposit">Deposit</SelectItem>
                            <SelectItem value="withdrawal">Withdrawal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="amount">Amount</Label>
                        <Input
                          id="amount"
                          type="number"
                          value={transactionForm.amount}
                          onChange={(e) => setTransactionForm({...transactionForm, amount: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="payment_method">Payment Method</Label>
                        <Select value={transactionForm.payment_method} onValueChange={(value) => setTransactionForm({...transactionForm, payment_method: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select method" />
                          </SelectTrigger>
                          <SelectContent>
                            {paymentMethods.map((method) => (
                              <SelectItem key={method} value={method}>{method}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="reference_number">Reference</Label>
                        <Input
                          id="reference_number"
                          value={transactionForm.reference_number}
                          onChange={(e) => setTransactionForm({...transactionForm, reference_number: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="transaction_date">Date</Label>
                        <Input
                          id="transaction_date"
                          type="date"
                          value={transactionForm.transaction_date}
                          onChange={(e) => setTransactionForm({...transactionForm, transaction_date: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                          id="notes"
                          value={transactionForm.notes}
                          onChange={(e) => setTransactionForm({...transactionForm, notes: e.target.value})}
                          placeholder="Transaction notes..."
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setIsTransactionOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={createTransactionMutation.isPending}>
                          {createTransactionMutation.isPending ? 'Recording...' : 'Record Transaction'}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No transactions recorded yet.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Account</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Balance After</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => {
                      const account = savingsAccounts.find(acc => acc.id === transaction.account_id);
                      return (
                        <TableRow key={transaction.id}>
                          <TableCell>{new Date(transaction.transaction_date).toLocaleDateString()}</TableCell>
                          <TableCell>{account?.client_name || 'Unknown'}</TableCell>
                          <TableCell>
                            <Badge variant={transaction.transaction_type === 'deposit' ? 'default' : 'secondary'}>
                              {transaction.transaction_type}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono">
                            {transaction.transaction_type === 'deposit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                          </TableCell>
                          <TableCell className="font-mono">{formatCurrency(transaction.balance_after)}</TableCell>
                          <TableCell>{transaction.payment_method}</TableCell>
                          <TableCell>{transaction.reference_number || '-'}</TableCell>
                          <TableCell>{transaction.notes || '-'}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interest">
          {savingsAccounts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No savings accounts found. Create your first account to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {savingsAccounts.map((account) => (
                <Card key={account.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                      {account.client_name} - Interest Tracking
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{account.interest_rate}%</div>
                        <div className="text-sm text-gray-600">Interest Rate</div>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-lg font-bold text-blue-600">{formatCurrency(account.interest_earned)}</div>
                        <div className="text-sm text-gray-600">Interest Earned</div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <Label>Interest Calculation Method</Label>
                        <Select defaultValue="simple">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="simple">Simple Interest</SelectItem>
                            <SelectItem value="compound">Compound Interest</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Interest Period</Label>
                        <Select defaultValue="monthly">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="quarterly">Quarterly</SelectItem>
                            <SelectItem value="annually">Annually</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Admin Notes on Interest</Label>
                        <Textarea placeholder="Enter notes about interest adjustments..." />
                      </div>
                    </div>
                    
                    <Button className="w-full">Update Interest Settings</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="plans">
          {savingsAccounts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No savings accounts found. Create your first account to get started.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {savingsAccounts.map((account) => (
                <Card key={account.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                      {account.client_name} - Savings Plan Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-lg font-bold text-blue-600">
                          {Math.floor((new Date().getTime() - new Date(account.start_date).getTime()) / (1000 * 60 * 60 * 24 * 30))} months
                        </div>
                        <div className="text-sm text-gray-600">Duration Saved</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-lg font-bold text-green-600">
                          {account.savings_goal ? calculateProgress(account.current_balance, account.savings_goal).toFixed(1) : 'N/A'}%
                        </div>
                        <div className="text-sm text-gray-600">Progress to Goal</div>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-lg font-bold text-orange-600">0</div>
                        <div className="text-sm text-gray-600">Missed Contributions</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-lg font-bold text-purple-600">{account.saving_frequency}</div>
                        <div className="text-sm text-gray-600">Frequency</div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <Label>Next Expected Deposit Date</Label>
                        <Input type="date" />
                      </div>
                      <div>
                        <Label>Advisory Suggestions</Label>
                        <Textarea 
                          placeholder="Enter advisory suggestions for this client's savings plan..."
                        />
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline">
                        <Edit className="w-4 h-4 mr-2" />
                        Update Plan
                      </Button>
                      <Button variant="outline">
                        <FileText className="w-4 h-4 mr-2" />
                        Generate Report
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SavingOperations;
