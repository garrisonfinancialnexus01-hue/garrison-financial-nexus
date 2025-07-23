
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Plus, Edit, Download, Calendar, Target, TrendingUp, FileText, User, Save, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';

interface AdvisoryClient {
  id: string;
  client_id: string;
  client_name: string;
  contact_info: string;
  email?: string;
  occupation: string;
  financial_stage: string;
  risk_tolerance: 'low' | 'moderate' | 'high';
  investment_preference: 'safe' | 'balanced' | 'aggressive';
  knowledge_level: 'beginner' | 'intermediate' | 'advanced';
  total_sessions: number;
  last_session_date: string;
  status: 'active' | 'pending' | 'completed';
}

interface AdvisorySession {
  id: string;
  client_id: string;
  advisory_type: string;
  advisor_name: string;
  session_date: string;
  advice_given: string;
  action_plan: string;
  supporting_materials?: string;
  notes: string;
  follow_up_date?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

interface FinancialGoal {
  id: string;
  client_id: string;
  goal_type: string;
  goal_amount: number;
  target_date: string;
  progress: number;
  status: 'active' | 'inactive';
}

interface FollowUpRecord {
  id: string;
  client_id: string;
  follow_up_date: string;
  purpose: string;
  status: 'pending' | 'completed' | 'cancelled';
  outcome_notes?: string;
}

const AdvisoryOperations: React.FC = () => {
  const [clients, setClients] = useState<AdvisoryClient[]>([]);
  const [sessions, setSessions] = useState<AdvisorySession[]>([]);
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [followUps, setFollowUps] = useState<FollowUpRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingClient, setEditingClient] = useState<string | null>(null);
  const [editingSession, setEditingSession] = useState<string | null>(null);
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [editingFollowUp, setEditingFollowUp] = useState<string | null>(null);
  const [showNewClientDialog, setShowNewClientDialog] = useState(false);
  const [showNewSessionDialog, setShowNewSessionDialog] = useState(false);
  const [showNewGoalDialog, setShowNewGoalDialog] = useState(false);
  const [showNewFollowUpDialog, setShowNewFollowUpDialog] = useState(false);
  const [performanceSummary, setPerformanceSummary] = useState('Clients generally satisfied with advisory services. Most appreciate the personalized investment strategies and clear action plans.');
  const { toast } = useToast();

  const advisoryTypes = ['Savings Plan', 'Investment Strategy', 'Retirement Planning', 'Budgeting Help', 'Debt Management', 'Insurance Planning'];
  const financialStages = ['Student', 'Working Adult', 'Mid-Career', 'Pre-Retirement', 'Retired'];
  const goalTypes = ['Emergency Fund', 'House Purchase', 'Car Purchase', 'Education Fund', 'Retirement Fund', 'Business Investment'];
  const riskToleranceOptions = ['low', 'moderate', 'high'];
  const investmentPreferenceOptions = ['safe', 'balanced', 'aggressive'];
  const knowledgeLevelOptions = ['beginner', 'intermediate', 'advanced'];

  const newClientForm = useForm();
  const newSessionForm = useForm();
  const newGoalForm = useForm();
  const newFollowUpForm = useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch clients
      const { data: clientsData, error: clientsError } = await supabase
        .from('advisory_clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (clientsError) throw clientsError;
      setClients(clientsData || []);

      // Fetch sessions
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('advisory_sessions')
        .select(`
          *,
          advisory_clients(client_name)
        `)
        .order('created_at', { ascending: false });

      if (sessionsError) throw sessionsError;
      setSessions(sessionsData?.map(session => ({
        ...session,
        client_name: session.advisory_clients?.client_name || 'Unknown'
      })) || []);

      // Fetch goals
      const { data: goalsData, error: goalsError } = await supabase
        .from('financial_goals')
        .select('*')
        .order('created_at', { ascending: false });

      if (goalsError) throw goalsError;
      setGoals(goalsData || []);

      // Fetch follow-ups
      const { data: followUpsData, error: followUpsError } = await supabase
        .from('follow_up_records')
        .select(`
          *,
          advisory_clients(client_name)
        `)
        .order('created_at', { ascending: false });

      if (followUpsError) throw followUpsError;
      setFollowUps(followUpsData?.map(followUp => ({
        ...followUp,
        client_name: followUp.advisory_clients?.client_name || 'Unknown'
      })) || []);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch advisory data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateClient = async (clientId: string, field: string, value: any) => {
    try {
      const { error } = await supabase
        .from('advisory_clients')
        .update({ [field]: value, updated_at: new Date().toISOString() })
        .eq('id', clientId);

      if (error) throw error;

      setClients(clients.map(client => 
        client.id === clientId ? { ...client, [field]: value } : client
      ));

      toast({
        title: 'Success',
        description: 'Client updated successfully'
      });
    } catch (error) {
      console.error('Error updating client:', error);
      toast({
        title: 'Error',
        description: 'Failed to update client',
        variant: 'destructive'
      });
    }
  };

  const handleUpdateSession = async (sessionId: string, field: string, value: any) => {
    try {
      const { error } = await supabase
        .from('advisory_sessions')
        .update({ [field]: value, updated_at: new Date().toISOString() })
        .eq('id', sessionId);

      if (error) throw error;

      setSessions(sessions.map(session => 
        session.id === sessionId ? { ...session, [field]: value } : session
      ));

      toast({
        title: 'Success',
        description: 'Session updated successfully'
      });
    } catch (error) {
      console.error('Error updating session:', error);
      toast({
        title: 'Error',
        description: 'Failed to update session',
        variant: 'destructive'
      });
    }
  };

  const handleUpdateGoal = async (goalId: string, field: string, value: any) => {
    try {
      const { error } = await supabase
        .from('financial_goals')
        .update({ [field]: value, updated_at: new Date().toISOString() })
        .eq('id', goalId);

      if (error) throw error;

      setGoals(goals.map(goal => 
        goal.id === goalId ? { ...goal, [field]: value } : goal
      ));

      toast({
        title: 'Success',
        description: 'Goal updated successfully'
      });
    } catch (error) {
      console.error('Error updating goal:', error);
      toast({
        title: 'Error',
        description: 'Failed to update goal',
        variant: 'destructive'
      });
    }
  };

  const handleUpdateFollowUp = async (followUpId: string, field: string, value: any) => {
    try {
      const { error } = await supabase
        .from('follow_up_records')
        .update({ [field]: value, updated_at: new Date().toISOString() })
        .eq('id', followUpId);

      if (error) throw error;

      setFollowUps(followUps.map(followUp => 
        followUp.id === followUpId ? { ...followUp, [field]: value } : followUp
      ));

      toast({
        title: 'Success',
        description: 'Follow-up updated successfully'
      });
    } catch (error) {
      console.error('Error updating follow-up:', error);
      toast({
        title: 'Error',
        description: 'Failed to update follow-up',
        variant: 'destructive'
      });
    }
  };

  const handleCreateClient = async (data: any) => {
    try {
      const clientId = `CLI${String(clients.length + 1).padStart(3, '0')}`;
      
      const { error } = await supabase
        .from('advisory_clients')
        .insert([{
          client_id: clientId,
          client_name: data.client_name,
          contact_info: data.contact_info,
          email: data.email,
          occupation: data.occupation,
          financial_stage: data.financial_stage,
          risk_tolerance: data.risk_tolerance || 'moderate',
          investment_preference: data.investment_preference || 'balanced',
          knowledge_level: data.knowledge_level || 'intermediate',
          status: 'active'
        }]);

      if (error) throw error;

      await fetchData();
      setShowNewClientDialog(false);
      newClientForm.reset();

      toast({
        title: 'Success',
        description: 'New client created successfully'
      });
    } catch (error) {
      console.error('Error creating client:', error);
      toast({
        title: 'Error',
        description: 'Failed to create client',
        variant: 'destructive'
      });
    }
  };

  const handleCreateSession = async (data: any) => {
    try {
      const { error } = await supabase
        .from('advisory_sessions')
        .insert([{
          client_id: data.client_id,
          advisory_type: data.advisory_type,
          advisor_name: data.advisor_name,
          session_date: data.session_date,
          advice_given: data.advice_given,
          action_plan: data.action_plan,
          supporting_materials: data.supporting_materials,
          notes: data.notes,
          follow_up_date: data.follow_up_date,
          status: 'scheduled'
        }]);

      if (error) throw error;

      await fetchData();
      setShowNewSessionDialog(false);
      newSessionForm.reset();

      toast({
        title: 'Success',
        description: 'New session created successfully'
      });
    } catch (error) {
      console.error('Error creating session:', error);
      toast({
        title: 'Error',
        description: 'Failed to create session',
        variant: 'destructive'
      });
    }
  };

  const handleCreateGoal = async (data: any) => {
    try {
      const { error } = await supabase
        .from('financial_goals')
        .insert([{
          client_id: data.client_id,
          goal_type: data.goal_type,
          goal_amount: parseFloat(data.goal_amount),
          target_date: data.target_date,
          progress: parseInt(data.progress) || 0,
          status: 'active'
        }]);

      if (error) throw error;

      await fetchData();
      setShowNewGoalDialog(false);
      newGoalForm.reset();

      toast({
        title: 'Success',
        description: 'New goal created successfully'
      });
    } catch (error) {
      console.error('Error creating goal:', error);
      toast({
        title: 'Error',
        description: 'Failed to create goal',
        variant: 'destructive'
      });
    }
  };

  const handleCreateFollowUp = async (data: any) => {
    try {
      const { error } = await supabase
        .from('follow_up_records')
        .insert([{
          client_id: data.client_id,
          follow_up_date: data.follow_up_date,
          purpose: data.purpose,
          status: 'pending'
        }]);

      if (error) throw error;

      await fetchData();
      setShowNewFollowUpDialog(false);
      newFollowUpForm.reset();

      toast({
        title: 'Success',
        description: 'Follow-up scheduled successfully'
      });
    } catch (error) {
      console.error('Error creating follow-up:', error);
      toast({
        title: 'Error',
        description: 'Failed to schedule follow-up',
        variant: 'destructive'
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800',
      scheduled: 'bg-purple-100 text-purple-800'
    };
    return variants[status as keyof typeof variants] || variants.active;
  };

  const getRiskBadge = (risk: string) => {
    const variants = {
      low: 'bg-blue-100 text-blue-800',
      moderate: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    };
    return variants[risk as keyof typeof variants] || variants.moderate;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const EditableCell = ({ value, onSave, type = 'text', options = [] }: any) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(value);

    const handleSave = () => {
      onSave(editValue);
      setIsEditing(false);
    };

    const handleCancel = () => {
      setEditValue(value);
      setIsEditing(false);
    };

    if (isEditing) {
      return (
        <div className="flex items-center space-x-2">
          {type === 'select' ? (
            <Select value={editValue} onValueChange={setEditValue}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {options.map((option: string) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              type={type}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-32"
            />
          )}
          <Button size="sm" onClick={handleSave}>
            <Save className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={handleCancel}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-2">
        <span className="font-medium">{value}</span>
        <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
          <Edit className="w-4 h-4" />
        </Button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Advisory Operations</h2>
        <div className="flex space-x-2">
          <Dialog open={showNewClientDialog} onOpenChange={setShowNewClientDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                New Client
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Client</DialogTitle>
              </DialogHeader>
              <Form {...newClientForm}>
                <form onSubmit={newClientForm.handleSubmit(handleCreateClient)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={newClientForm.control}
                      name="client_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Client Name</FormLabel>
                          <FormControl>
                            <Input {...field} required />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={newClientForm.control}
                      name="contact_info"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Info</FormLabel>
                          <FormControl>
                            <Input {...field} required />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={newClientForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={newClientForm.control}
                      name="occupation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Occupation</FormLabel>
                          <FormControl>
                            <Input {...field} required />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={newClientForm.control}
                      name="financial_stage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Financial Stage</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select stage" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {financialStages.map((stage) => (
                                <SelectItem key={stage} value={stage}>
                                  {stage}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={newClientForm.control}
                      name="risk_tolerance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Risk Tolerance</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value || 'moderate'}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select risk tolerance" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {riskToleranceOptions.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setShowNewClientDialog(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Create Client</Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          <Dialog open={showNewSessionDialog} onOpenChange={setShowNewSessionDialog}>
            <DialogTrigger asChild>
              <Button>
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Session
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Schedule New Session</DialogTitle>
              </DialogHeader>
              <Form {...newSessionForm}>
                <form onSubmit={newSessionForm.handleSubmit(handleCreateSession)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={newSessionForm.control}
                      name="client_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Client</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select client" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {clients.map((client) => (
                                <SelectItem key={client.id} value={client.id}>
                                  {client.client_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={newSessionForm.control}
                      name="advisory_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Advisory Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {advisoryTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={newSessionForm.control}
                      name="advisor_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Advisor Name</FormLabel>
                          <FormControl>
                            <Input {...field} required />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={newSessionForm.control}
                      name="session_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Session Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} required />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setShowNewSessionDialog(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Schedule Session</Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Client Overview</TabsTrigger>
          <TabsTrigger value="sessions">Advisory Sessions</TabsTrigger>
          <TabsTrigger value="goals">Financial Goals</TabsTrigger>
          <TabsTrigger value="risk">Risk Assessment</TabsTrigger>
          <TabsTrigger value="follow-up">Follow-Up & Monitoring</TabsTrigger>
          <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Advisory Clients Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client Name</TableHead>
                    <TableHead>Client ID</TableHead>
                    <TableHead>Contact Info</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell>
                        <EditableCell
                          value={client.client_name}
                          onSave={(value: string) => handleUpdateClient(client.id, 'client_name', value)}
                        />
                      </TableCell>
                      <TableCell>{client.client_id}</TableCell>
                      <TableCell>
                        <EditableCell
                          value={client.contact_info}
                          onSave={(value: string) => handleUpdateClient(client.id, 'contact_info', value)}
                        />
                      </TableCell>
                      <TableCell>
                        <EditableCell
                          value={client.status}
                          onSave={(value: string) => handleUpdateClient(client.id, 'status', value)}
                          type="select"
                          options={['active', 'pending', 'completed']}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Calendar className="w-4 h-4" />
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

        <TabsContent value="sessions">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Advisory Session Records
                <Button onClick={() => setShowNewSessionDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Session
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Advisor</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell>{session.client_name}</TableCell>
                      <TableCell>
                        <EditableCell
                          value={session.advisory_type}
                          onSave={(value: string) => handleUpdateSession(session.id, 'advisory_type', value)}
                          type="select"
                          options={advisoryTypes}
                        />
                      </TableCell>
                      <TableCell>
                        <EditableCell
                          value={session.advisor_name}
                          onSave={(value: string) => handleUpdateSession(session.id, 'advisor_name', value)}
                        />
                      </TableCell>
                      <TableCell>
                        <EditableCell
                          value={session.session_date}
                          onSave={(value: string) => handleUpdateSession(session.id, 'session_date', value)}
                          type="date"
                        />
                      </TableCell>
                      <TableCell>
                        <EditableCell
                          value={session.status}
                          onSave={(value: string) => handleUpdateSession(session.id, 'status', value)}
                          type="select"
                          options={['scheduled', 'completed', 'cancelled']}
                        />
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          <FileText className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Financial Goals Tracker
                  <Dialog open={showNewGoalDialog} onOpenChange={setShowNewGoalDialog}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Goal
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Financial Goal</DialogTitle>
                      </DialogHeader>
                      <Form {...newGoalForm}>
                        <form onSubmit={newGoalForm.handleSubmit(handleCreateGoal)} className="space-y-4">
                          <FormField
                            control={newGoalForm.control}
                            name="client_id"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Client</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select client" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {clients.map((client) => (
                                      <SelectItem key={client.id} value={client.id}>
                                        {client.client_name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={newGoalForm.control}
                            name="goal_type"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Goal Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select goal type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {goalTypes.map((type) => (
                                      <SelectItem key={type} value={type}>
                                        {type}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={newGoalForm.control}
                            name="goal_amount"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Goal Amount</FormLabel>
                                <FormControl>
                                  <Input type="number" {...field} required />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={newGoalForm.control}
                            name="target_date"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Target Date</FormLabel>
                                <FormControl>
                                  <Input type="date" {...field} required />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={newGoalForm.control}
                            name="progress"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Progress (%)</FormLabel>
                                <FormControl>
                                  <Input type="number" min="0" max="100" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="flex justify-end space-x-2">
                            <Button type="button" variant="outline" onClick={() => setShowNewGoalDialog(false)}>
                              Cancel
                            </Button>
                            <Button type="submit">Add Goal</Button>
                          </div>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Goal Type</TableHead>
                      <TableHead>Goal Amount</TableHead>
                      <TableHead>Target Date</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {goals.map((goal) => (
                      <TableRow key={goal.id}>
                        <TableCell>
                          <EditableCell
                            value={goal.goal_type}
                            onSave={(value: string) => handleUpdateGoal(goal.id, 'goal_type', value)}
                            type="select"
                            options={goalTypes}
                          />
                        </TableCell>
                        <TableCell>
                          <EditableCell
                            value={goal.goal_amount}
                            onSave={(value: string) => handleUpdateGoal(goal.id, 'goal_amount', parseFloat(value))}
                            type="number"
                          />
                        </TableCell>
                        <TableCell>
                          <EditableCell
                            value={goal.target_date}
                            onSave={(value: string) => handleUpdateGoal(goal.id, 'target_date', value)}
                            type="date"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${goal.progress}%` }}
                              ></div>
                            </div>
                            <EditableCell
                              value={goal.progress}
                              onSave={(value: string) => handleUpdateGoal(goal.id, 'progress', parseInt(value))}
                              type="number"
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <EditableCell
                            value={goal.status}
                            onSave={(value: string) => handleUpdateGoal(goal.id, 'status', value)}
                            type="select"
                            options={['active', 'inactive']}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="risk">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {clients.map((client) => (
              <Card key={client.id}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-orange-500" />
                    {client.client_name} - Risk Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Risk Tolerance</Label>
                      <EditableCell
                        value={client.risk_tolerance}
                        onSave={(value: string) => handleUpdateClient(client.id, 'risk_tolerance', value)}
                        type="select"
                        options={riskToleranceOptions}
                      />
                    </div>
                    <div>
                      <Label>Investment Preference</Label>
                      <EditableCell
                        value={client.investment_preference}
                        onSave={(value: string) => handleUpdateClient(client.id, 'investment_preference', value)}
                        type="select"
                        options={investmentPreferenceOptions}
                      />
                    </div>
                    <div>
                      <Label>Knowledge Level</Label>
                      <EditableCell
                        value={client.knowledge_level}
                        onSave={(value: string) => handleUpdateClient(client.id, 'knowledge_level', value)}
                        type="select"
                        options={knowledgeLevelOptions}
                      />
                    </div>
                    <div>
                      <Label>Financial Stage</Label>
                      <EditableCell
                        value={client.financial_stage}
                        onSave={(value: string) => handleUpdateClient(client.id, 'financial_stage', value)}
                        type="select"
                        options={financialStages}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="follow-up">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Follow-Up & Monitoring
                <Dialog open={showNewFollowUpDialog} onOpenChange={setShowNewFollowUpDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Schedule Follow-Up
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Schedule Follow-Up</DialogTitle>
                    </DialogHeader>
                    <Form {...newFollowUpForm}>
                      <form onSubmit={newFollowUpForm.handleSubmit(handleCreateFollowUp)} className="space-y-4">
                        <FormField
                          control={newFollowUpForm.control}
                          name="client_id"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Client</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select client" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {clients.map((client) => (
                                    <SelectItem key={client.id} value={client.id}>
                                      {client.client_name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={newFollowUpForm.control}
                          name="follow_up_date"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Follow-Up Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} required />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={newFollowUpForm.control}
                          name="purpose"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Purpose</FormLabel>
                              <FormControl>
                                <Input {...field} required />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="flex justify-end space-x-2">
                          <Button type="button" variant="outline" onClick={() => setShowNewFollowUpDialog(false)}>
                            Cancel
                          </Button>
                          <Button type="submit">Schedule Follow-Up</Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Follow-Up Date</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Outcome / Notes</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {followUps.map((followUp) => (
                    <TableRow key={followUp.id}>
                      <TableCell>
                        <EditableCell
                          value={followUp.follow_up_date}
                          onSave={(value: string) => handleUpdateFollowUp(followUp.id, 'follow_up_date', value)}
                          type="date"
                        />
                      </TableCell>
                      <TableCell>{followUp.client_name}</TableCell>
                      <TableCell>
                        <EditableCell
                          value={followUp.purpose}
                          onSave={(value: string) => handleUpdateFollowUp(followUp.id, 'purpose', value)}
                        />
                      </TableCell>
                      <TableCell>
                        <EditableCell
                          value={followUp.status}
                          onSave={(value: string) => handleUpdateFollowUp(followUp.id, 'status', value)}
                          type="select"
                          options={['pending', 'completed', 'cancelled']}
                        />
                      </TableCell>
                      <TableCell>
                        <EditableCell
                          value={followUp.outcome_notes || ''}
                          onSave={(value: string) => handleUpdateFollowUp(followUp.id, 'outcome_notes', value)}
                        />
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          <Calendar className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{sessions.length}</div>
                <p className="text-xs text-muted-foreground">
                  {sessions.filter(s => s.status === 'completed').length} completed
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{clients.filter(c => c.status === 'active').length}</div>
                <p className="text-xs text-muted-foreground">
                  {((clients.filter(c => c.status === 'active').length / clients.length) * 100).toFixed(1)}% of total
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Most Common Type</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Investment</div>
                <p className="text-xs text-muted-foreground">
                  Strategy sessions
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{goals.filter(g => g.status === 'active').length}</div>
                <p className="text-xs text-muted-foreground">
                  Financial goals
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Session Performance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Client Feedback Summary</Label>
                  <Textarea 
                    value={performanceSummary}
                    onChange={(e) => setPerformanceSummary(e.target.value)}
                    placeholder="Enter overall client feedback summary..."
                  />
                </div>
                <Button onClick={() => toast({ title: 'Success', description: 'Performance summary updated successfully' })}>
                  Update Summary
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvisoryOperations;
