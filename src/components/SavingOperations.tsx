
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
  client_nin: string | null;
  client_phone: string;
  client_email: string | null;
  account_type: string;
  status: string;
  initial_deposit: number;
  current_balance: number;
  target_amount: number | null;
  target_date: string | null;
  interest_rate: number;
  maturity_date: string | null;
  withdrawal_frequency: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Migration added columns
  account_number?: string | null;
  last_deposit_date?: string | null;
  saving_frequency?: string | null;
  total_deposited?: number;
  total_withdrawn?: number;
  interest_earned?: number;
  missed_contributions?: number;
}

const SavingOperations: React.FC = () => {
  const [savingsAccounts, setSavingsAccounts] = useState<SavingsAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [editingAccount, setEditingAccount] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<SavingsAccount>>({});
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

  useEffect(() => {
    fetchSavingsAccounts();
  }, []);

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
      // Validate required fields
      if (!newAccountForm.client_name || !newAccountForm.client_phone || !newAccountForm.initial_deposit) {
        toast({
          title: 'Error',
          description: 'Please fill in all required fields',
          variant: 'destructive'
        });
        return;
      }

      const accountNumber = `SAV${String(savingsAccounts.length + 1).padStart(4, '0')}`;
      
      const { error } = await supabase
        .from('saving_operations')
        .insert([{
          client_name: newAccountForm.client_name,
          client_nin: newAccountForm.client_nin || null,
          client_phone: newAccountForm.client_phone,
          client_email: newAccountForm.client_email || null,
          account_number: accountNumber,
          account_type: newAccountForm.account_type,
          initial_deposit: parseFloat(newAccountForm.initial_deposit),
          current_balance: parseFloat(newAccountForm.initial_deposit),
          target_amount: newAccountForm.target_amount ? parseFloat(newAccountForm.target_amount) : null,
          target_date: newAccountForm.target_date || null,
          interest_rate: parseFloat(newAccountForm.interest_rate),
          saving_frequency: newAccountForm.saving_frequency,
          total_deposited: parseFloat(newAccountForm.initial_deposit),
          total_withdrawn: 0,
          interest_earned: 0,
          missed_contributions: 0,
          status: 'active',
          last_deposit_date: new Date().toISOString().split('T')[0]
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
        description: 'Failed to create account. Please try again.',
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

  const calculateProgress = (current: number, goal?: number | null) => {
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
      accountNumber: account.account_number || 'N/A',
      clientName: account.client_name,
      currentBalance: formatCurrency(account.current_balance),
      targetAmount: account.target_amount ? formatCurrency(account.target_amount) : 'N/A',
      interestRate: `${account.interest_rate}%`,
      totalDeposited: formatCurrency(account.total_deposited || 0),
      totalWithdrawn: formatCurrency(account.total_withdrawn || 0),
      interestEarned: formatCurrency(account.interest_earned || 0)
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
    a.download = `savings-report-${account.account_number || account.id}.txt`;
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
                <Label>Client Name *</Label>
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
                <Label>Phone *</Label>
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
                <Label>Initial Deposit *</Label>
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
                      <TableCell className="font-mono">{account.account_number || 'N/A'}</TableCell>
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
                        <p className="font-mono font-medium">{account.account_number || 'N/A'}</p>
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
                      <div className="text-lg font-bold text-blue-600">{formatCurrency(account.interest_earned || 0)}</div>
                      <div className="text-sm text-gray-600">Interest Earned</div>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full"
                    onClick={() => startEditing(account)}
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
                      <div className="text-lg font-bold text-orange-600">{account.missed_contributions || 0}</div>
                      <div className="text-sm text-gray-600">Missed Contributions</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-lg font-bold text-purple-600">{account.saving_frequency || 'N/A'}</div>
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
