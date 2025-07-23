
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
import { Plus, Edit, Trash, Download, DollarSign, TrendingUp, Calendar, FileText, Save, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface SavingsAccount {
  id: string;
  client_name: string;
  client_nin: string;
  client_phone: string;
  client_email: string;
  account_number: string;
  account_type: string;
  status: 'active' | 'inactive';
  initial_deposit: number;
  current_balance: number;
  target_amount: number;
  target_date: string;
  interest_rate: number;
  saving_frequency: string;
  total_deposited: number;
  total_withdrawn: number;
  interest_earned: number;
  missed_contributions: number;
  last_deposit_date: string;
  created_at: string;
  updated_at: string;
}

interface SavingsTransaction {
  id: string;
  savings_account_id: string;
  transaction_date: string;
  transaction_type: 'deposit' | 'withdrawal';
  amount: number;
  balance_after: number;
  payment_method: string;
  reference: string;
  notes: string;
}

const SavingOperations: React.FC = () => {
  const [savingsAccounts, setSavingsAccounts] = useState<SavingsAccount[]>([]);
  const [transactions, setTransactions] = useState<SavingsTransaction[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [editingAccount, setEditingAccount] = useState<string | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<SavingsAccount>>({});
  const [transactionForm, setTransactionForm] = useState<Partial<SavingsTransaction>>({});
  const [newTransactionForm, setNewTransactionForm] = useState({
    account_id: '',
    transaction_type: 'deposit',
    amount: '',
    payment_method: 'Cash',
    reference: '',
    notes: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [isNewAccountOpen, setIsNewAccountOpen] = useState(false);
  const [newAccountForm, setNewAccountForm] = useState({
    client_name: '',
    client_nin: '',
    client_phone: '',
    client_email: '',
    account_type: 'Daily Savings',
    initial_deposit: '',
    target_amount: '',
    target_date: '',
    interest_rate: '12',
    saving_frequency: 'Daily'
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const accountTypeOptions = ['Daily Savings', 'Fixed Deposit', 'Target Savings', 'Group Savings', 'Youth Savings'];
  const frequencyOptions = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Annually'];
  const paymentMethods = ['Cash', 'Mobile Money', 'Bank Transfer', 'Cheque'];

  useEffect(() => {
    fetchSavingsAccounts();
    if (selectedAccount) {
      fetchTransactions(selectedAccount);
    }
  }, [selectedAccount]);

  const fetchSavingsAccounts = async () => {
    try {
      const { data, error } = await supabase
        .from('saving_operations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavingsAccounts(data || []);
    } catch (error) {
      console.error('Error fetching savings accounts:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch savings accounts',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async (accountId: string) => {
    try {
      const { data, error } = await supabase
        .from('savings_transactions')
        .select('*')
        .eq('savings_account_id', accountId)
        .order('transaction_date', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch transactions',
        variant: 'destructive'
      });
    }
  };

  const handleSaveAccount = async () => {
    if (!editingAccount) return;

    try {
      const { error } = await supabase
        .from('saving_operations')
        .update({
          ...editForm,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingAccount);

      if (error) throw error;

      await fetchSavingsAccounts();
      setEditingAccount(null);
      setEditForm({});
      toast({
        title: 'Success',
        description: 'Account updated successfully'
      });
    } catch (error) {
      console.error('Error updating account:', error);
      toast({
        title: 'Error',
        description: 'Failed to update account',
        variant: 'destructive'
      });
    }
  };

  const handleCreateAccount = async () => {
    try {
      const accountNumber = `SAV${String(savingsAccounts.length + 1).padStart(3, '0')}`;
      
      const { error } = await supabase
        .from('saving_operations')
        .insert([{
          client_name: newAccountForm.client_name,
          client_nin: newAccountForm.client_nin,
          client_phone: newAccountForm.client_phone,
          client_email: newAccountForm.client_email,
          account_number: accountNumber,
          account_type: newAccountForm.account_type,
          initial_deposit: Number(newAccountForm.initial_deposit),
          current_balance: Number(newAccountForm.initial_deposit),
          target_amount: Number(newAccountForm.target_amount) || null,
          target_date: newAccountForm.target_date || null,
          interest_rate: Number(newAccountForm.interest_rate),
          saving_frequency: newAccountForm.saving_frequency,
          total_deposited: Number(newAccountForm.initial_deposit),
          status: 'active'
        }]);

      if (error) throw error;

      await fetchSavingsAccounts();
      setIsNewAccountOpen(false);
      setNewAccountForm({
        client_name: '',
        client_nin: '',
        client_phone: '',
        client_email: '',
        account_type: 'Daily Savings',
        initial_deposit: '',
        target_amount: '',
        target_date: '',
        interest_rate: '12',
        saving_frequency: 'Daily'
      });
      toast({
        title: 'Success',
        description: 'New savings account created successfully'
      });
    } catch (error) {
      console.error('Error creating account:', error);
      toast({
        title: 'Error',
        description: 'Failed to create account',
        variant: 'destructive'
      });
    }
  };

  const handleRecordTransaction = async () => {
    if (!newTransactionForm.account_id || !newTransactionForm.amount) return;

    try {
      const account = savingsAccounts.find(acc => acc.id === newTransactionForm.account_id);
      if (!account) return;

      const amount = Number(newTransactionForm.amount);
      const isDeposit = newTransactionForm.transaction_type === 'deposit';
      const newBalance = isDeposit ? account.current_balance + amount : account.current_balance - amount;

      if (!isDeposit && newBalance < 0) {
        toast({
          title: 'Error',
          description: 'Insufficient balance for withdrawal',
          variant: 'destructive'
        });
        return;
      }

      const { error: transactionError } = await supabase
        .from('savings_transactions')
        .insert([{
          savings_account_id: newTransactionForm.account_id,
          transaction_date: newTransactionForm.date,
          transaction_type: newTransactionForm.transaction_type,
          amount: amount,
          balance_after: newBalance,
          payment_method: newTransactionForm.payment_method,
          reference: newTransactionForm.reference,
          notes: newTransactionForm.notes
        }]);

      if (transactionError) throw transactionError;

      const updateData: any = {
        current_balance: newBalance,
        updated_at: new Date().toISOString()
      };

      if (isDeposit) {
        updateData.total_deposited = account.total_deposited + amount;
        updateData.last_deposit_date = newTransactionForm.date;
      } else {
        updateData.total_withdrawn = account.total_withdrawn + amount;
      }

      const { error: accountError } = await supabase
        .from('saving_operations')
        .update(updateData)
        .eq('id', newTransactionForm.account_id);

      if (accountError) throw accountError;

      await fetchSavingsAccounts();
      await fetchTransactions(newTransactionForm.account_id);
      
      setNewTransactionForm({
        account_id: '',
        transaction_type: 'deposit',
        amount: '',
        payment_method: 'Cash',
        reference: '',
        notes: '',
        date: new Date().toISOString().split('T')[0]
      });

      toast({
        title: 'Success',
        description: 'Transaction recorded successfully'
      });
    } catch (error) {
      console.error('Error recording transaction:', error);
      toast({
        title: 'Error',
        description: 'Failed to record transaction',
        variant: 'destructive'
      });
    }
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

  const calculateDurationInMonths = (startDate: string) => {
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - start.getTime());
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
    return diffMonths;
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800'
    };
    return variants[status as keyof typeof variants] || variants.active;
  };

  const startEditing = (account: SavingsAccount) => {
    setEditingAccount(account.id);
    setEditForm(account);
  };

  const cancelEditing = () => {
    setEditingAccount(null);
    setEditForm({});
  };

  const generateAccountReport = (account: SavingsAccount) => {
    const reportData = {
      accountNumber: account.account_number,
      clientName: account.client_name,
      currentBalance: formatCurrency(account.current_balance),
      targetAmount: account.target_amount ? formatCurrency(account.target_amount) : 'N/A',
      interestRate: `${account.interest_rate}%`,
      totalDeposited: formatCurrency(account.total_deposited),
      totalWithdrawn: formatCurrency(account.total_withdrawn),
      interestEarned: formatCurrency(account.interest_earned)
    };

    const reportContent = `
SAVINGS ACCOUNT REPORT
====================
Account Number: ${reportData.accountNumber}
Client Name: ${reportData.clientName}
Current Balance: ${reportData.currentBalance}
Target Amount: ${reportData.targetAmount}
Interest Rate: ${reportData.interestRate}
Total Deposited: ${reportData.totalDeposited}
Total Withdrawn: ${reportData.totalWithdrawn}
Interest Earned: ${reportData.interestEarned}

Generated on: ${new Date().toLocaleDateString()}
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `savings-report-${account.account_number}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading savings accounts...</div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Client Name</Label>
                <Input 
                  value={newAccountForm.client_name}
                  onChange={(e) => setNewAccountForm({...newAccountForm, client_name: e.target.value})}
                  placeholder="Enter client name"
                />
              </div>
              <div>
                <Label>NIN</Label>
                <Input 
                  value={newAccountForm.client_nin}
                  onChange={(e) => setNewAccountForm({...newAccountForm, client_nin: e.target.value})}
                  placeholder="Enter NIN"
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input 
                  value={newAccountForm.client_phone}
                  onChange={(e) => setNewAccountForm({...newAccountForm, client_phone: e.target.value})}
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input 
                  value={newAccountForm.client_email}
                  onChange={(e) => setNewAccountForm({...newAccountForm, client_email: e.target.value})}
                  placeholder="Enter email"
                />
              </div>
              <div>
                <Label>Account Type</Label>
                <Select value={newAccountForm.account_type} onValueChange={(value) => setNewAccountForm({...newAccountForm, account_type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {accountTypeOptions.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Initial Deposit</Label>
                <Input 
                  type="number"
                  value={newAccountForm.initial_deposit}
                  onChange={(e) => setNewAccountForm({...newAccountForm, initial_deposit: e.target.value})}
                  placeholder="Enter amount"
                />
              </div>
              <div>
                <Label>Target Amount</Label>
                <Input 
                  type="number"
                  value={newAccountForm.target_amount}
                  onChange={(e) => setNewAccountForm({...newAccountForm, target_amount: e.target.value})}
                  placeholder="Enter target amount"
                />
              </div>
              <div>
                <Label>Target Date</Label>
                <Input 
                  type="date"
                  value={newAccountForm.target_date}
                  onChange={(e) => setNewAccountForm({...newAccountForm, target_date: e.target.value})}
                />
              </div>
              <div>
                <Label>Interest Rate (%)</Label>
                <Input 
                  type="number"
                  value={newAccountForm.interest_rate}
                  onChange={(e) => setNewAccountForm({...newAccountForm, interest_rate: e.target.value})}
                  placeholder="Enter interest rate"
                />
              </div>
              <div>
                <Label>Saving Frequency</Label>
                <Select value={newAccountForm.saving_frequency} onValueChange={(value) => setNewAccountForm({...newAccountForm, saving_frequency: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {frequencyOptions.map(freq => (
                      <SelectItem key={freq} value={freq}>{freq}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setIsNewAccountOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateAccount}>Create Account</Button>
            </div>
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client Name</TableHead>
                    <TableHead>Account Number</TableHead>
                    <TableHead>Account Type</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Last Deposit</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {savingsAccounts.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell className="font-medium">{account.client_name}</TableCell>
                      <TableCell className="font-mono">{account.account_number}</TableCell>
                      <TableCell>{account.account_type}</TableCell>
                      <TableCell className="font-mono">{formatCurrency(account.current_balance)}</TableCell>
                      <TableCell>{account.last_deposit_date || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(account.status)}>
                          {account.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => setSelectedAccount(account.id)}>
                            <DollarSign className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => startEditing(account)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => generateAccountReport(account)}>
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {savingsAccounts.map((account) => (
              <Card key={account.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {account.client_name}
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusBadge(account.status)}>
                        {account.status}
                      </Badge>
                      {editingAccount === account.id ? (
                        <div className="flex space-x-2">
                          <Button size="sm" onClick={handleSaveAccount}>
                            <Save className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={cancelEditing}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => startEditing(account)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <Label>Account Number</Label>
                      {editingAccount === account.id ? (
                        <Input 
                          value={editForm.account_number || ''}
                          onChange={(e) => setEditForm({...editForm, account_number: e.target.value})}
                        />
                      ) : (
                        <p className="font-mono font-medium">{account.account_number}</p>
                      )}
                    </div>
                    <div>
                      <Label>Account Type</Label>
                      {editingAccount === account.id ? (
                        <Select value={editForm.account_type} onValueChange={(value) => setEditForm({...editForm, account_type: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {accountTypeOptions.map(type => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="font-medium">{account.account_type}</p>
                      )}
                    </div>
                    <div>
                      <Label>Contact</Label>
                      {editingAccount === account.id ? (
                        <Input 
                          value={editForm.client_phone || ''}
                          onChange={(e) => setEditForm({...editForm, client_phone: e.target.value})}
                        />
                      ) : (
                        <p className="font-medium">{account.client_phone}</p>
                      )}
                    </div>
                    <div>
                      <Label>Start Date</Label>
                      <p className="font-medium">{new Date(account.created_at).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <Label>Current Balance</Label>
                      {editingAccount === account.id ? (
                        <Input 
                          type="number"
                          value={editForm.current_balance || ''}
                          onChange={(e) => setEditForm({...editForm, current_balance: Number(e.target.value)})}
                        />
                      ) : (
                        <p className="font-mono font-bold text-green-600">{formatCurrency(account.current_balance)}</p>
                      )}
                    </div>
                    <div>
                      <Label>Interest Rate</Label>
                      {editingAccount === account.id ? (
                        <Input 
                          type="number"
                          value={editForm.interest_rate || ''}
                          onChange={(e) => setEditForm({...editForm, interest_rate: Number(e.target.value)})}
                        />
                      ) : (
                        <p className="font-medium">{account.interest_rate}% p.a.</p>
                      )}
                    </div>
                  </div>
                  
                  {account.target_amount && (
                    <div className="space-y-2">
                      <Label>Savings Goal Progress</Label>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${calculateProgress(account.current_balance, account.target_amount)}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-600">
                        {formatCurrency(account.current_balance)} of {formatCurrency(account.target_amount)} 
                        ({calculateProgress(account.current_balance, account.target_amount).toFixed(1)}%)
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Label>Select Account</Label>
                <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account to view transactions" />
                  </SelectTrigger>
                  <SelectContent>
                    {savingsAccounts.map(account => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.client_name} - {account.account_number}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedAccount && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Balance After</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{transaction.transaction_date}</TableCell>
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
                        <TableCell>{transaction.reference}</TableCell>
                        <TableCell>{transaction.notes}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}

              <div className="mt-6 border rounded-lg p-4 bg-gray-50">
                <h4 className="font-medium mb-4">Record New Transaction</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label>Client Account</Label>
                    <Select value={newTransactionForm.account_id} onValueChange={(value) => setNewTransactionForm({...newTransactionForm, account_id: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select account" />
                      </SelectTrigger>
                      <SelectContent>
                        {savingsAccounts.map(account => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.client_name} - {account.account_number}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Transaction Type</Label>
                    <Select value={newTransactionForm.transaction_type} onValueChange={(value) => setNewTransactionForm({...newTransactionForm, transaction_type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="deposit">Deposit</SelectItem>
                        <SelectItem value="withdrawal">Withdrawal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Amount</Label>
                    <Input 
                      type="number" 
                      value={newTransactionForm.amount}
                      onChange={(e) => setNewTransactionForm({...newTransactionForm, amount: e.target.value})}
                      placeholder="Enter amount" 
                    />
                  </div>
                  <div>
                    <Label>Payment Method</Label>
                    <Select value={newTransactionForm.payment_method} onValueChange={(value) => setNewTransactionForm({...newTransactionForm, payment_method: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentMethods.map(method => (
                          <SelectItem key={method} value={method}>{method}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Reference</Label>
                    <Input 
                      value={newTransactionForm.reference}
                      onChange={(e) => setNewTransactionForm({...newTransactionForm, reference: e.target.value})}
                      placeholder="Transaction reference" 
                    />
                  </div>
                  <div>
                    <Label>Date</Label>
                    <Input 
                      type="date" 
                      value={newTransactionForm.date}
                      onChange={(e) => setNewTransactionForm({...newTransactionForm, date: e.target.value})}
                    />
                  </div>
                  <div className="md:col-span-2 lg:col-span-3">
                    <Label>Notes</Label>
                    <Textarea 
                      value={newTransactionForm.notes}
                      onChange={(e) => setNewTransactionForm({...newTransactionForm, notes: e.target.value})}
                      placeholder="Transaction notes..." 
                    />
                  </div>
                </div>
                <Button className="mt-4" onClick={handleRecordTransaction}>
                  Record Transaction
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interest">
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
                      <Label>Update Interest Rate (%)</Label>
                      <Input 
                        type="number"
                        placeholder="Enter new interest rate"
                        onChange={(e) => setEditForm({...editForm, interest_rate: Number(e.target.value)})}
                      />
                    </div>
                    <div>
                      <Label>Update Interest Earned</Label>
                      <Input 
                        type="number"
                        placeholder="Enter interest earned"
                        onChange={(e) => setEditForm({...editForm, interest_earned: Number(e.target.value)})}
                      />
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full"
                    onClick={() => {
                      setEditingAccount(account.id);
                      handleSaveAccount();
                    }}
                  >
                    Update Interest Settings
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="plans">
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
                        {calculateDurationInMonths(account.created_at)} months
                      </div>
                      <div className="text-sm text-gray-600">Duration Saved</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-lg font-bold text-green-600">
                        {account.target_amount ? calculateProgress(account.current_balance, account.target_amount).toFixed(1) : 'N/A'}%
                      </div>
                      <div className="text-sm text-gray-600">Progress to Goal</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-lg font-bold text-orange-600">{account.missed_contributions}</div>
                      <div className="text-sm text-gray-600">Missed Contributions</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-lg font-bold text-purple-600">{account.saving_frequency}</div>
                      <div className="text-sm text-gray-600">Frequency</div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => startEditing(account)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Update Plan
                    </Button>
                    <Button variant="outline" onClick={() => generateAccountReport(account)}>
                      <FileText className="w-4 h-4 mr-2" />
                      Generate Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SavingOperations;
