
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Lock, User } from 'lucide-react';
import { useReceiptEditorAuth } from '@/context/ReceiptEditorAuthContext';
import { useToast } from '@/hooks/use-toast';

export const ReceiptEditorLogin: React.FC = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useReceiptEditorAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signIn(name, password);
      
      if (error) {
        toast({
          title: "Authentication Failed",
          description: error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login Successful",
          description: "Welcome to the Receipt Editor Portal",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-garrison-light to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img 
              src="/lovable-uploads/fd715cbb-c401-4f16-989c-400d699b5baf.png" 
              alt="Garrison Financial Nexus Logo" 
              className="h-16 w-16" 
            />
          </div>
          <CardTitle className="text-2xl font-bold text-garrison-green">
            Receipt Editor Portal
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Secure access for authorized personnel only
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Administrator Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <Button
              type="submit"
              className="w-full bg-garrison-green hover:bg-garrison-green/90"
              disabled={isLoading}
            >
              {isLoading ? 'Authenticating...' : 'Access Portal'}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Authorized access only</p>
            <p className="mt-1">Session expires when you leave</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
