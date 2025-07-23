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
import { Plus, Edit, Download, Calendar, Target, TrendingUp, FileText, User } from 'lucide-react';

interface AdvisoryClient {
  id: string;
  clientName: string;
  clientId: string;
  contactInfo: string;
  email?: string;
  occupation: string;
  financialStage: string;
  riskTolerance: 'low' | 'moderate' | 'high';
  investmentPreference: 'safe' | 'balanced' | 'aggressive';
  knowledgeLevel: 'beginner' | 'intermediate' | 'advanced';
  totalSessions: number;
  lastSessionDate: string;
  status: 'active' | 'pending' | 'completed';
}

interface AdvisorySession {
  id: string;
  clientId: string;
  clientName: string;
  advisoryType: string;
  advisorName: string;
  sessionDate: string;
  adviceGiven: string;
  actionPlan: string;
  supportingMaterials?: string;
  notes: string;
  followUpDate?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

interface FinancialGoal {
  id: string;
  clientId: string;
  goalType: string;
  goalAmount: number;
  targetDate: string;
  progress: number;
  status: 'active' | 'achieved' | 'paused';
}

const AdvisoryOperations: React.FC = () => {
  const [clients, setClients] = useState<AdvisoryClient[]>([
    {
      id: '1',
      clientName: 'Robert Kamau',
      clientId: 'CLI002',
      contactInfo: '+256781234567',
      email: 'robert.kamau@email.com',
      occupation: 'Software Engineer',
      financialStage: 'Working Adult',
      riskTolerance: 'moderate',
      investmentPreference: 'balanced',
      knowledgeLevel: 'intermediate',
      totalSessions: 3,
      lastSessionDate: '2024-01-10',
      status: 'active'
    }
  ]);

  const [sessions, setSessions] = useState<AdvisorySession[]>([
    {
      id: '1',
      clientId: '1',
      clientName: 'Robert Kamau',
      advisoryType: 'Investment Strategy',
      advisorName: 'Sarah Wanjiku',
      sessionDate: '2024-01-10',
      adviceGiven: 'Diversify investment portfolio across stocks, bonds, and real estate',
      actionPlan: 'Allocate 60% stocks, 30% bonds, 10% real estate investment',
      supportingMaterials: 'Investment Portfolio Template',
      notes: 'Client shows good understanding of investment concepts',
      followUpDate: '2024-02-10',
      status: 'completed'
    }
  ]);

  const [goals, setGoals] = useState<FinancialGoal[]>([
    {
      id: '1',
      clientId: '1',
      goalType: 'Emergency Fund',
      goalAmount: 5000000,
      targetDate: '2024-12-31',
      progress: 60,
      status: 'active'
    },
    {
      id: '2',
      clientId: '1',
      goalType: 'House Purchase',
      goalAmount: 200000000,
      targetDate: '2026-12-31',
      progress: 15,
      status: 'active'
    }
  ]);

  const advisoryTypes = ['Savings Plan', 'Investment Strategy', 'Retirement Planning', 'Budgeting Help', 'Debt Management', 'Insurance Planning'];
  const financialStages = ['Student', 'Working Adult', 'Mid-Career', 'Pre-Retirement', 'Retired'];
  const goalTypes = ['Emergency Fund', 'House Purchase', 'Car Purchase', 'Education Fund', 'Retirement Fund', 'Business Investment'];

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Advisory Operations</h2>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            New Client
          </Button>
          <Button>
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Session
          </Button>
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
                    <TableHead>Advisory Type</TableHead>
                    <TableHead>Last Session</TableHead>
                    <TableHead>Advisor</TableHead>
                    <TableHead>Goal Status</TableHead>
                    <TableHead>Next Follow-Up</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.map((client) => {
                    const lastSession = sessions.find(s => s.clientId === client.id);
                    return (
                      <TableRow key={client.id}>
                        <TableCell className="font-medium">{client.clientName}</TableCell>
                        <TableCell>{lastSession?.advisoryType || 'N/A'}</TableCell>
                        <TableCell>{client.lastSessionDate}</TableCell>
                        <TableCell>{lastSession?.advisorName || 'N/A'}</TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(client.status)}>
                            {client.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{lastSession?.followUpDate || 'N/A'}</TableCell>
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
                    );
                  })}
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
                  <Button>
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
                        <TableCell className="font-medium">{session.clientName}</TableCell>
                        <TableCell>{session.advisoryType}</TableCell>
                        <TableCell>{session.advisorName}</TableCell>
                        <TableCell>{session.sessionDate}</TableCell>
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

            <Card>
              <CardHeader>
                <CardTitle>Record New Advisory Session</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Client</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select client" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.clientName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Type of Advisory</Label>
                    <Select>
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
                    <Label>Advisor Name</Label>
                    <Input placeholder="Enter advisor name" />
                  </div>
                  <div>
                    <Label>Session Date</Label>
                    <Input type="date" />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Advice Given</Label>
                    <Textarea placeholder="Short summary of what was advised..." />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Action Plan</Label>
                    <Textarea placeholder="What the client was advised to do..." />
                  </div>
                  <div>
                    <Label>Supporting Materials</Label>
                    <Input placeholder="Documents given or used during session" />
                  </div>
                  <div>
                    <Label>Follow-up Date</Label>
                    <Input type="date" />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Notes / Observations</Label>
                    <Textarea placeholder="Any admin notes or special conditions..." />
                  </div>
                </div>
                <Button className="mt-4">Save Session Record</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="goals">
          <div className="space-y-6">
            {clients.map((client) => {
              const clientGoals = goals.filter(g => g.clientId === client.id);
              return (
                <Card key={client.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Target className="w-5 h-5 mr-2 text-blue-500" />
                      {client.clientName} - Financial Goals Tracker
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
                            <TableCell className="font-medium">{goal.goalType}</TableCell>
                            <TableCell className="font-mono">{formatCurrency(goal.goalAmount)}</TableCell>
                            <TableCell>{goal.targetDate}</TableCell>
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <Label>Goal Type</Label>
                          <Select>
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
                          <Label>Goal Amount</Label>
                          <Input type="number" placeholder="Enter amount" />
                        </div>
                        <div>
                          <Label>Target Date</Label>
                          <Input type="date" />
                        </div>
                        <div>
                          <Label>Current Progress (%)</Label>
                          <Input type="number" placeholder="0-100" max="100" min="0" />
                        </div>
                      </div>
                      <Button className="mt-3">Add Goal</Button>
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
                    {client.clientName} - Risk Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Risk Tolerance</Label>
                      <div className="mt-1">
                        <Badge className={getRiskBadge(client.riskTolerance)}>
                          {client.riskTolerance}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <Label>Investment Preference</Label>
                      <p className="font-medium capitalize">{client.investmentPreference}</p>
                    </div>
                    <div>
                      <Label>Knowledge Level</Label>
                      <p className="font-medium capitalize">{client.knowledgeLevel}</p>
                    </div>
                    <div>
                      <Label>Financial Stage</Label>
                      <p className="font-medium">{client.financialStage}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <Label>Update Risk Tolerance</Label>
                      <Select defaultValue={client.riskTolerance}>
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
                      <Label>Investment Preference</Label>
                      <Select defaultValue={client.investmentPreference}>
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
                      <Label>Credit Behavior Summary</Label>
                      <Textarea placeholder="Enter notes about client's credit behavior..." />
                    </div>
                  </div>

                  <Button className="w-full">Update Risk Profile</Button>
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
                  {sessions.filter(s => s.followUpDate).map((session) => (
                    <TableRow key={session.id}>
                      <TableCell>{session.followUpDate}</TableCell>
                      <TableCell className="font-medium">{session.clientName}</TableCell>
                      <TableCell>Review {session.advisoryType}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge('pending')}>
                          Pending
                        </Badge>
                      </TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          <Calendar className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-6 p-4 border rounded-lg bg-gray-50">
                <h4 className="font-medium mb-3">Schedule Follow-Up</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <Label>Client</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select client" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.clientName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Follow-Up Date</Label>
                    <Input type="date" />
                  </div>
                  <div>
                    <Label>Purpose</Label>
                    <Input placeholder="Purpose of follow-up" />
                  </div>
                </div>
                <Button className="mt-3">Schedule Follow-Up</Button>
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
                  +2 from last month
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
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">85%</div>
                <p className="text-xs text-muted-foreground">
                  Advice to action
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
                    placeholder="Enter overall client feedback summary..."
                    defaultValue="Clients generally satisfied with advisory services. Most appreciate the personalized investment strategies and clear action plans."
                  />
                </div>
                <Button>Update Summary</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvisoryOperations;