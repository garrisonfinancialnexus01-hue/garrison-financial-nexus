
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Timer, RefreshCw } from 'lucide-react';
import { verifyMobileOtpCode, storeMobileOtpCode, generateOtp } from '@/utils/mobileOtpCodes';

const VerifyMobileOtp = () => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180); // Exactly 3 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const mobile = location.state?.mobile;

  // Redirect if no mobile provided
  useEffect(() => {
    if (!mobile) {
      navigate('/forgot-password');
      return;
    }
  }, [mobile, navigate]);

  // Exact 3-minute countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
      toast({
        title: "OTP Expired ⏰",
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

  const handleVerifyOtp = async () => {
    if (code.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a complete 6-digit OTP code.",
        variant: "destructive",
      });
      return;
    }

    if (timeLeft <= 0) {
      toast({
        title: "OTP Expired",
        description: "The verification code has expired. Please request a new one.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Verify the OTP using our mobile OTP utility
      const isValidOtp = verifyMobileOtpCode(mobile, code);
      
      if (isValidOtp) {
        toast({
          title: "OTP Verified Successfully! ✅",
          description: "You can now create your new password.",
        });
        navigate('/reset-password', { state: { mobile, verifiedOtp: code } });
      } else {
        toast({
          title: "Invalid OTP",
          description: "The verification code is incorrect or has expired. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Verification Error",
        description: "Failed to verify OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    
    try {
      // Generate and store new OTP
      const newOtp = generateOtp();
      storeMobileOtpCode(mobile, newOtp);

      toast({
        title: "New OTP Sent! ✅",
        description: `A new verification code has been sent to ${mobile}.`,
      });

      // Reset timer to exactly 3 minutes
      setTimeLeft(180);
      setCanResend(false);
      setCode('');
    } catch (error) {
      toast({
        title: "Failed to Resend",
        description: "Could not send new OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!mobile) {
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
              We've sent a 6-digit OTP to {mobile}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Exact 3-minute countdown timer */}
            <div className="flex items-center justify-center space-x-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Timer className={`h-5 w-5 ${timeLeft <= 60 ? 'text-red-600' : 'text-blue-600'}`} />
              <span className={`font-mono text-lg font-bold ${timeLeft <= 60 ? 'text-red-600' : timeLeft <= 120 ? 'text-amber-600' : 'text-blue-600'}`}>
                {formatTime(timeLeft)}
              </span>
              <span className="text-sm text-gray-600">remaining</span>
            </div>

            {/* 6-digit OTP Input */}
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
                onClick={handleVerifyOtp} 
                className="w-full" 
                disabled={code.length !== 6 || timeLeft <= 0 || isLoading}
              >
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </Button>
            </div>

            {/* Resend Section */}
            <div className="text-center space-y-2">
              {canResend ? (
                <Button
                  variant="ghost"
                  onClick={handleResendOtp}
                  disabled={isLoading}
                  className="text-garrison-green hover:text-garrison-black"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Send New OTP
                </Button>
              ) : (
                <p className="text-sm text-gray-600">
                  Didn't receive the OTP? You can request a new one when the timer expires.
                </p>
              )}
            </div>

            {timeLeft <= 0 && (
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <p className="text-sm text-red-800 text-center">
                  <strong>OTP Expired:</strong> The 3-minute verification period has ended. Please request a new OTP to continue.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerifyMobileOtp;
