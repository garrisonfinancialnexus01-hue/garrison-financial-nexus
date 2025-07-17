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
import { Plus, MessageSquare, Phone, Mail, Calendar, Search, Download, Archive, Clock, Edit } from 'lucide-react';

interface CommunicationRecord {
  id: string;
  clientName: string;
  clientId: string;
  accountNo: string;
  dateTime: string;
  communicationType: 'sms' | 'call' | 'whatsapp' | 'email' | 'meeting';
  messageContent: string;
  purpose: string;
  staffMember: string;
  responseStatus: 'responded' | 'no-response' | 'awaiting' | 'completed';
  notes: string;
}

interface MessageTemplate {
  id: string;
  name: string;
  type: string;
  content: string;
  variables: string[];
}

interface FollowUpSchedule {
  id: string;
  clientName: string;
  date: string;
  channel: string;
  purpose: string;
  assignedTo: string;
  status: 'pending' | 'completed' | 'overdue';
}

const CommunicationLog: React.FC = () => {
  const [communications, setCommunications] = useState<CommunicationRecord[]>([
    {
      id: '1',
      clientName: 'Mary Nakato',
      clientId: 'CLI003',
      accountNo: 'SAV003',
      dateTime: '2024-01-15 14:30',
      communicationType: 'sms',
      messageContent: 'Reminder: Your loan payment of UGX 500,000 is due on Jan 20th. Please make payment to avoid penalties.',
      purpose: 'Payment Reminder',
      staffMember: 'John Doe',
      responseStatus: 'responded',
      notes: 'Client confirmed payment will be made tomorrow'
    },
    {
      id: '2',
      clientName: 'David Ssemakula',
      clientId: 'CLI004',
      accountNo: 'LON002',
      dateTime: '2024-01-14 09:15',
      communicationType: 'call',
      messageContent: 'Follow-up call regarding investment advisory session',
      purpose: 'Follow-up',
      staffMember: 'Sarah Wanjiku',
      responseStatus: 'no-response',
      notes: 'Call went to voicemail, will try again tomorrow'
    }
  ]);

  const [templates, setTemplates] = useState<MessageTemplate[]>([
    {
      id: '1',
      name: 'Loan Payment Reminder',
      type: 'Payment Reminder',
      content: 'Reminder: Your loan payment of UGX {AMOUNT} is due on {DUE_DATE}. Please make payment to avoid penalties.',
      variables: ['AMOUNT', 'DUE_DATE', 'CLIENT_NAME']
    },
    {
      id: '2',
      name: 'Savings Deposit Follow-up',
      type: 'Follow-up',
      content: 'Dear {CLIENT_NAME}, we noticed you haven\'t made your regular savings deposit. Would you like to schedule a deposit?',
      variables: ['CLIENT_NAME']
    },
    {
      id: '3',
      name: 'Welcome Message',
      type: 'Welcome',
      content: 'Welcome to Garrison Financial Nexus, {CLIENT_NAME}! Your account {ACCOUNT_NO} has been successfully created.',
      variables: ['CLIENT_NAME', 'ACCOUNT_NO']
    }
  ]);

  const [followUps, setFollowUps] = useState<FollowUpSchedule[]>([
    {
      id: '1',
      clientName: 'Peter Okello',
      date: '2024-01-18',
      channel: 'WhatsApp',
      purpose: 'Advisory Session Follow-up',
      assignedTo: 'Sarah Wanjiku',
      status: 'pending'
    },
    {
      id: '2',
      clientName: 'Grace Achieng',
      date: '2024-01-16',
      channel: 'SMS',
      purpose: 'Loan Application Update',
      assignedTo: 'John Doe',
      status: 'overdue'
    }
  ]);

  const communicationTypes = ['SMS', 'Call', 'WhatsApp', 'Email', 'Physical Meeting'];
  const purposes = ['Reminder', 'Follow-up', 'Support', 'Advisory', 'Payment Notice', 'Welcome', 'Account Update'];
  const channels = ['SMS', 'Call', 'WhatsApp', 'Email', 'Meeting'];

  const getStatusBadge = (status: string) => {
    const variants = {
      responded: 'bg-green-100 text-green-800',
      'no-response': 'bg-red-100 text-red-800',
      awaiting: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800',
      overdue: 'bg-red-100 text-red-800'
    };
    return variants[status as keyof typeof variants] || variants.awaiting;
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      sms: MessageSquare,
      call: Phone,
      whatsapp: MessageSquare,
      email: Mail,
      meeting: Calendar
    };
    const Icon = icons[type as keyof typeof icons] || MessageSquare;
    return <Icon className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Communication Log</h2>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Archive className="w-4 h-4 mr-2" />
            Templates
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Communication
          </Button>
        </div>
      </div>

      <Tabs defaultValue="log" className="space-y-4">
        <TabsList>
          <TabsTrigger value="log">Communication Log</TabsTrigger>
          <TabsTrigger value="templates">Message Templates</TabsTrigger>
          <TabsTrigger value="history">Client History</TabsTrigger>
          <TabsTrigger value="follow-ups">Scheduled Follow-Ups</TabsTrigger>
          <TabsTrigger value="analytics">Analytics Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="log">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Message/Interaction Log
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Sent By</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {communications.map((comm) => (
                    <TableRow key={comm.id}>
                      <TableCell className="font-medium">{comm.clientName}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(comm.communicationType)}
                          <span className="capitalize">{comm.communicationType}</span>
                        </div>
                      </TableCell>
                      <TableCell>{comm.dateTime}</TableCell>
                      <TableCell>{comm.purpose}</TableCell>
                      <TableCell>{comm.staffMember}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(comm.responseStatus)}>
                          {comm.responseStatus.replace('-', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-6 p-4 border rounded-lg bg-gray-50">
                <h4 className="font-medium mb-4">Add New Communication Log</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label>Client Name</Label>
                    <Input placeholder="Enter client name" />
                  </div>
                  <div>
                    <Label>Client ID / Account No.</Label>
                    <Input placeholder="Enter client ID or account number" />
                  </div>
                  <div>
                    <Label>Communication Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {communicationTypes.map((type) => (
                          <SelectItem key={type} value={type.toLowerCase()}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Purpose</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select purpose" />
                      </SelectTrigger>
                      <SelectContent>
                        {purposes.map((purpose) => (
                          <SelectItem key={purpose} value={purpose}>{purpose}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Staff Member</Label>
                    <Input placeholder="Enter staff member name" />
                  </div>
                  <div>
                    <Label>Date & Time</Label>
                    <Input type="datetime-local" />
                  </div>
                  <div className="md:col-span-2 lg:col-span-3">
                    <Label>Message Content / Summary</Label>
                    <Textarea placeholder="Brief of what was communicated..." />
                  </div>
                  <div className="md:col-span-2 lg:col-span-3">
                    <Label>Notes</Label>
                    <Textarea placeholder="Any follow-up comments or next steps..." />
                  </div>
                </div>
                <Button className="mt-4">Save Communication Log</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Message Templates Library
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Template
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {templates.map((template) => (
                    <Card key={template.id} className="border">
                      <CardHeader>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <Badge variant="outline">{template.type}</Badge>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <Label>Template Content</Label>
                            <p className="text-sm bg-gray-50 p-2 rounded border">
                              {template.content}
                            </p>
                          </div>
                          <div>
                            <Label>Variables</Label>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {template.variables.map((variable) => (
                                <Badge key={variable} variant="secondary" className="text-xs">
                                  {variable}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </Button>
                            <Button size="sm" variant="outline">
                              Use Template
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Create New Template</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Template Name</Label>
                      <Input placeholder="Enter template name" />
                    </div>
                    <div>
                      <Label>Template Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {purposes.map((purpose) => (
                            <SelectItem key={purpose} value={purpose}>{purpose}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>Template Content</Label>
                    <Textarea 
                      placeholder="Enter template content. Use {VARIABLE_NAME} for dynamic content..."
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label>Available Variables</Label>
                    <p className="text-sm text-gray-600">
                      Use these variables in your template: {'{CLIENT_NAME}'}, {'{AMOUNT}'}, {'{DUE_DATE}'}, {'{ACCOUNT_NO}'}
                    </p>
                  </div>
                  <Button>Create Template</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Communication History Per Client</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Search Client</Label>
                  <Input placeholder="Enter client name or ID to view communication history" />
                </div>
                
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3">Mary Nakato (CLI003)</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Sent By</TableHead>
                        <TableHead>Purpose</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>2024-01-15</TableCell>
                        <TableCell>SMS</TableCell>
                        <TableCell>John Doe</TableCell>
                        <TableCell>Payment Reminder</TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge('responded')}>
                            Responded
                          </Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>2024-01-10</TableCell>
                        <TableCell>Call</TableCell>
                        <TableCell>Sarah Wanjiku</TableCell>
                        <TableCell>Advisory Follow-up</TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge('completed')}>
                            Completed
                          </Badge>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="follow-ups">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Upcoming Scheduled Messages or Follow-Ups
                <Button>
                  <Clock className="w-4 h-4 mr-2" />
                  Schedule New
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Channel</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {followUps.map((followUp) => (
                    <TableRow key={followUp.id}>
                      <TableCell>{followUp.date}</TableCell>
                      <TableCell className="font-medium">{followUp.clientName}</TableCell>
                      <TableCell>{followUp.channel}</TableCell>
                      <TableCell>{followUp.purpose}</TableCell>
                      <TableCell>{followUp.assignedTo}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(followUp.status)}>
                          {followUp.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            Complete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-6 p-4 border rounded-lg bg-gray-50">
                <h4 className="font-medium mb-3">Schedule New Follow-Up</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div>
                    <Label>Client Name</Label>
                    <Input placeholder="Enter client name" />
                  </div>
                  <div>
                    <Label>Follow-Up Date</Label>
                    <Input type="date" />
                  </div>
                  <div>
                    <Label>Channel</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select channel" />
                      </SelectTrigger>
                      <SelectContent>
                        {channels.map((channel) => (
                          <SelectItem key={channel} value={channel}>{channel}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Purpose</Label>
                    <Input placeholder="Purpose of follow-up" />
                  </div>
                  <div>
                    <Label>Assign To</Label>
                    <Input placeholder="Staff member name" />
                  </div>
                  <div>
                    <Label>Time</Label>
                    <Input type="time" />
                  </div>
                </div>
                <Button className="mt-3">Schedule Follow-Up</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Messages This Week</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-muted-foreground">
                    +15% from last week
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
                  <Phone className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">78%</div>
                  <p className="text-xs text-muted-foreground">
                    Estimated manually
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Follow-Ups</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{followUps.filter(f => f.status === 'pending').length}</div>
                  <p className="text-xs text-muted-foreground">
                    Need attention
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Most Used Channel</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">SMS</div>
                  <p className="text-xs text-muted-foreground">
                    45% of communications
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Communication Summary Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label>Staff Communication Activity</Label>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Staff Member</TableHead>
                          <TableHead>Messages Sent</TableHead>
                          <TableHead>Calls Made</TableHead>
                          <TableHead>Response Rate</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>John Doe</TableCell>
                          <TableCell>12</TableCell>
                          <TableCell>8</TableCell>
                          <TableCell>85%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Sarah Wanjiku</TableCell>
                          <TableCell>8</TableCell>
                          <TableCell>5</TableCell>
                          <TableCell>70%</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                  
                  <div>
                    <Label>Clients Who Haven't Responded</Label>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-sm text-red-800">
                        3 clients need follow-up: David Ssemakula, Peter Okello, Grace Achieng
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunicationLog;