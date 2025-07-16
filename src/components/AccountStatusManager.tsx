
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, UserCheck, UserX, AlertTriangle } from 'lucide-react';

interface AccountStatusManagerProps {
  clientData: any;
  onStatusUpdate: (newStatus: string) => void;
}

export const AccountStatusManager: React.FC<AccountStatusManagerProps> = ({ 
  clientData, 
  onStatusUpdate 
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const updateAccountStatus = async (newStatus: 'active' | 'suspended' | 'inactive') => {
    if (!clientData) {
      toast({
        title: "Error",
        description: "No client account selected",
        variant: "destructive",
      });
      return;
    }

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('client_accounts')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', clientData.id);

      if (error) {
        console.error('Status update error:', error);
        toast({
          title: "Error",
          description: "Failed to update account status",
          variant: "destructive",
        });
        return;
      }

      onStatusUpdate(newStatus);
      
      toast({
        title: "Success",
        description: `Account status updated to ${newStatus} for ${clientData.name}`,
      });
    } catch (error) {
      console.error('Status update error:', error);
      toast({
        title: "Error",
        description: "An error occurred while updating account status",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (!clientData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-garrison-green" />
            Account Status Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <UserX className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No client selected</p>
            <p className="text-sm">Search for a client account to manage status</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentStatus = clientData.status;
  const canDeactivate = currentStatus === 'active';
  const canReactivate = currentStatus === 'suspended' || currentStatus === 'inactive';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCheck className="h-5 w-5 text-garrison-green" />
          Account Status Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium">{clientData.name}</h4>
            <p className="text-sm text-gray-600">Account: {clientData.account_number}</p>
          </div>
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
            currentStatus === 'active' 
              ? 'bg-green-100 text-green-800' 
              : currentStatus === 'suspended'
              ? 'bg-red-100 text-red-800'
              : currentStatus === 'inactive'
              ? 'bg-gray-100 text-gray-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
          </span>
        </div>

        <div className="space-y-3">
          {canReactivate && (
            <Button
              onClick={() => updateAccountStatus('active')}
              disabled={isUpdating}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <UserCheck className="mr-2 h-4 w-4" />
                  Reactivate Account
                </>
              )}
            </Button>
          )}

          {canDeactivate && (
            <>
              <Button
                onClick={() => updateAccountStatus('suspended')}
                disabled={isUpdating}
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Suspend Account
                  </>
                )}
              </Button>

              <Button
                onClick={() => updateAccountStatus('inactive')}
                disabled={isUpdating}
                variant="destructive"
                className="w-full"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <UserX className="mr-2 h-4 w-4" />
                    Deactivate Account
                  </>
                )}
              </Button>
            </>
          )}
        </div>

        {currentStatus === 'pending' && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              This account is pending activation and cannot be managed until activated.
            </p>
          </div>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <p><strong>Active:</strong> Account is fully operational</p>
          <p><strong>Suspended:</strong> Temporarily restricted, can be reactivated</p>
          <p><strong>Inactive:</strong> Permanently deactivated, requires reactivation</p>
        </div>
      </CardContent>
    </Card>
  );
};
