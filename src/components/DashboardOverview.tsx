
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useCentralDashboardAuth } from '@/context/CentralDashboardAuthContext';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  PiggyBank, 
  CreditCard, 
  BarChart3,
  Edit,
  Save,
  X
} from 'lucide-react';

interface Metric {
  id: string;
  metric_name: string;
  metric_value: number;
  metric_description: string;
  last_updated: string;
  updated_by: string;
}

const DashboardOverview: React.FC = () => {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [editingMetric, setEditingMetric] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const { adminName } = useCentralDashboardAuth();
  const { toast } = useToast();

  const metricIcons: Record<string, any> = {
    total_loans_disbursed: DollarSign,
    total_active_loans: CreditCard,
    total_savings_collected: PiggyBank,
    total_active_savers: Users,
    total_advisory_sessions: BarChart3,
    total_wealth_portfolios: TrendingUp,
    total_assets_under_management: DollarSign,
    overdue_loans_count: CreditCard,
    monthly_revenue: DollarSign,
    total_clients: Users,
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const { data, error } = await supabase
        .from('central_dashboard_overview')
        .select('*')
        .order('metric_name');

      if (error) throw error;
      setMetrics(data || []);
    } catch (error) {
      console.error('Error fetching metrics:', error);
      toast({
        title: "Error",
        description: "Failed to fetch dashboard metrics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (metric: Metric) => {
    setEditingMetric(metric.id);
    setEditValue(metric.metric_value.toString());
  };

  const handleSave = async (metricId: string) => {
    try {
      const { error } = await supabase
        .from('central_dashboard_overview')
        .update({
          metric_value: parseFloat(editValue),
          last_updated: new Date().toISOString(),
          updated_by: adminName || 'admin'
        })
        .eq('id', metricId);

      if (error) throw error;

      setEditingMetric(null);
      setEditValue('');
      await fetchMetrics();
      
      toast({
        title: "Success",
        description: "Metric updated successfully",
      });
    } catch (error) {
      console.error('Error updating metric:', error);
      toast({
        title: "Error",
        description: "Failed to update metric",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setEditingMetric(null);
    setEditValue('');
  };

  const formatValue = (metricName: string, value: number) => {
    if (metricName.includes('amount') || metricName.includes('revenue') || metricName.includes('assets')) {
      return `UGX ${value.toLocaleString()}`;
    }
    return value.toLocaleString();
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading dashboard overview...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
          <p className="text-muted-foreground">
            Key performance metrics and business indicators
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {metrics.map((metric) => {
          const IconComponent = metricIcons[metric.metric_name] || BarChart3;
          const isEditing = editingMetric === metric.id;

          return (
            <Card key={metric.id} className="relative">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {metric.metric_description}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <IconComponent className="h-4 w-4 text-muted-foreground" />
                  {!isEditing && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(metric)}
                      className="h-6 w-6 p-0"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {isEditing ? (
                    <div className="space-y-2">
                      <Input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="text-lg font-bold"
                      />
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleSave(metric.id)}
                          className="flex-1"
                        >
                          <Save className="h-3 w-3 mr-1" />
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancel}
                          className="flex-1"
                        >
                          <X className="h-3 w-3 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="text-2xl font-bold">
                        {formatValue(metric.metric_name, metric.metric_value)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Last updated: {new Date(metric.last_updated).toLocaleDateString()}
                      </p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardOverview;
