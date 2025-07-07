
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Timer, RefreshCw, AlertTriangle } from 'lucide-react';
import { verifyPasswordResetCode, storeVerificationCode, getRemainingTime } from '@/utils/passwordResetCodes';
import { supabase } from '@/integrations/supabase/client';

const VerifyResetCode = () => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  // Redirect if no email provided
  useEffect(() => {
    if (!email) {
      toast({
        title: "Access Denied",
        description: "Please start the password reset process from the beginning.",
        variant: "destructive",
      });
      navigate('/forgot-password');
      return;
    }
    
    // Initialize timer with remaining time
    const remaining = getRemainingTime(email);
    setTimeLeft(remaining > 0 ? remaining : 180);
  }, [email, navigate]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
      if (!canResend) { // Only show toast once
        toast({
          title: "Code Expired ⏰",
          description: "The verification code has expired. Please request a new one.",
          variant: "destructive",
        });
      }
    }
  }, [timeLeft, canResend]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleVerifyCode = async () => {
    if (code.length !== 6) {
      toast({
        title: "Invalid Code Length",
        description: "Please enter a complete 6-digit verification code.",
        variant: "destructive",
      });
      return;
    }

    if (timeLeft <= 0) {
      toast({
        title: "Code Expired",
        description: "The verification code has expired. Please request a new one.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log('Verifying code:', code, 'for email:', email);
      
      const result = verifyPasswordResetCode(email, code);
      
      if (result.success) {
        console.log('Code verified successfully');
        toast({
          title: "Code Verified! ✅",
          description: "You can now create your new password.",
        });
        navigate('/reset-password', { state: { email, verifiedCode: code } });
      } else {
        console.log('Code verification failed:', result.message);
        toast({
          title: "Verification Failed",
          description: result.message,
          variant: "destructive",
        });
        
        // Clear the code input if verification failed
        setCode('');
      }
    } catch (error) {
      console.error('Code verification error:', error);
      toast({
        title: "Verification Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      setCode('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    
    try {
      console.log('Resending code for email:', email);
      
      // Get account info
      const { data: account, error: fetchError } = await supabase
        .from('client_accounts')
        .select('name')
        .eq('email', email)
        .maybeSingle();

      if (fetchError) {
        throw new Error('Failed to retrieve account information');
      }

      if (!account) {
        throw new Error('Account not found');
      }

      // Send new code
      const { data, error } = await supabase.functions.invoke('send-password-reset-code', {
        body: {
          email: email,
          name: account.name || 'User'
        }
      });

      if (error) {
        throw error;
      }

      if (!data?.success) {
        throw new Error(data?.message || 'Failed to send verification code');
      }

      // Store the new verification code
      if (data.code) {
        storeVerificationCode(email, data.code);
      }

      toast({
        title: "New Code Sent! ✅",
        description: "A new verification code has been sent to your email.",
      });

      // Reset timer and UI state
      setTimeLeft(180);
      setCanResend(false);
      setCode('');
      
    } catch (error: any) {
      console.error('Resend error:', error);
      toast({
        title: "Failed to Resend",
        description: error.message || "Could not send new code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  if (!email) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <div className="flex items-center mb-4">
              <Link to="/forgot-password" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
            </div>
            <CardTitle className="text-2xl text-center">Enter Verification Code</CardTitle>
            <CardDescription className="text-center">
              We've sent a 6-digit code to <strong>{email}</strong> from Garrison Financial Nexus
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Timer Display */}
            <div className={`flex items-center justify-center space-x-2 p-4 rounded-lg border ${
              timeLeft <= 60 ? 'bg-red-50 border-red-200' : 
              timeLeft <= 120 ? 'bg-amber-50 border-amber-200' : 
              'bg-blue-50 border-blue-200'
            }`}>
              <Timer className={`h-5 w-5 ${
                timeLeft <= 60 ? 'text-red-600' : 
                timeLeft <= 120 ? 'text-amber-600' : 
                'text-blue-600'
              }`} />
              <span className={`font-mono text-lg font-bold ${
                timeLeft <= 60 ? 'text-red-600' : 
                timeLeft <= 120 ? 'text-amber-600' : 
                'text-blue-600'
              }`}>
                {formatTime(timeLeft)}
              </span>
              <span className="text-sm text-gray-600">remaining</span>
            </div>

            {/* Code Input */}
            <div className="space-y-4">
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={code}
                  onChange={setCode}
                  disabled={timeLeft <= 0 || isLoading}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <Button 
                onClick={handleVerifyCode} 
                className="w-full" 
                disabled={code.length !== 6 || timeLeft <= 0 || isLoading}
              >
                {isLoading ? 'Verifying...' : 'Verify Code'}
              </Button>
            </div>

            {/* Resend Section */}
            <div className="text-center space-y-3">
              {canResend ? (
                <Button
                  variant="ghost"
                  onClick={handleResendCode}
                  disabled={isResending}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isResending ? 'animate-spin' : ''}`} />
                  {isResending ? 'Sending...' : 'Send New Code'}
                </Button>
              ) : (
                <p className="text-sm text-gray-600">
                  Didn't receive the code? You can request a new one when the timer expires.
                </p>
              )}
            </div>

            {/* Expired Notice */}
            {timeLeft <= 0 && (
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-red-800">
                    <p className="font-medium">Code Expired</p>
                    <p>The 3-minute verification period has ended. Please request a new code to continue.</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerifyResetCode;
