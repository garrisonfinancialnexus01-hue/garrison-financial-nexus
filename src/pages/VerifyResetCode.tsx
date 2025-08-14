
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Timer, RefreshCw, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const VerifyResetCode = () => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes
  const [canResend, setCanResend] = useState(false);
  const [attemptsRemaining, setAttemptsRemaining] = useState(3);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const secureOtpSystem = location.state?.secureOtpSystem;

  // Redirect if no email provided
  useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
      return;
    }
  }, [email, navigate]);

  // 3-minute countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
      toast({
        title: "Code Expired ⏰",
        description: "The verification code has expired after 3 minutes. Please request a new one.",
        variant: "destructive",
      });
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleVerifyCode = async () => {
    if (code.length !== 6) {
      toast({
        title: "Invalid Code",
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
      console.log('Verifying secure OTP:', code, 'for email:', email);
      
      // Use the secure database function to verify OTP
      const { data: verificationResult, error: verifyError } = await supabase
        .rpc('verify_password_reset_otp', {
          user_email: email,
          submitted_otp: code
        });

      if (verifyError) {
        console.error('OTP verification error:', verifyError);
        toast({
          title: "Verification Error",
          description: "Failed to verify code. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (!verificationResult || verificationResult.length === 0) {
        console.error('No verification result returned');
        toast({
          title: "Verification Error",
          description: "Unable to verify code. Please try again.",
          variant: "destructive",
        });
        return;
      }

      const { valid, message, attempts_remaining } = verificationResult[0];

      if (valid) {
        console.log('Secure OTP verified successfully');
        toast({
          title: "Code Verified Successfully! ✅",
          description: "You can now create your new password.",
        });
        navigate('/reset-password', { 
          state: { 
            email, 
            verifiedCode: code,
            secureOtpVerified: true 
          } 
        });
      } else {
        console.log('OTP verification failed:', message);
        setAttemptsRemaining(attempts_remaining);
        
        if (attempts_remaining <= 0) {
          toast({
            title: "Maximum Attempts Exceeded",
            description: "You've used all 3 attempts. Please request a new verification code.",
            variant: "destructive",
          });
          setCanResend(true);
        } else {
          toast({
            title: "Invalid Code",
            description: `${message} ${attempts_remaining} attempt${attempts_remaining !== 1 ? 's' : ''} remaining.`,
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error('Code verification error:', error);
      toast({
        title: "Verification Error",
        description: "Failed to verify code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    
    try {
      console.log('Resending secure OTP for email:', email);
      
      // Get account info
      const { data: account } = await supabase
        .from('client_accounts')
        .select('name')
        .eq('email', email)
        .maybeSingle();

      // Send new OTP via secure system
      const { data, error } = await supabase.functions.invoke('send-password-reset-code', {
        body: {
          email: email,
          name: account?.name || 'User',
          userIp: 'web-client-resend'
        }
      });

      if (error || !data?.success) {
        if (data?.error === 'Rate limited') {
          toast({
            title: "Rate Limit Exceeded",
            description: data.message || "You've reached the maximum number of OTP requests per hour. Please try again later.",
            variant: "destructive",
          });
          return;
        }
        throw error || new Error('Failed to send code');
      }

      toast({
        title: "New Code Sent! ✅",
        description: "A new 6-digit verification code has been sent to your email. You have 3 minutes and 3 attempts.",
      });

      // Reset timer and attempts
      setTimeLeft(180);
      setCanResend(false);
      setCode('');
      setAttemptsRemaining(3);
    } catch (error) {
      console.error('Resend error:', error);
      toast({
        title: "Failed to Resend",
        description: "Could not send new code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
              <Link to="/forgot-password" className="flex items-center text-garrison-green hover:text-garrison-black">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
            </div>
            <CardTitle className="text-2xl text-center">Enter Verification Code</CardTitle>
            <CardDescription className="text-center">
              We've sent a secure 6-digit code to {email}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Security indicator */}
            <div className="flex items-center justify-center space-x-2 p-3 bg-green-50 rounded-lg border border-green-200">
              <Shield className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-800">Secure OTP System Active</span>
            </div>

            {/* Timer with enhanced styling */}
            <div className="flex items-center justify-center space-x-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Timer className={`h-5 w-5 ${timeLeft <= 60 ? 'text-red-600' : 'text-blue-600'}`} />
              <span className={`font-mono text-lg font-bold ${timeLeft <= 60 ? 'text-red-600' : timeLeft <= 120 ? 'text-amber-600' : 'text-blue-600'}`}>
                {formatTime(timeLeft)}
              </span>
              <span className="text-sm text-gray-600">remaining</span>
            </div>

            {/* Attempts remaining indicator */}
            {attemptsRemaining < 3 && (
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-sm text-amber-800 text-center">
                  <strong>{attemptsRemaining} attempt{attemptsRemaining !== 1 ? 's' : ''} remaining</strong>
                </p>
              </div>
            )}

            {/* 6-digit OTP Input */}
            <div className="space-y-4">
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={code}
                  onChange={setCode}
                  disabled={timeLeft <= 0 || isLoading || attemptsRemaining <= 0}
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
                disabled={code.length !== 6 || timeLeft <= 0 || isLoading || attemptsRemaining <= 0}
              >
                {isLoading ? 'Verifying...' : 'Verify Code'}
              </Button>
            </div>

            {/* Resend Section */}
            <div className="text-center space-y-2">
              {canResend || attemptsRemaining <= 0 ? (
                <Button
                  variant="ghost"
                  onClick={handleResendCode}
                  disabled={isLoading}
                  className="text-garrison-green hover:text-garrison-black"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Send New Code
                </Button>
              ) : (
                <p className="text-sm text-gray-600">
                  Didn't receive the code? You can request a new one when the timer expires.
                </p>
              )}
            </div>

            {/* Expired state */}
            {timeLeft <= 0 && (
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <p className="text-sm text-red-800 text-center">
                  <strong>Code Expired:</strong> The 3-minute verification period has ended. Please request a new code to continue.
                </p>
              </div>
            )}

            {/* Security information */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-700">
                <p className="font-medium mb-2">🔒 Security Features:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>6-digit code stored securely in database</li>
                  <li>Automatic expiry after 3 minutes</li>
                  <li>Maximum 3 verification attempts</li>
                  <li>Rate limited to prevent abuse</li>
                  <li>Code is invalidated after successful use</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerifyResetCode;
