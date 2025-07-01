
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const ClientSignIn = () => {
  const [accountNumber, setAccountNumber] = useState('');
  const [signInCode, setSignInCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Attempting sign in with:', { accountNumber, signInCode });

      // First check if account exists and is active
      const { data: account, error: accountError } = await supabase
        .from('client_accounts')
        .select('*')
        .eq('account_number', accountNumber.trim())
        .eq('status', 'active')
        .maybeSingle();

      if (accountError) {
        console.error('Database error:', accountError);
        toast({
          title: "Sign In Failed",
          description: "Database error occurred. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (!account) {
        toast({
          title: "Account Not Found",
          description: "Account number not found or account is not active. Please contact the manager to activate your account.",
          variant: "destructive",
        });
        return;
      }

      // Check if the provided sign-in code matches the stored password (which is the sign-in code)
      if (account.password_hash !== signInCode.trim()) {
        toast({
          title: "Invalid Credentials",
          description: "Invalid sign-in code. Please check and try again.",
          variant: "destructive",
        });
        return;
      }

      // Store client session
      localStorage.setItem('currentClient', JSON.stringify(account));
      
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });

      navigate('/client-dashboard');

    } catch (error) {
      console.error('Sign in error:', error);
      toast({
        title: "Sign In Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <div className="flex items-center mb-4">
              <Link to="/" className="flex items-center text-garrison-green hover:text-garrison-black">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </div>
            <CardTitle className="text-2xl text-center">Client Sign In</CardTitle>
            <CardDescription className="text-center">
              Enter your account number and sign-in code to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="account-number">Account Number</Label>
                <Input
                  id="account-number"
                  type="text"
                  placeholder="Enter your 8-digit account number"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  maxLength={8}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sign-in-code">Sign-In Code</Label>
                <Input
                  id="sign-in-code"
                  type="text"
                  placeholder="Enter your sign-in code"
                  value={signInCode}
                  onChange={(e) => setSignInCode(e.target.value)}
                  maxLength={20}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/client-registration" className="text-garrison-green hover:underline">
                  Register here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientSignIn;
