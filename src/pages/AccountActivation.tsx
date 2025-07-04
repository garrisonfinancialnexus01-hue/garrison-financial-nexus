
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Key, AlertCircle } from 'lucide-react';
import { verifyCode } from '@/utils/verificationCodes';
import { supabase } from '@/integrations/supabase/client';

const AccountActivation = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get account number from navigation state if available
  const stateAccountNumber = location.state?.accountNumber;

  React.useEffect(() => {
    if (stateAccountNumber) {
      setAccountNumber(stateAccountNumber);
    }
  }, [stateAccountNumber]);

  const handleActivation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!accountNumber.trim() || !verificationCode.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter both account number and verification code.",
        variant: "destructive",
      });
      return;
    }

    if (verificationCode.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Verification code must be 6 digits.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Verify the code
      if (!verifyCode(verificationCode)) {
        toast({
          title: "Invalid Verification Code",
          description: "The verification code you entered is incorrect. Please check with the manager.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Check if account exists and is pending
      const { data: account, error: fetchError } = await supabase
        .from('client_accounts')
        .select('*')
        .eq('account_number', accountNumber.trim())
        .maybeSingle();

      if (fetchError) {
        console.error('Database error:', fetchError);
        toast({
          title: "Error",
          description: "Database connection failed. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (!account) {
        toast({
          title: "Account Not Found",
          description: "No account found with this account number.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (account.status === 'active') {
        toast({
          title: "Account Already Active",
          description: "This account is already activated. You can sign in now.",
        });
        navigate('/client-auth');
        setIsLoading(false);
        return;
      }

      if (account.status === 'suspended') {
        toast({
          title: "Account Suspended",
          description: "This account is suspended. Please contact the manager.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Activate the account
      const { error: updateError } = await supabase
        .from('client_accounts')
        .update({ status: 'active' })
        .eq('account_number', accountNumber.trim());

      if (updateError) {
        console.error('Update error:', updateError);
        toast({
          title: "Activation Failed",
          description: "Failed to activate account. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      toast({
        title: "Account Activated!",
        description: "Your account has been successfully activated. You can now sign in.",
      });

      navigate('/client-auth', { 
        state: { 
          message: 'Account activated successfully! You can now sign in.' 
        } 
      });

    } catch (error) {
      console.error('Activation error:', error);
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <div className="flex items-center mb-4">
              <Link to="/signup-success" className="flex items-center text-garrison-green hover:text-garrison-black">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
            </div>
            <div className="flex items-center justify-center mb-4">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Key className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Activate Your Account</CardTitle>
            <CardDescription className="text-center">
              Enter the verification code provided by the manager to activate your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleActivation} className="space-y-4">
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
                <Label htmlFor="verification-code">Verification Code</Label>
                <Input
                  id="verification-code"
                  type="text"
                  placeholder="Enter 6-digit verification code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                  maxLength={6}
                  className="text-center text-lg font-mono tracking-widest"
                  required
                />
                <p className="text-xs text-gray-500">
                  Enter the 6-digit code provided by the manager
                </p>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Activating Account...' : 'Activate Account'}
              </Button>
            </form>
            
            <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium mb-1">Need a Verification Code?</p>
                  <p>Contact the manager via WhatsApp or phone to get your verification code. Make sure to provide your account number.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Already activated?{' '}
                <Link to="/client-auth" className="text-garrison-green hover:underline">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AccountActivation;
