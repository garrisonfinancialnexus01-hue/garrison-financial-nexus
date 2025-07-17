
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface LendingOperation {
  id: string;
  client_name: string;
  client_nin: string;
  client_phone: string;
  client_email: string;
  loan_amount: number;
  interest_rate: number;
  loan_term: string;
  total_repayment: number;
  disbursement_date: string;
  due_date: string;
  status: string;
  collateral_type: string;
  collateral_value: number;
  guarantor_name: string;
  guarantor_phone: string;
  notes: string;
  created_at: string;
}

const LendingOperations: React.FC = () => {
  const [operations, setOperations] = useState<LendingOperation[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    client_name: '',
    client_nin: '',
    client_phone: '',
    client_email: '',
    loan_amount: '',
    interest_rate: '',
    loan_term: '',
    disbursement_date: '',
    due_date: '',
    status: 'pending',
    collateral_type: '',
    collateral_value: '',
    guarantor_name: '',
    guarantor_phone: '',
    notes: '',
  });

  useEffect(() => {
    fetchOperations();
  }, []);

  useEffect(() => {
    if (formData.loan_amount && formData.interest_rate) {
      const principal = parseFloat(formData.loan_amount);
      const rate = parseFloat(formData.interest_rate) / 100;
      const total = principal + (principal * rate);
      // Auto-calculate total repayment but don't update state to avoid infinite loops
    }
  }, [formData.loan_amount, formData.interest_rate]);

  const fetchOperations = async () => {
    try {
      const { data, error } = await supabase
        .from('lending_operations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOperations(data || []);
    } catch (error) {
      console.error('Error fetching lending operations:', error);
      toast({
        title: "Error",
        description: "Failed to fetch lending operations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const principal = parseFloat(formData.loan_amount);
      const rate = parseFloat(formData.interest_rate) / 100;
      const total_repayment = principal + (principal * rate);

      const operationData = {
        ...formData,
        loan_amount: parseFloat(formData.loan_amount),
        interest_rate: parseFloat(formData.interest_rate),
        collateral_value: formData.collateral_value ? parseFloat(formData.collateral_value) : null,
        total_repayment,
        disbursement_date: formData.disbursement_date || null,
        due_date: formData.due_date || null,
      };

      if (editingId) {
        const { error } = await supabase
          .from('lending_operations')
          .update(operationData)
          .eq('id', editingId);

        if (error) throw error;
        toast({ title: "Success", description: "Lending operation updated successfully" });
      } else {
        const { error } = await supabase
          .from('lending_operations')
          .insert([operationData]);

        if (error) throw error;
        toast({ title: "Success", description: "Lending operation created successfully" });
      }

      resetForm();
      fetchOperations();
    } catch (error) {
      console.error('Error saving lending operation:', error);
      toast({
        title: "Error",
        description: "Failed to save lending operation",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (operation: LendingOperation) => {
    setFormData({
      client_name: operation.client_name,
      client_nin: operation.client_nin || '',
      client_phone: operation.client_phone,
      client_email: operation.client_email || '',
      loan_amount: operation.loan_amount.toString(),
      interest_rate: operation.interest_rate.toString(),
      loan_term: operation.loan_term,
      disbursement_date: operation.disbursement_date || '',
      due_date: operation.due_date || '',
      status: operation.status,
      collateral_type: operation.collateral_type || '',
      collateral_value: operation.collateral_value?.toString() || '',
      guarantor_name: operation.guarantor_name || '',
      guarantor_phone: operation.guarantor_phone || '',
      notes: operation.notes || '',
    });
    setEditingId(operation.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this lending operation?')) {
      try {
        const { error } = await supabase
          .from('lending_operations')
          .delete()
          .eq('id', id);

        if (error) throw error;
        toast({ title: "Success", description: "Lending operation deleted successfully" });
        fetchOperations();
      } catch (error) {
        console.error('Error deleting lending operation:', error);
        toast({
          title: "Error",
          description: "Failed to delete lending operation",
          variant: "destructive",
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      client_name: '',
      client_nin: '',
      client_phone: '',
      client_email: '',
      loan_amount: '',
      interest_rate: '',
      loan_term: '',
      disbursement_date: '',
      due_date: '',
      status: 'pending',
      collateral_type: '',
      collateral_value: '',
      guarantor_name: '',
      guarantor_phone: '',
      notes: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const calculateTotalRepayment = () => {
    if (formData.loan_amount && formData.interest_rate) {
      const principal = parseFloat(formData.loan_amount);
      const rate = parseFloat(formData.interest_rate) / 100;
      return principal + (principal * rate);
    }
    return 0;
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading lending operations...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Lending Operations</h2>
          <p className="text-muted-foreground">
            Manage loan applications and disbursements
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Loan
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit' : 'Add New'} Lending Operation</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="client_name">Client Name *</Label>
                <Input
                  id="client_name"
                  value={formData.client_name}
                  onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="client_phone">Client Phone *</Label>
                <Input
                  id="client_phone"
                  value={formData.client_phone}
                  onChange={(e) => setFormData({ ...formData, client_phone: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="client_nin">Client NIN</Label>
                <Input
                  id="client_nin"
                  value={formData.client_nin}
                  onChange={(e) => setFormData({ ...formData, client_nin: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="client_email">Client Email</Label>
                <Input
                  id="client_email"
                  type="email"
                  value={formData.client_email}
                  onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="loan_amount">Loan Amount (UGX) *</Label>
                <Input
                  id="loan_amount"
                  type="number"
                  value={formData.loan_amount}
                  onChange={(e) => setFormData({ ...formData, loan_amount: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="interest_rate">Interest Rate (%) *</Label>
                <Input
                  id="interest_rate"
                  type="number"
                  step="0.1"
                  value={formData.interest_rate}
                  onChange={(e) => setFormData({ ...formData, interest_rate: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="loan_term">Loan Term *</Label>
                <Select value={formData.loan_term} onValueChange={(value) => setFormData({ ...formData, loan_term: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select loan term" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1 month">1 month</SelectItem>
                    <SelectItem value="3 months">3 months</SelectItem>
                    <SelectItem value="6 months">6 months</SelectItem>
                    <SelectItem value="1 year">1 year</SelectItem>
                    <SelectItem value="2 years">2 years</SelectItem>
                    <SelectItem value="3 years">3 years</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="disbursed">Disbursed</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="defaulted">Defaulted</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="disbursement_date">Disbursement Date</Label>
                <Input
                  id="disbursement_date"
                  type="date"
                  value={formData.disbursement_date}
                  onChange={(e) => setFormData({ ...formData, disbursement_date: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="due_date">Due Date</Label>
                <Input
                  id="due_date"
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="collateral_type">Collateral Type</Label>
                <Input
                  id="collateral_type"
                  value={formData.collateral_type}
                  onChange={(e) => setFormData({ ...formData, collateral_type: e.target.value })}
                  placeholder="e.g., Property, Vehicle, etc."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="collateral_value">Collateral Value (UGX)</Label>
                <Input
                  id="collateral_value"
                  type="number"
                  value={formData.collateral_value}
                  onChange={(e) => setFormData({ ...formData, collateral_value: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="guarantor_name">Guarantor Name</Label>
                <Input
                  id="guarantor_name"
                  value={formData.guarantor_name}
                  onChange={(e) => setFormData({ ...formData, guarantor_name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="guarantor_phone">Guarantor Phone</Label>
                <Input
                  id="guarantor_phone"
                  value={formData.guarantor_phone}
                  onChange={(e) => setFormData({ ...formData, guarantor_phone: e.target.value })}
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              </div>

              {formData.loan_amount && formData.interest_rate && (
                <div className="md:col-span-2 p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Total Repayment: <span className="font-semibold text-foreground">
                      UGX {calculateTotalRepayment().toLocaleString()}
                    </span>
                  </p>
                </div>
              )}

              <div className="md:col-span-2 flex space-x-2">
                <Button type="submit">
                  {editingId ? 'Update' : 'Create'} Lending Operation
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Lending Operations</CardTitle>
          <CardDescription>
            {operations.length} total operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Loan Amount</TableHead>
                  <TableHead>Interest Rate</TableHead>
                  <TableHead>Term</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total Repayment</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {operations.map((operation) => (
                  <TableRow key={operation.id}>
                    <TableCell className="font-medium">{operation.client_name}</TableCell>
                    <TableCell>{operation.client_phone}</TableCell>
                    <TableCell>UGX {operation.loan_amount.toLocaleString()}</TableCell>
                    <TableCell>{operation.interest_rate}%</TableCell>
                    <TableCell>{operation.loan_term}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        operation.status === 'active' ? 'bg-green-100 text-green-800' :
                        operation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        operation.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        operation.status === 'defaulted' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {operation.status}
                      </span>
                    </TableCell>
                    <TableCell>UGX {operation.total_repayment.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(operation)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(operation.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LendingOperations;
