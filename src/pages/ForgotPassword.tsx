
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { storeVerificationCode } from '@/utils/passwordResetCodes';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedEmail = email.trim().toLowerCase();
    
    if (!trimmedEmail) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log('Starting password reset for:', trimmedEmail);
      
      // Check if account exists
      const { data: account, error: fetchError } = await supabase
        .from('client_accounts')
        .select('email, name')
        .eq('email', trimmedEmail)
        .maybeSingle();

      if (fetchError) {
        console.error('Database error:', fetchError);
        toast({
          title: "System Error",
          description: "Unable to verify email address. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (!account) {
        toast({
          title: "Email Not Found",
          description: "No account found with this email address. Please check your email or create a new account.",
          variant: "destructive",
        });
        return;
      }

      console.log('Account found, sending reset code...');

      // Send password reset code
      const { data, error } = await supabase.functions.invoke('send-password-reset-code', {
        body: {
          email: trimmedEmail,
          name: account.name || 'Valued Client'
        }
      });

      if (error) {
        console.error('Function invocation error:', error);
        toast({
          title: "Service Error",
          description: "Failed to send verification code. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (!data?.success) {
        console.error('Function returned failure:', data);
        toast({
          title: "Failed to Send Code",
          description: data?.error || "Unable to send verification code.",
          variant: "destructive",
        });
        return;
      }

      // Store the verification code locally
      if (data.code) {
        storeVerificationCode(trimmedEmail, data.code);
      }

      console.log('Password reset code sent successfully');
      
      toast({
        title: "Code Sent Successfully! ✅",
        description: "A 6-digit verification code has been sent to your email from Garrison Financial Nexus.",
      });

      // Navigate to verification page
      navigate('/verify-reset-code', { 
        state: { 
          email: trimmedEmail,
          timestamp: Date.now()
        } 
      });

    } catch (error: any) {
      console.error('Unexpected error:', error);
      toast({
        title: "System Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-6">
            <div className="flex items-center mb-4">
              <Link to="/client-auth" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Sign In
              </Link>
            </div>
            <div className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900">Reset Your Password</CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                Enter your email address to receive a verification code
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSendCode} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending Code...
                  </>
                ) : (
                  'Send Verification Code'
                )}
              </Button>
            </form>
            
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-green-800">
                  <p className="font-medium mb-2">What happens next?</p>
                  <ul className="space-y-1">
                    <li>• We'll send a 6-digit code to your email from Garrison Financial Nexus</li>
                    <li>• Check your inbox and spam folder</li>
                    <li>• You have exactly 3 minutes to enter the code</li>
                    <li>• After verification, create a new secure password</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium mb-1">Password Requirements:</p>
                  <p>6-10 characters with uppercase letter, number, and special character.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
