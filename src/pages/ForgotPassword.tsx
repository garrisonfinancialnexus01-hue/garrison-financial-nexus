
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

  const generateVerificationCode = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailAddress = email.trim().toLowerCase();
    
    if (!emailAddress) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    if (!validateEmail(emailAddress)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log('=== FRONTEND: Starting email OTP password reset process ===');
      console.log('Email input:', emailAddress);
      
      // Check if account exists with this email
      console.log('Checking if account exists...');
      const { data: account, error: fetchError } = await supabase
        .from('client_accounts')
        .select('email, name')
        .eq('email', emailAddress)
        .maybeSingle();

      console.log('Account lookup result:', { account, error: fetchError });

      if (fetchError) {
        console.error('Database error when checking account:', fetchError);
        toast({
          title: "System Error",
          description: "Unable to verify email address. Please try again later.",
          variant: "destructive",
        });
        return;
      }

      if (!account) {
        console.log('No account found for email:', emailAddress);
        toast({
          title: "Email Not Found",
          description: "No account found with this email address. Please check your email or sign up for a new account.",
          variant: "destructive",
        });
        return;
      }

      console.log('Account found for email:', account.name);

      // Generate and store verification code
      const verificationCode = generateVerificationCode();
      console.log('Generated verification code:', verificationCode);
      
      // Store the verification code locally for validation
      storeVerificationCode(emailAddress, verificationCode);

      // Send email via Supabase edge function
      const { error: emailError } = await supabase.functions.invoke('send-password-reset-code', {
        body: {
          email: emailAddress,
          name: account.name,
          code: verificationCode
        }
      });

      if (emailError) {
        console.error('Error sending email:', emailError);
        toast({
          title: "Email Send Failed",
          description: "Failed to send verification code. Please try again.",
          variant: "destructive",
        });
        return;
      }

      console.log('SUCCESS: Verification code sent to email');
      
      toast({
        title: "Verification Code Sent! ✅",
        description: `A 6-digit verification code has been sent to ${emailAddress}`,
      });

      // Navigate to verification page
      navigate('/verify-reset-code', { 
        state: { 
          email: emailAddress,
          timestamp: Date.now()
        } 
      });

    } catch (error) {
      console.error('=== UNEXPECTED ERROR IN EMAIL OTP RESET ===');
      console.error('Error type:', typeof error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      toast({
        title: "System Error",
        description: `An unexpected error occurred: ${error.message}`,
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
              <Link to="/client-auth" className="flex items-center text-garrison-green hover:text-garrison-black">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Sign In
              </Link>
            </div>
            <CardTitle className="text-2xl text-center">Reset Your Password</CardTitle>
            <CardDescription className="text-center">
              Enter your email address to receive a verification code
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                    disabled={isLoading}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Enter the email address associated with your account
                </p>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
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
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-2">What happens next?</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>We'll send a 6-digit verification code to your email</li>
                    <li>The code will arrive in your inbox within seconds</li>
                    <li>You'll have exactly 3 minutes to enter the code before it expires</li>
                    <li>After verification, you can create a new secure password</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium mb-1">Password Requirements:</p>
                  <p>Your new password must be 6-10 characters with at least one uppercase letter, number, and special character.</p>
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
