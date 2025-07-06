
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Timer, RefreshCw } from 'lucide-react';
import { verifyCode } from '@/utils/verificationCodes';
import { supabase } from '@/integrations/supabase/client';

const VerifyResetCode = () => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  // Redirect if no email provided
  useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
      return;
    }
  }, [email, navigate]);

  // Countdown timer for 3 minutes
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
      toast({
        title: "Code Expired",
        description: "The verification code has expired. Please request a new one.",
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
        description: "Please enter a 6-digit verification code.",
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
      // Verify the code using our verification codes utility
      const isValidCode = verifyCode(code);
      
      if (isValidCode) {
        toast({
          title: "Code Verified Successfully! ✅",
          description: "You can now create your new password.",
        });
        navigate('/reset-password', { state: { email, verifiedCode: code } });
      } else {
        toast({
          title: "Invalid Code",
          description: "The verification code is incorrect. Please try again.",
          variant: "destructive",
        });
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
      // Get account info
      const { data: account } = await supabase
        .from('client_accounts')
        .select('name')
        .eq('email', email)
        .maybeSingle();

      // Send new code
      const { data, error } = await supabase.functions.invoke('send-password-reset-code', {
        body: {
          email: email,
          name: account?.name || 'User'
        }
      });

      if (error || !data?.success) {
        throw error || new Error('Failed to send code');
      }

      toast({
        title: "New Code Sent! ✅",
        description: "A new verification code has been sent to your email from Garrison Financial Nexus.",
      });

      // Reset timer to 3 minutes
      setTimeLeft(180);
      setCanResend(false);
      setCode('');
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
              We've sent a 6-digit code to {email} from Garrison Financial Nexus
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Timer Display - 3 minutes countdown */}
            <div className="flex items-center justify-center space-x-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Timer className={`h-5 w-5 ${timeLeft <= 60 ? 'text-red-600' : 'text-blue-600'}`} />
              <span className={`font-mono text-lg font-bold ${timeLeft <= 60 ? 'text-red-600' : 'text-blue-600'}`}>
                {formatTime(timeLeft)}
              </span>
              <span className="text-sm text-gray-600">remaining</span>
            </div>

            {/* OTP Input */}
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
            <div className="text-center space-y-2">
              {canResend ? (
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

            {timeLeft <= 0 && (
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <p className="text-sm text-red-800 text-center">
                  <strong>Code Expired:</strong> The verification code has expired. Please request a new one to continue.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerifyResetCode;
