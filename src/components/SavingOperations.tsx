import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash, Download, DollarSign, TrendingUp, Calendar, FileText } from 'lucide-react';

interface SavingsAccount {
  id: string;
  clientName: string;
  clientId: string;
  accountNumber: string;
  contactDetails: string;
  accountType: string;
  startDate: string;
  status: 'active' | 'dormant' | 'closed';
  currentBalance: number;
  initialDeposit: number;
  totalDeposited: number;
  totalWithdrawn: number;
  interestEarned: number;
  savingsGoal?: number;
  maturityDate?: string;
  savingFrequency: string;
  interestRate: number;
}

interface Transaction {
  id: string;
  date: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  balanceAfter: number;
  paymentMethod: string;
  reference: string;
  notes: string;
}

const SavingOperations: React.FC = () => {
  const [savingsAccounts, setSavingsAccounts] = useState<SavingsAccount[]>([
    {
      id: '1',
      clientName: 'Jane Smith',
      clientId: 'CLI001',
      accountNumber: 'SAV001',
      contactDetails: '+256781234567',
      accountType: 'Daily Savings',
      startDate: '2023-06-01',
      status: 'active',
      currentBalance: 2500000,
      initialDeposit: 100000,
      totalDeposited: 2600000,
      totalWithdrawn: 100000,
      interestEarned: 50000,
      savingsGoal: 5000000,
      savingFrequency: 'Daily',
      interestRate: 12
    }
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      date: '2024-01-15',
      type: 'deposit',
      amount: 50000,
      balanceAfter: 2500000,
      paymentMethod: 'Mobile Money',
      reference: 'MM123456',
      notes: 'Daily savings deposit'
    }
  ]);

  const accountTypeOptions = ['Daily Savings', 'Fixed Deposit', 'Target Savings', 'Group Savings', 'Youth Savings'];
  const frequencyOptions = ['Daily', 'Weekly', 'Monthly', 'Ad-hoc'];
  const paymentMethods = ['Cash', 'Mobile Money', 'Bank Transfer', 'Cheque'];

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Savings Operations</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Savings Account
        </Button>
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
                    <TableHead>Account Type</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>Last Deposit</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {savingsAccounts.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell className="font-medium">{account.clientName}</TableCell>
                      <TableCell>{account.accountType}</TableCell>
                      <TableCell className="font-mono">{formatCurrency(account.currentBalance)}</TableCell>
                      <TableCell>{account.startDate}</TableCell>
                      <TableCell>2024-01-15</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(account.status)}>
                          {account.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {savingsAccounts.map((account) => (
              <Card key={account.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {account.clientName}
                    <Badge className={getStatusBadge(account.status)}>
                      {account.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <Label>Account Number</Label>
                      <p className="font-mono font-medium">{account.accountNumber}</p>
                    </div>
                    <div>
                      <Label>Account Type</Label>
                      <p className="font-medium">{account.accountType}</p>
                    </div>
                    <div>
                      <Label>Contact</Label>
                      <p className="font-medium">{account.contactDetails}</p>
                    </div>
                    <div>
                      <Label>Start Date</Label>
                      <p className="font-medium">{account.startDate}</p>
                    </div>
                    <div>
                      <Label>Current Balance</Label>
                      <p className="font-mono font-bold text-green-600">{formatCurrency(account.currentBalance)}</p>
                    </div>
                    <div>
                      <Label>Interest Rate</Label>
                      <p className="font-medium">{account.interestRate}% p.a.</p>
                    </div>
                  </div>
                  
                  {account.savingsGoal && (
                    <div className="space-y-2">
                      <Label>Savings Goal Progress</Label>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${calculateProgress(account.currentBalance, account.savingsGoal)}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-600">
                        {formatCurrency(account.currentBalance)} of {formatCurrency(account.savingsGoal)} 
                        ({calculateProgress(account.currentBalance, account.savingsGoal).toFixed(1)}%)
                      </p>
                    </div>
                  )}

                  <div className="flex space-x-2 pt-4">
                    <Button size="sm" variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Deposit
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Plan
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
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Transaction History
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Record Transaction
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Transaction Type</TableHead>
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
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>
                        <Badge variant={transaction.type === 'deposit' ? 'default' : 'secondary'}>
                          {transaction.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono">
                        {transaction.type === 'deposit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </TableCell>
                      <TableCell className="font-mono">{formatCurrency(transaction.balanceAfter)}</TableCell>
                      <TableCell>{transaction.paymentMethod}</TableCell>
                      <TableCell>{transaction.reference}</TableCell>
                      <TableCell>{transaction.notes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-6 border rounded-lg p-4 bg-gray-50">
                <h4 className="font-medium mb-4">Record New Transaction</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label>Client Account</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select account" />
                      </SelectTrigger>
                      <SelectContent>
                        {savingsAccounts.map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.clientName} - {account.accountNumber}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Transaction Type</Label>
                    <Select>
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
                    <Label>Amount</Label>
                    <Input type="number" placeholder="Enter amount" />
                  </div>
                  <div>
                    <Label>Payment Method</Label>
                    <Select>
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
                    <Label>Reference</Label>
                    <Input placeholder="Transaction reference" />
                  </div>
                  <div>
                    <Label>Date</Label>
                    <Input type="date" />
                  </div>
                  <div className="md:col-span-2 lg:col-span-3">
                    <Label>Notes</Label>
                    <Textarea placeholder="Transaction notes..." />
                  </div>
                </div>
                <Button className="mt-4">Record Transaction</Button>
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
                    {account.clientName} - Interest Tracking
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{account.interestRate}%</div>
                      <div className="text-sm text-gray-600">Interest Rate</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">{formatCurrency(account.interestEarned)}</div>
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
        </TabsContent>

        <TabsContent value="plans">
          <div className="space-y-6">
            {savingsAccounts.map((account) => (
              <Card key={account.id}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                    {account.clientName} - Savings Plan Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">
                        {Math.floor((new Date().getTime() - new Date(account.startDate).getTime()) / (1000 * 60 * 60 * 24 * 30))} months
                      </div>
                      <div className="text-sm text-gray-600">Duration Saved</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-lg font-bold text-green-600">
                        {account.savingsGoal ? calculateProgress(account.currentBalance, account.savingsGoal).toFixed(1) : 'N/A'}%
                      </div>
                      <div className="text-sm text-gray-600">Progress to Goal</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-lg font-bold text-orange-600">0</div>
                      <div className="text-sm text-gray-600">Missed Contributions</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-lg font-bold text-purple-600">{account.savingFrequency}</div>
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
                        defaultValue="Client is on track with savings goal. Recommend increasing deposit amount by 10% next month."
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SavingOperations;