
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Timer, RefreshCw, Clock } from 'lucide-react';
import { verifyPasswordResetCode, getTimeRemaining, storeVerificationCode } from '@/utils/passwordResetCodes';
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
    
    // Get actual time remaining from stored code
    const remaining = getTimeRemaining(email);
    if (remaining > 0) {
      setTimeLeft(remaining);
    }
  }, [email, navigate]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        const remaining = getTimeRemaining(email);
        setTimeLeft(remaining);
        
        if (remaining <= 0) {
          setCanResend(true);
          toast({
            title: "Code Expired ⏰",
            description: "The verification code has expired after 3 minutes. Please request a new one.",
            variant: "destructive",
          });
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft, email]);

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
      console.log('Verifying code:', code, 'for email:', email);
      
      const isValidCode = verifyPasswordResetCode(email, code);
      
      if (isValidCode) {
        console.log('Code verified successfully');
        toast({
          title: "Code Verified Successfully! ✅",
          description: "You can now create your new password.",
        });
        navigate('/reset-password', { state: { email, verifiedCode: code } });
      } else {
        console.log('Invalid or expired code');
        toast({
          title: "Invalid Code",
          description: "The verification code is incorrect or has expired. Please try again.",
          variant: "destructive",
        });
        setCode(''); // Clear the input
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
      console.log('Resending code for email:', email);
      
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
          name: account?.name || 'Valued Client'
        }
      });

      if (error || !data?.success) {
        throw error || new Error('Failed to send code');
      }

      // Store the new verification code
      if (data.code) {
        storeVerificationCode(email, data.code);
      }

      toast({
        title: "New Code Sent! ✅",
        description: "A new verification code has been sent to your email from Garrison Financial Nexus.",
      });

      // Reset timer and state
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

  const getTimerColor = () => {
    if (timeLeft <= 30) return 'text-red-600';
    if (timeLeft <= 60) return 'text-orange-600';
    return 'text-blue-600';
  };

  const getTimerBgColor = () => {
    if (timeLeft <= 30) return 'bg-red-50 border-red-200';
    if (timeLeft <= 60) return 'bg-orange-50 border-orange-200';
    return 'bg-blue-50 border-blue-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-6">
            <div className="flex items-center mb-4">
              <Link to="/forgot-password" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
            </div>
            <div className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900">Enter Verification Code</CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                We've sent a 6-digit code to<br />
                <span className="font-medium text-gray-800">{email}</span>
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Timer Display */}
            <div className={`flex items-center justify-center space-x-3 p-4 rounded-lg border ${getTimerBgColor()}`}>
              <Clock className={`h-5 w-5 ${getTimerColor()}`} />
              <span className={`font-mono text-2xl font-bold ${getTimerColor()}`}>
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
                    <InputOTPSlot index={0} className="w-12 h-12 text-lg" />
                    <InputOTPSlot index={1} className="w-12 h-12 text-lg" />
                    <InputOTPSlot index={2} className="w-12 h-12 text-lg" />
                    <InputOTPSlot index={3} className="w-12 h-12 text-lg" />
                    <InputOTPSlot index={4} className="w-12 h-12 text-lg" />
                    <InputOTPSlot index={5} className="w-12 h-12 text-lg" />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <Button 
                onClick={handleVerifyCode} 
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium" 
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
                  disabled={isLoading}
                  className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
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
                  <strong>Code Expired:</strong> The 3-minute verification period has ended. Please request a new code to continue.
                </p>
              </div>
            )}

            {/* Help Info */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-700 space-y-1">
                <p className="font-medium">💡 Having trouble?</p>
                <p>• Check your spam/junk folder</p>
                <p>• The email comes from Garrison Financial Nexus</p>
                <p>• Contact support: +256 761 281 222</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerifyResetCode;
