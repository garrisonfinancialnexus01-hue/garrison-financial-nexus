
import React from 'react';
import { CentralDashboardAuthProvider, useCentralDashboardAuth } from '@/context/CentralDashboardAuthContext';
import CentralDashboardLogin from '@/components/CentralDashboardLogin';
import DashboardOverview from '@/components/DashboardOverview';
import LendingOperations from '@/components/LendingOperations';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, 
  LogOut, 
  BarChart3, 
  CreditCard, 
  PiggyBank, 
  MessageSquare, 
  Users, 
  HeadphonesIcon 
} from 'lucide-react';

const DashboardContent: React.FC = () => {
  const { isAuthenticated, adminName, logout, loading } = useCentralDashboardAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <CentralDashboardLogin />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center space-x-2">
            <Building2 className="h-6 w-6" />
            <h1 className="text-xl font-bold">Central Dashboard</h1>
          </div>
          
          <div className="ml-auto flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {adminName}
            </span>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="p-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="lending" className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4" />
              <span>Lending</span>
            </TabsTrigger>
            <TabsTrigger value="saving" className="flex items-center space-x-2">
              <PiggyBank className="w-4 h-4" />
              <span>Saving</span>
            </TabsTrigger>
            <TabsTrigger value="advisory" className="flex items-center space-x-2">
              <HeadphonesIcon className="w-4 h-4" />
              <span>Advisory</span>
            </TabsTrigger>
            <TabsTrigger value="staff" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Staff</span>
            </TabsTrigger>
            <TabsTrigger value="communication" className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>Communication</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <DashboardOverview />
          </TabsContent>

          <TabsContent value="lending">
            <LendingOperations />
          </TabsContent>

          <TabsContent value="saving">
            <div className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">Saving Operations - Coming Soon</p>
            </div>
          </TabsContent>

          <TabsContent value="advisory">
            <div className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">Advisory Operations - Coming Soon</p>
            </div>
          </TabsContent>

          <TabsContent value="staff">
            <div className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">Staff Performance - Coming Soon</p>
            </div>
          </TabsContent>

          <TabsContent value="communication">
            <div className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">Communication Log - Coming Soon</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

const CentralDashboard: React.FC = () => {
  return (
    <CentralDashboardAuthProvider>
      <DashboardContent />
    </CentralDashboardAuthProvider>
  );
};

export default CentralDashboard;
