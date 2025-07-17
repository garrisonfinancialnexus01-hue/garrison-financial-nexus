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
import { Plus, Edit, Trash, UserCheck, UserX, Download, AlertTriangle, Calendar } from 'lucide-react';

interface StaffMember {
  id: string;
  fullName: string;
  staffId: string;
  jobTitle: string;
  department: string;
  contactNumber: string;
  email: string;
  nationalId: string;
  dateOfHire: string;
  roleType: string;
  accessLevel: string;
  lastLogin: string;
  totalClients: number;
  loansApproved: number;
  savingsManaged: number;
  advisorySessions: number;
  performanceScore: number;
  status: 'active' | 'inactive' | 'suspended';
}

const StaffManagement: React.FC = () => {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([
    {
      id: '1',
      fullName: 'John Doe',
      staffId: 'STF001',
      jobTitle: 'Loan Officer',
      department: 'Lending',
      contactNumber: '+256781234567',
      email: 'john.doe@garrison.com',
      nationalId: 'CM12345678901234',
      dateOfHire: '2023-01-15',
      roleType: 'Limited Staff',
      accessLevel: 'Can Add/Edit',
      lastLogin: '2024-01-15 09:30',
      totalClients: 45,
      loansApproved: 23,
      savingsManaged: 0,
      advisorySessions: 0,
      performanceScore: 85,
      status: 'active'
    }
  ]);

  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const departmentOptions = ['Lending', 'Saving', 'Advisory', 'Wealth Management', 'Admin'];
  const roleOptions = ['Admin', 'Limited Staff', 'Viewer'];
  const accessLevelOptions = ['Can View Only', 'Can Add', 'Can Edit', 'Full Access'];

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      suspended: 'bg-red-100 text-red-800'
    };
    return variants[status as keyof typeof variants] || variants.active;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Staff Management</h2>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Staff
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Staff Overview</TabsTrigger>
          <TabsTrigger value="profiles">Staff Profiles</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="access">Access & Permissions</TabsTrigger>
          <TabsTrigger value="disciplinary">Disciplinary Records</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Staff Overview Table</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Clients Handled</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staffMembers.map((staff) => (
                    <TableRow key={staff.id}>
                      <TableCell className="font-medium">{staff.fullName}</TableCell>
                      <TableCell>{staff.jobTitle}</TableCell>
                      <TableCell>{staff.department}</TableCell>
                      <TableCell>{staff.totalClients}</TableCell>
                      <TableCell>{staff.lastLogin}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(staff.status)}>
                          {staff.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
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

        <TabsContent value="profiles">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {staffMembers.map((staff) => (
              <Card key={staff.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {staff.fullName}
                    <Badge className={getStatusBadge(staff.status)}>
                      {staff.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <Label>Staff ID</Label>
                      <p className="font-medium">{staff.staffId}</p>
                    </div>
                    <div>
                      <Label>Job Title</Label>
                      <p className="font-medium">{staff.jobTitle}</p>
                    </div>
                    <div>
                      <Label>Department</Label>
                      <p className="font-medium">{staff.department}</p>
                    </div>
                    <div>
                      <Label>Contact</Label>
                      <p className="font-medium">{staff.contactNumber}</p>
                    </div>
                    <div>
                      <Label>Email</Label>
                      <p className="font-medium">{staff.email}</p>
                    </div>
                    <div>
                      <Label>Date of Hire</Label>
                      <p className="font-medium">{staff.dateOfHire}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2 pt-4">
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button size="sm" variant="outline">
                      <UserCheck className="w-4 h-4 mr-2" />
                      Reset Access
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

        <TabsContent value="performance">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {staffMembers.map((staff) => (
              <Card key={staff.id}>
                <CardHeader>
                  <CardTitle>{staff.fullName} - Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{staff.totalClients}</div>
                      <div className="text-sm text-gray-600">Total Clients</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{staff.loansApproved}</div>
                      <div className="text-sm text-gray-600">Loans Approved</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{staff.savingsManaged}</div>
                      <div className="text-sm text-gray-600">Savings Managed</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{staff.performanceScore}%</div>
                      <div className="text-sm text-gray-600">Performance Score</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Manual Notes</Label>
                    <Textarea placeholder="Enter performance notes or comments..." />
                  </div>
                  <Button className="w-full">Update Performance Metrics</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="access">
          <div className="space-y-6">
            {staffMembers.map((staff) => (
              <Card key={staff.id}>
                <CardHeader>
                  <CardTitle>{staff.fullName} - Access & Permissions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Role Type</Label>
                      <Select defaultValue={staff.roleType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {roleOptions.map((role) => (
                            <SelectItem key={role} value={role}>{role}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Access Level</Label>
                      <Select defaultValue={staff.accessLevel}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {accessLevelOptions.map((level) => (
                            <SelectItem key={level} value={level}>{level}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Last Login</Label>
                      <p className="font-medium p-2">{staff.lastLogin}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline">
                      <UserCheck className="w-4 h-4 mr-2" />
                      Update Permissions
                    </Button>
                    <Button variant="outline">
                      <UserX className="w-4 h-4 mr-2" />
                      Deactivate Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="disciplinary">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
                Disciplinary Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground">No disciplinary records found</p>
                  <Button variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Record
                  </Button>
                </div>
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h4 className="font-medium mb-2">Add New Disciplinary Record</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Staff Member</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select staff member" />
                        </SelectTrigger>
                        <SelectContent>
                          {staffMembers.map((staff) => (
                            <SelectItem key={staff.id} value={staff.id}>{staff.fullName}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Date of Incident</Label>
                      <Input type="date" />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Description of Incident</Label>
                      <Textarea placeholder="Enter incident description..." />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Admin Comments</Label>
                      <Textarea placeholder="Enter admin comments..." />
                    </div>
                  </div>
                  <Button className="mt-4">Save Record</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StaffManagement;