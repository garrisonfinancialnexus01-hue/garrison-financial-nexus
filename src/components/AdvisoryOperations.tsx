
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
import { Plus, Edit, Download, Calendar, Target, TrendingUp, FileText, User, Save, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AdvisoryClient {
  id: string;
  client_id: string;
  client_name: string;
  contact_info: string;
  email?: string;
  occupation: string;
  financial_stage: string;
  risk_tolerance: string;
  investment_preference: string;
  knowledge_level: string;
  total_sessions: number;
  last_session_date: string;
  status: string;
  credit_behavior_notes?: string;
  last_risk_assessment_date?: string;
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
  status: string;
}

interface FinancialGoal {
  id: string;
  client_id: string;
  goal_type: string;
  goal_amount: number;
  target_date: string;
  progress: number;
  status: string;
}

interface FollowUpRecord {
  id: string;
  client_id: string;
  follow_up_date: string;
  purpose: string;
  status: string;
  outcome_notes?: string;
}

const AdvisoryOperations: React.FC = () => {
  const [clients, setClients] = useState<AdvisoryClient[]>([]);
  const [sessions, setSessions] = useState<AdvisorySession[]>([]);
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [followUps, setFollowUps] = useState<FollowUpRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSession, setEditingSession] = useState<AdvisorySession | null>(null);
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [showNewSessionForm, setShowNewSessionForm] = useState(false);
  const { toast } = useToast();

  const advisoryTypes = ['Savings Plan', 'Investment Strategy', 'Retirement Planning', 'Budgeting Help', 'Debt Management', 'Insurance Planning'];
  const financialStages = ['Student', 'Working Adult', 'Mid-Career', 'Pre-Retirement', 'Retired'];
  const goalTypes = ['Emergency Fund', 'House Purchase', 'Car Purchase', 'Education Fund', 'Retirement Fund', 'Business Investment'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [clientsRes, sessionsRes, goalsRes, followUpsRes] = await Promise.all([
        supabase.from('advisory_clients').select('*'),
        supabase.from('advisory_sessions').select('*'),
        supabase.from('financial_goals').select('*'),
        supabase.from('follow_up_records').select('*')
      ]);

      if (clientsRes.error) throw clientsRes.error;
      if (sessionsRes.error) throw sessionsRes.error;
      if (goalsRes.error) throw goalsRes.error;
      if (followUpsRes.error) throw followUpsRes.error;

      setClients(clientsRes.data as AdvisoryClient[] || []);
      setSessions(sessionsRes.data as AdvisorySession[] || []);
      setGoals(goalsRes.data as FinancialGoal[] || []);
      setFollowUps(followUpsRes.data as FollowUpRecord[] || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load advisory data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClient = async (formData: FormData) => {
    try {
      const clientData = {
        client_id: `CLI${Date.now()}`,
        client_name: formData.get('client_name') as string,
        contact_info: formData.get('contact_info') as string,
        email: formData.get('email') as string,
        occupation: formData.get('occupation') as string,
        financial_stage: formData.get('financial_stage') as string,
        risk_tolerance: formData.get('risk_tolerance') as string,
        investment_preference: formData.get('investment_preference') as string,
        knowledge_level: formData.get('knowledge_level') as string,
        status: 'active',
        total_sessions: 0,
        last_session_date: new Date().toISOString().split('T')[0]
      };

      const { error } = await supabase.from('advisory_clients').insert([clientData]);
      if (error) throw error;

      toast({
        title: "Success",
        description: "Client created successfully"
      });

      setShowNewClientForm(false);
      fetchData();
    } catch (error) {
      console.error('Error creating client:', error);
      toast({
        title: "Error",
        description: "Failed to create client",
        variant: "destructive"
      });
    }
  };

  const handleCreateSession = async (formData: FormData) => {
    try {
      const sessionData = {
        client_id: formData.get('client_id') as string,
        advisory_type: formData.get('advisory_type') as string,
        advisor_name: formData.get('advisor_name') as string,
        session_date: formData.get('session_date') as string,
        advice_given: formData.get('advice_given') as string,
        action_plan: formData.get('action_plan') as string,
        supporting_materials: formData.get('supporting_materials') as string,
        notes: formData.get('notes') as string,
        follow_up_date: formData.get('follow_up_date') as string,
        status: 'completed'
      };

      const { error } = await supabase.from('advisory_sessions').insert([sessionData]);
      if (error) throw error;

      // Update client's total sessions and last session date
      const { error: updateError } = await supabase
        .from('advisory_clients')
        .update({
          total_sessions: clients.find(c => c.id === sessionData.client_id)?.total_sessions + 1 || 1,
          last_session_date: sessionData.session_date
        })
        .eq('id', sessionData.client_id);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Session recorded successfully"
      });

      setShowNewSessionForm(false);
      fetchData();
    } catch (error) {
      console.error('Error creating session:', error);
      toast({
        title: "Error",
        description: "Failed to record session",
        variant: "destructive"
      });
    }
  };

  const handleCreateGoal = async (clientId: string, formData: FormData) => {
    try {
      const goalData = {
        client_id: clientId,
        goal_type: formData.get('goal_type') as string,
        goal_amount: parseFloat(formData.get('goal_amount') as string),
        target_date: formData.get('target_date') as string,
        progress: parseInt(formData.get('progress') as string) || 0,
        status: 'active'
      };

      const { error } = await supabase.from('financial_goals').insert([goalData]);
      if (error) throw error;

      toast({
        title: "Success",
        description: "Goal created successfully"
      });

      fetchData();
    } catch (error) {
      console.error('Error creating goal:', error);
      toast({
        title: "Error",
        description: "Failed to create goal",
        variant: "destructive"
      });
    }
  };

  const handleCreateFollowUp = async (formData: FormData) => {
    try {
      const followUpData = {
        client_id: formData.get('client_id') as string,
        follow_up_date: formData.get('follow_up_date') as string,
        purpose: formData.get('purpose') as string,
        status: 'pending'
      };

      const { error } = await supabase.from('follow_up_records').insert([followUpData]);
      if (error) throw error;

      toast({
        title: "Success",
        description: "Follow-up scheduled successfully"
      });

      fetchData();
    } catch (error) {
      console.error('Error creating follow-up:', error);
      toast({
        title: "Error",
        description: "Failed to schedule follow-up",
        variant: "destructive"
      });
    }
  };

  const handleUpdateRiskProfile = async (clientId: string, formData: FormData) => {
    try {
      const updateData = {
        risk_tolerance: formData.get('risk_tolerance') as string,
        investment_preference: formData.get('investment_preference') as string,
        credit_behavior_notes: formData.get('credit_behavior_notes') as string,
        last_risk_assessment_date: new Date().toISOString().split('T')[0]
      };

      const { error } = await supabase
        .from('advisory_clients')
        .update(updateData)
        .eq('id', clientId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Risk profile updated successfully"
      });

      fetchData();
    } catch (error) {
      console.error('Error updating risk profile:', error);
      toast({
        title: "Error",
        description: "Failed to update risk profile",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800',
      scheduled: 'bg-purple-100 text-purple-800',
      achieved: 'bg-green-100 text-green-800',
      paused: 'bg-gray-100 text-gray-800'
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

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client?.client_name || 'Unknown Client';
  };

  if (loading) {
    return <div className="p-8 text-center">Loading advisory data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Advisory Operations</h2>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setShowNewClientForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Client
          </Button>
          <Button onClick={() => setShowNewSessionForm(true)}>
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Session
          </Button>
        </div>
      </div>

      {showNewClientForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Client</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleCreateClient(new FormData(e.target as HTMLFormElement));
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="client_name">Client Name</Label>
                  <Input name="client_name" required />
                </div>
                <div>
                  <Label htmlFor="contact_info">Contact Info</Label>
                  <Input name="contact_info" required />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input name="email" type="email" />
                </div>
                <div>
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input name="occupation" required />
                </div>
                <div>
                  <Label htmlFor="financial_stage">Financial Stage</Label>
                  <Select name="financial_stage" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select stage" />
                    </SelectTrigger>
                    <SelectContent>
                      {financialStages.map(stage => (
                        <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="risk_tolerance">Risk Tolerance</Label>
                  <Select name="risk_tolerance" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tolerance" />
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
                  <Select name="investment_preference" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select preference" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="safe">Safe</SelectItem>
                      <SelectItem value="balanced">Balanced</SelectItem>
                      <SelectItem value="aggressive">Aggressive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="knowledge_level">Knowledge Level</Label>
                  <Select name="knowledge_level" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex space-x-2 mt-4">
                <Button type="submit">Create Client</Button>
                <Button type="button" variant="outline" onClick={() => setShowNewClientForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

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
                    <TableHead>Contact</TableHead>
                    <TableHead>Risk Tolerance</TableHead>
                    <TableHead>Total Sessions</TableHead>
                    <TableHead>Last Session</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">{client.client_name}</TableCell>
                      <TableCell>{client.contact_info}</TableCell>
                      <TableCell>
                        <Badge className={getRiskBadge(client.risk_tolerance)}>
                          {client.risk_tolerance}
                        </Badge>
                      </TableCell>
                      <TableCell>{client.total_sessions}</TableCell>
                      <TableCell>{client.last_session_date}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(client.status)}>
                          {client.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <FileText className="w-4 h-4" />
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
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Advisory Session Records
                  <Button onClick={() => setShowNewSessionForm(true)}>
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
                        <TableCell className="font-medium">{getClientName(session.client_id)}</TableCell>
                        <TableCell>{session.advisory_type}</TableCell>
                        <TableCell>{session.advisor_name}</TableCell>
                        <TableCell>{session.session_date}</TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(session.status)}>
                            {session.status}
                          </Badge>
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

            {showNewSessionForm && (
              <Card>
                <CardHeader>
                  <CardTitle>Record New Advisory Session</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    handleCreateSession(new FormData(e.target as HTMLFormElement));
                  }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="client_id">Client</Label>
                        <Select name="client_id" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select client" />
                          </SelectTrigger>
                          <SelectContent>
                            {clients.map((client) => (
                              <SelectItem key={client.id} value={client.id}>
                                {client.client_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="advisory_type">Type of Advisory</Label>
                        <Select name="advisory_type" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select advisory type" />
                          </SelectTrigger>
                          <SelectContent>
                            {advisoryTypes.map((type) => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="advisor_name">Advisor Name</Label>
                        <Input name="advisor_name" required />
                      </div>
                      <div>
                        <Label htmlFor="session_date">Session Date</Label>
                        <Input name="session_date" type="date" required />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="advice_given">Advice Given</Label>
                        <Textarea name="advice_given" placeholder="Short summary of what was advised..." />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="action_plan">Action Plan</Label>
                        <Textarea name="action_plan" placeholder="What the client was advised to do..." />
                      </div>
                      <div>
                        <Label htmlFor="supporting_materials">Supporting Materials</Label>
                        <Input name="supporting_materials" placeholder="Documents given or used during session" />
                      </div>
                      <div>
                        <Label htmlFor="follow_up_date">Follow-up Date</Label>
                        <Input name="follow_up_date" type="date" />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="notes">Notes / Observations</Label>
                        <Textarea name="notes" placeholder="Any admin notes or special conditions..." />
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <Button type="submit">Save Session Record</Button>
                      <Button type="button" variant="outline" onClick={() => setShowNewSessionForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="goals">
          <div className="space-y-6">
            {clients.map((client) => {
              const clientGoals = goals.filter(g => g.client_id === client.id);
              return (
                <Card key={client.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Target className="w-5 h-5 mr-2 text-blue-500" />
                      {client.client_name} - Financial Goals Tracker
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
                        {clientGoals.map((goal) => (
                          <TableRow key={goal.id}>
                            <TableCell className="font-medium">{goal.goal_type}</TableCell>
                            <TableCell className="font-mono">{formatCurrency(goal.goal_amount)}</TableCell>
                            <TableCell>{goal.target_date}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-blue-600 h-2 rounded-full" 
                                    style={{ width: `${goal.progress}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-medium">{goal.progress}%</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusBadge(goal.status)}>
                                {goal.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    
                    <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                      <h4 className="font-medium mb-3">Add New Financial Goal</h4>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        handleCreateGoal(client.id, new FormData(e.target as HTMLFormElement));
                      }}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <Label htmlFor="goal_type">Goal Type</Label>
                            <Select name="goal_type" required>
                              <SelectTrigger>
                                <SelectValue placeholder="Select goal type" />
                              </SelectTrigger>
                              <SelectContent>
                                {goalTypes.map((type) => (
                                  <SelectItem key={type} value={type}>{type}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="goal_amount">Goal Amount</Label>
                            <Input name="goal_amount" type="number" placeholder="Enter amount" required />
                          </div>
                          <div>
                            <Label htmlFor="target_date">Target Date</Label>
                            <Input name="target_date" type="date" required />
                          </div>
                          <div>
                            <Label htmlFor="progress">Current Progress (%)</Label>
                            <Input name="progress" type="number" placeholder="0-100" max="100" min="0" />
                          </div>
                        </div>
                        <Button type="submit" className="mt-3">Add Goal</Button>
                      </form>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
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
                      <div className="mt-1">
                        <Badge className={getRiskBadge(client.risk_tolerance)}>
                          {client.risk_tolerance}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <Label>Investment Preference</Label>
                      <p className="font-medium capitalize">{client.investment_preference}</p>
                    </div>
                    <div>
                      <Label>Knowledge Level</Label>
                      <p className="font-medium capitalize">{client.knowledge_level}</p>
                    </div>
                    <div>
                      <Label>Financial Stage</Label>
                      <p className="font-medium">{client.financial_stage}</p>
                    </div>
                  </div>

                  <form onSubmit={(e) => {
                    e.preventDefault();
                    handleUpdateRiskProfile(client.id, new FormData(e.target as HTMLFormElement));
                  }}>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="risk_tolerance">Update Risk Tolerance</Label>
                        <Select name="risk_tolerance" defaultValue={client.risk_tolerance}>
                          <SelectTrigger>
                            <SelectValue />
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
                        <Select name="investment_preference" defaultValue={client.investment_preference}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="safe">Safe</SelectItem>
                            <SelectItem value="balanced">Balanced</SelectItem>
                            <SelectItem value="aggressive">Aggressive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="credit_behavior_notes">Credit Behavior Summary</Label>
                        <Textarea 
                          name="credit_behavior_notes" 
                          placeholder="Enter notes about client's credit behavior..."
                          defaultValue={client.credit_behavior_notes || ''}
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full mt-4">Update Risk Profile</Button>
                  </form>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="follow-up">
          <Card>
            <CardHeader>
              <CardTitle>Follow-Up & Monitoring</CardTitle>
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
                      <TableCell>{followUp.follow_up_date}</TableCell>
                      <TableCell className="font-medium">{getClientName(followUp.client_id)}</TableCell>
                      <TableCell>{followUp.purpose}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(followUp.status)}>
                          {followUp.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{followUp.outcome_notes || '-'}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-6 p-4 border rounded-lg bg-gray-50">
                <h4 className="font-medium mb-3">Schedule Follow-Up</h4>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleCreateFollowUp(new FormData(e.target as HTMLFormElement));
                }}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <Label htmlFor="client_id">Client</Label>
                      <Select name="client_id" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select client" />
                        </SelectTrigger>
                        <SelectContent>
                          {clients.map((client) => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.client_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="follow_up_date">Follow-Up Date</Label>
                      <Input name="follow_up_date" type="date" required />
                    </div>
                    <div>
                      <Label htmlFor="purpose">Purpose</Label>
                      <Input name="purpose" placeholder="Purpose of follow-up" required />
                    </div>
                  </div>
                  <Button type="submit" className="mt-3">Schedule Follow-Up</Button>
                </form>
              </div>
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
                  Advisory sessions recorded
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
                  Out of {clients.length} total clients
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Financial Goals</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{goals.length}</div>
                <p className="text-xs text-muted-foreground">
                  Goals being tracked
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Follow-ups</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{followUps.filter(f => f.status === 'pending').length}</div>
                <p className="text-xs text-muted-foreground">
                  Scheduled follow-ups
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Advisory Performance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Most Popular Advisory Type</Label>
                    <p className="text-lg font-medium">
                      {sessions.length > 0 ? 
                        Object.entries(sessions.reduce((acc, session) => {
                          acc[session.advisory_type] = (acc[session.advisory_type] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>)).sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'
                        : 'N/A'
                      }
                    </p>
                  </div>
                  <div>
                    <Label>Average Sessions per Client</Label>
                    <p className="text-lg font-medium">
                      {clients.length > 0 ? (sessions.length / clients.length).toFixed(1) : '0'}
                    </p>
                  </div>
                  <div>
                    <Label>Goals Achievement Rate</Label>
                    <p className="text-lg font-medium">
                      {goals.length > 0 ? Math.round((goals.filter(g => g.status === 'achieved').length / goals.length) * 100) : 0}%
                    </p>
                  </div>
                  <div>
                    <Label>Follow-up Completion Rate</Label>
                    <p className="text-lg font-medium">
                      {followUps.length > 0 ? Math.round((followUps.filter(f => f.status === 'completed').length / followUps.length) * 100) : 0}%
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvisoryOperations;
