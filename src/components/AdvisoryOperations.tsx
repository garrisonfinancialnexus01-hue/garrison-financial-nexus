import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar, Plus, Edit2, Trash2, Search, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  AdvisoryClient, 
  AdvisorySession, 
  FinancialGoal, 
  FollowUpRecord,
  AdvisoryClientDB,
  AdvisorySessionDB,
  FinancialGoalDB,
  FollowUpRecordDB,
  castAdvisoryClient,
  castAdvisorySession,
  castFinancialGoal,
  castFollowUpRecord
} from '@/types/advisory';

const AdvisoryOperations = () => {
  const [clients, setClients] = useState<AdvisoryClient[]>([]);
  const [sessions, setSessions] = useState<AdvisorySession[]>([]);
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [followUps, setFollowUps] = useState<FollowUpRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const { toast } = useToast();

  // Form states
  const [clientForm, setClientForm] = useState<Partial<AdvisoryClient>>({});
  const [sessionForm, setSessionForm] = useState<Partial<AdvisorySession>>({});
  const [goalForm, setGoalForm] = useState<Partial<FinancialGoal>>({});
  const [followUpForm, setFollowUpForm] = useState<Partial<FollowUpRecord>>({});

  // Modal states
  const [showClientForm, setShowClientForm] = useState(false);
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [showFollowUpForm, setShowFollowUpForm] = useState(false);

  // Editing states
  const [editingClient, setEditingClient] = useState<string | null>(null);
  const [editingSession, setEditingSession] = useState<string | null>(null);
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [editingFollowUp, setEditingFollowUp] = useState<string | null>(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      // Fetch clients
      const { data: clientsData, error: clientsError } = await supabase
        .from('advisory_clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (clientsError) throw clientsError;
      setClients(clientsData ? clientsData.map(castAdvisoryClient) : []);

      // Fetch sessions with client info
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('advisory_sessions')
        .select(`
          *,
          advisory_clients (*)
        `)
        .order('session_date', { ascending: false });

      if (sessionsError) throw sessionsError;
      setSessions(sessionsData ? sessionsData.map(castAdvisorySession) : []);

      // Fetch goals
      const { data: goalsData, error: goalsError } = await supabase
        .from('financial_goals')
        .select('*')
        .order('created_at', { ascending: false });

      if (goalsError) throw goalsError;
      setGoals(goalsData ? goalsData.map(castFinancialGoal) : []);

      // Fetch follow-ups with client info
      const { data: followUpsData, error: followUpsError } = await supabase
        .from('follow_up_records')
        .select(`
          *,
          advisory_clients (*)
        `)
        .order('follow_up_date', { ascending: false });

      if (followUpsError) throw followUpsError;
      setFollowUps(followUpsData ? followUpsData.map(castFollowUpRecord) : []);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddClient = async () => {
    try {
      const { data, error } = await supabase
        .from('advisory_clients')
        .insert([{
          client_id: clientForm.client_id,
          client_name: clientForm.client_name,
          contact_info: clientForm.contact_info,
          email: clientForm.email,
          occupation: clientForm.occupation,
          financial_stage: clientForm.financial_stage,
          risk_tolerance: clientForm.risk_tolerance,
          investment_preference: clientForm.investment_preference,
          knowledge_level: clientForm.knowledge_level,
          status: clientForm.status || 'active'
        }])
        .select()
        .single();

      if (error) throw error;

      setClients([castAdvisoryClient(data), ...clients]);
      setClientForm({});
      setShowClientForm(false);
      toast({
        title: "Success",
        description: "Client added successfully"
      });
    } catch (error) {
      console.error('Error adding client:', error);
      toast({
        title: "Error",
        description: "Failed to add client. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateClient = async () => {
    if (!editingClient) return;

    try {
      const { data, error } = await supabase
        .from('advisory_clients')
        .update({
          client_name: clientForm.client_name,
          contact_info: clientForm.contact_info,
          email: clientForm.email,
          occupation: clientForm.occupation,
          financial_stage: clientForm.financial_stage,
          risk_tolerance: clientForm.risk_tolerance,
          investment_preference: clientForm.investment_preference,
          knowledge_level: clientForm.knowledge_level,
          status: clientForm.status
        })
        .eq('id', editingClient)
        .select()
        .single();

      if (error) throw error;

      setClients(clients.map(client => 
        client.id === editingClient ? castAdvisoryClient(data) : client
      ));
      setClientForm({});
      setEditingClient(null);
      setShowClientForm(false);
      toast({
        title: "Success",
        description: "Client updated successfully"
      });
    } catch (error) {
      console.error('Error updating client:', error);
      toast({
        title: "Error",
        description: "Failed to update client. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    try {
      const { error } = await supabase
        .from('advisory_clients')
        .delete()
        .eq('id', clientId);

      if (error) throw error;

      setClients(clients.filter(client => client.id !== clientId));
      toast({
        title: "Success",
        description: "Client deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting client:', error);
      toast({
        title: "Error",
        description: "Failed to delete client. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleAddSession = async () => {
    try {
      const { data, error } = await supabase
        .from('advisory_sessions')
        .insert([{
          client_id: sessionForm.client_id,
          advisory_type: sessionForm.advisory_type,
          advisor_name: sessionForm.advisor_name,
          session_date: sessionForm.session_date,
          advice_given: sessionForm.advice_given,
          action_plan: sessionForm.action_plan,
          supporting_materials: sessionForm.supporting_materials,
          notes: sessionForm.notes,
          follow_up_date: sessionForm.follow_up_date,
          status: sessionForm.status || 'scheduled'
        }])
        .select(`
          *,
          advisory_clients (*)
        `)
        .single();

      if (error) throw error;

      setSessions([castAdvisorySession(data), ...sessions]);
      setSessionForm({});
      setShowSessionForm(false);
      toast({
        title: "Success",
        description: "Session added successfully"
      });
    } catch (error) {
      console.error('Error adding session:', error);
      toast({
        title: "Error",
        description: "Failed to add session. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleAddGoal = async () => {
    try {
      const { data, error } = await supabase
        .from('financial_goals')
        .insert([{
          client_id: goalForm.client_id,
          goal_type: goalForm.goal_type,
          goal_amount: goalForm.goal_amount,
          target_date: goalForm.target_date,
          progress: goalForm.progress || 0,
          status: goalForm.status || 'active'
        }])
        .select()
        .single();

      if (error) throw error;

      setGoals([castFinancialGoal(data), ...goals]);
      setGoalForm({});
      setShowGoalForm(false);
      toast({
        title: "Success",
        description: "Goal added successfully"
      });
    } catch (error) {
      console.error('Error adding goal:', error);
      toast({
        title: "Error",
        description: "Failed to add goal. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleAddFollowUp = async () => {
    try {
      const { data, error } = await supabase
        .from('follow_up_records')
        .insert([{
          client_id: followUpForm.client_id,
          follow_up_date: followUpForm.follow_up_date,
          purpose: followUpForm.purpose,
          status: followUpForm.status || 'pending',
          outcome_notes: followUpForm.outcome_notes
        }])
        .select(`
          *,
          advisory_clients (*)
        `)
        .single();

      if (error) throw error;

      setFollowUps([castFollowUpRecord(data), ...followUps]);
      setFollowUpForm({});
      setShowFollowUpForm(false);
      toast({
        title: "Success",
        description: "Follow-up added successfully"
      });
    } catch (error) {
      console.error('Error adding follow-up:', error);
      toast({
        title: "Error",
        description: "Failed to add follow-up. Please try again.",
        variant: "destructive"
      });
    }
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.client_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || client.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.advisor_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || session.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredGoals = goals.filter(goal => {
    const matchesSearch = goal.goal_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || goal.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredFollowUps = followUps.filter(followUp => {
    const matchesSearch = followUp.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         followUp.purpose.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || followUp.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Advisory Operations</h1>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="clients" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="follow-ups">Follow-ups</TabsTrigger>
        </TabsList>

        <TabsContent value="clients" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Client Management</h2>
            <Button onClick={() => setShowClientForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Client
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Clients</CardTitle>
              <CardDescription>Manage your advisory clients</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Occupation</TableHead>
                    <TableHead>Risk Tolerance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">{client.client_id}</TableCell>
                      <TableCell>{client.client_name}</TableCell>
                      <TableCell>{client.contact_info}</TableCell>
                      <TableCell>{client.occupation}</TableCell>
                      <TableCell>
                        <Badge variant={client.risk_tolerance === 'high' ? 'destructive' : 
                                      client.risk_tolerance === 'moderate' ? 'default' : 'secondary'}>
                          {client.risk_tolerance}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
                          {client.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => {
                            setClientForm(client);
                            setEditingClient(client.id);
                            setShowClientForm(true);
                          }}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteClient(client.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Client Form Modal */}
          {showClientForm && (
            <Card>
              <CardHeader>
                <CardTitle>{editingClient ? 'Edit Client' : 'Add New Client'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="client_id">Client ID</Label>
                    <Input
                      id="client_id"
                      value={clientForm.client_id || ''}
                      onChange={(e) => setClientForm({...clientForm, client_id: e.target.value})}
                      disabled={!!editingClient}
                    />
                  </div>
                  <div>
                    <Label htmlFor="client_name">Client Name</Label>
                    <Input
                      id="client_name"
                      value={clientForm.client_name || ''}
                      onChange={(e) => setClientForm({...clientForm, client_name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact_info">Contact Info</Label>
                    <Input
                      id="contact_info"
                      value={clientForm.contact_info || ''}
                      onChange={(e) => setClientForm({...clientForm, contact_info: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={clientForm.email || ''}
                      onChange={(e) => setClientForm({...clientForm, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="occupation">Occupation</Label>
                    <Input
                      id="occupation"
                      value={clientForm.occupation || ''}
                      onChange={(e) => setClientForm({...clientForm, occupation: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="financial_stage">Financial Stage</Label>
                    <Select value={clientForm.financial_stage || ''} onValueChange={(value) => setClientForm({...clientForm, financial_stage: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select financial stage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Student">Student</SelectItem>
                        <SelectItem value="Working Adult">Working Adult</SelectItem>
                        <SelectItem value="Mid-Career">Mid-Career</SelectItem>
                        <SelectItem value="Pre-Retirement">Pre-Retirement</SelectItem>
                        <SelectItem value="Retired">Retired</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="risk_tolerance">Risk Tolerance</Label>
                    <Select value={clientForm.risk_tolerance || ''} onValueChange={(value) => setClientForm({...clientForm, risk_tolerance: value as "low" | "moderate" | "high"})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select risk tolerance" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="investment_preference">Investment Preference</Label>
                    <Select value={clientForm.investment_preference || ''} onValueChange={(value) => setClientForm({...clientForm, investment_preference: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select investment preference" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="conservative">Conservative</SelectItem>
                        <SelectItem value="balanced">Balanced</SelectItem>
                        <SelectItem value="aggressive">Aggressive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="knowledge_level">Knowledge Level</Label>
                    <Select value={clientForm.knowledge_level || ''} onValueChange={(value) => setClientForm({...clientForm, knowledge_level: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select knowledge level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={clientForm.status || ''} onValueChange={(value) => setClientForm({...clientForm, status: value as "active" | "inactive"})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={editingClient ? handleUpdateClient : handleAddClient}>
                    {editingClient ? 'Update' : 'Add'} Client
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setShowClientForm(false);
                    setEditingClient(null);
                    setClientForm({});
                  }}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Sessions Tab */}
        <TabsContent value="sessions" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Session Management</h2>
            <Button onClick={() => setShowSessionForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Session
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Advisory Sessions</CardTitle>
              <CardDescription>Track and manage advisory sessions</CardDescription>
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
                  {filteredSessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell className="font-medium">{session.client_name}</TableCell>
                      <TableCell>{session.advisory_type}</TableCell>
                      <TableCell>{session.advisor_name}</TableCell>
                      <TableCell>{session.session_date}</TableCell>
                      <TableCell>
                        <Badge variant={session.status === 'completed' ? 'default' : 
                                      session.status === 'scheduled' ? 'secondary' : 'destructive'}>
                          {session.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Session Form Modal */}
          {showSessionForm && (
            <Card>
              <CardHeader>
                <CardTitle>Add New Session</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="session_client">Client</Label>
                    <Select value={sessionForm.client_id || ''} onValueChange={(value) => setSessionForm({...sessionForm, client_id: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select client" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>{client.client_name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="advisory_type">Advisory Type</Label>
                    <Select value={sessionForm.advisory_type || ''} onValueChange={(value) => setSessionForm({...sessionForm, advisory_type: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Investment Strategy">Investment Strategy</SelectItem>
                        <SelectItem value="Retirement Planning">Retirement Planning</SelectItem>
                        <SelectItem value="Risk Management">Risk Management</SelectItem>
                        <SelectItem value="Tax Planning">Tax Planning</SelectItem>
                        <SelectItem value="Estate Planning">Estate Planning</SelectItem>
                        <SelectItem value="Budgeting Help">Budgeting Help</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="advisor_name">Advisor Name</Label>
                    <Input
                      id="advisor_name"
                      value={sessionForm.advisor_name || ''}
                      onChange={(e) => setSessionForm({...sessionForm, advisor_name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="session_date">Session Date</Label>
                    <Input
                      id="session_date"
                      type="date"
                      value={sessionForm.session_date || ''}
                      onChange={(e) => setSessionForm({...sessionForm, session_date: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="follow_up_date">Follow-up Date</Label>
                    <Input
                      id="follow_up_date"
                      type="date"
                      value={sessionForm.follow_up_date || ''}
                      onChange={(e) => setSessionForm({...sessionForm, follow_up_date: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="session_status">Status</Label>
                    <Select value={sessionForm.status || ''} onValueChange={(value) => setSessionForm({...sessionForm, status: value as "completed" | "scheduled" | "cancelled"})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="advice_given">Advice Given</Label>
                  <Textarea
                    id="advice_given"
                    value={sessionForm.advice_given || ''}
                    onChange={(e) => setSessionForm({...sessionForm, advice_given: e.target.value})}
                    placeholder="Enter advice given to client"
                  />
                </div>
                <div>
                  <Label htmlFor="action_plan">Action Plan</Label>
                  <Textarea
                    id="action_plan"
                    value={sessionForm.action_plan || ''}
                    onChange={(e) => setSessionForm({...sessionForm, action_plan: e.target.value})}
                    placeholder="Enter action plan"
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={sessionForm.notes || ''}
                    onChange={(e) => setSessionForm({...sessionForm, notes: e.target.value})}
                    placeholder="Additional notes"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddSession}>Add Session</Button>
                  <Button variant="outline" onClick={() => {
                    setShowSessionForm(false);
                    setSessionForm({});
                  }}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Goals Tab */}
        <TabsContent value="goals" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Financial Goals</h2>
            <Button onClick={() => setShowGoalForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Goal
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Financial Goals</CardTitle>
              <CardDescription>Track client financial goals and progress</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Goal Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Target Date</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGoals.map((goal) => (
                    <TableRow key={goal.id}>
                      <TableCell className="font-medium">{goal.goal_type}</TableCell>
                      <TableCell>UGX {goal.goal_amount.toLocaleString()}</TableCell>
                      <TableCell>{goal.target_date}</TableCell>
                      <TableCell>{goal.progress}%</TableCell>
                      <TableCell>
                        <Badge variant={goal.status === 'active' ? 'default' : 'secondary'}>
                          {goal.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Goal Form Modal */}
          {showGoalForm && (
            <Card>
              <CardHeader>
                <CardTitle>Add New Goal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="goal_client">Client</Label>
                    <Select value={goalForm.client_id || ''} onValueChange={(value) => setGoalForm({...goalForm, client_id: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select client" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>{client.client_name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="goal_type">Goal Type</Label>
                    <Select value={goalForm.goal_type || ''} onValueChange={(value) => setGoalForm({...goalForm, goal_type: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select goal type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Emergency Fund">Emergency Fund</SelectItem>
                        <SelectItem value="Retirement Fund">Retirement Fund</SelectItem>
                        <SelectItem value="Education Fund">Education Fund</SelectItem>
                        <SelectItem value="House Purchase">House Purchase</SelectItem>
                        <SelectItem value="Investment Portfolio">Investment Portfolio</SelectItem>
                        <SelectItem value="Business Capital">Business Capital</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="goal_amount">Goal Amount (UGX)</Label>
                    <Input
                      id="goal_amount"
                      type="number"
                      value={goalForm.goal_amount || ''}
                      onChange={(e) => setGoalForm({...goalForm, goal_amount: parseFloat(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="target_date">Target Date</Label>
                    <Input
                      id="target_date"
                      type="date"
                      value={goalForm.target_date || ''}
                      onChange={(e) => setGoalForm({...goalForm, target_date: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="progress">Progress (%)</Label>
                    <Input
                      id="progress"
                      type="number"
                      min="0"
                      max="100"
                      value={goalForm.progress || ''}
                      onChange={(e) => setGoalForm({...goalForm, progress: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="goal_status">Status</Label>
                    <Select value={goalForm.status || ''} onValueChange={(value) => setGoalForm({...goalForm, status: value as "active" | "inactive"})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddGoal}>Add Goal</Button>
                  <Button variant="outline" onClick={() => {
                    setShowGoalForm(false);
                    setGoalForm({});
                  }}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Follow-ups Tab */}
        <TabsContent value="follow-ups" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Follow-up Records</h2>
            <Button onClick={() => setShowFollowUpForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Follow-up
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Follow-up Records</CardTitle>
              <CardDescription>Track client follow-up activities</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFollowUps.map((followUp) => (
                    <TableRow key={followUp.id}>
                      <TableCell className="font-medium">{followUp.client_name}</TableCell>
                      <TableCell>{followUp.follow_up_date}</TableCell>
                      <TableCell>{followUp.purpose}</TableCell>
                      <TableCell>
                        <Badge variant={followUp.status === 'completed' ? 'default' : 
                                      followUp.status === 'pending' ? 'secondary' : 'destructive'}>
                          {followUp.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Follow-up Form Modal */}
          {showFollowUpForm && (
            <Card>
              <CardHeader>
                <CardTitle>Add New Follow-up</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="followup_client">Client</Label>
                    <Select value={followUpForm.client_id || ''} onValueChange={(value) => setFollowUpForm({...followUpForm, client_id: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select client" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>{client.client_name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="followup_date">Follow-up Date</Label>
                    <Input
                      id="followup_date"
                      type="date"
                      value={followUpForm.follow_up_date || ''}
                      onChange={(e) => setFollowUpForm({...followUpForm, follow_up_date: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="purpose">Purpose</Label>
                    <Select value={followUpForm.purpose || ''} onValueChange={(value) => setFollowUpForm({...followUpForm, purpose: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select purpose" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Review Investment Strategy">Review Investment Strategy</SelectItem>
                        <SelectItem value="Check Retirement Planning Progress">Check Retirement Planning Progress</SelectItem>
                        <SelectItem value="Budget Review">Budget Review</SelectItem>
                        <SelectItem value="Goal Progress Review">Goal Progress Review</SelectItem>
                        <SelectItem value="Risk Assessment Update">Risk Assessment Update</SelectItem>
                        <SelectItem value="General Check-in">General Check-in</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="followup_status">Status</Label>
                    <Select value={followUpForm.status || ''} onValueChange={(value) => setFollowUpForm({...followUpForm, status: value as "pending" | "completed" | "cancelled"})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="outcome_notes">Outcome Notes</Label>
                  <Textarea
                    id="outcome_notes"
                    value={followUpForm.outcome_notes || ''}
                    onChange={(e) => setFollowUpForm({...followUpForm, outcome_notes: e.target.value})}
                    placeholder="Enter outcome notes (if completed)"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddFollowUp}>Add Follow-up</Button>
                  <Button variant="outline" onClick={() => {
                    setShowFollowUpForm(false);
                    setFollowUpForm({});
                  }}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvisoryOperations;
