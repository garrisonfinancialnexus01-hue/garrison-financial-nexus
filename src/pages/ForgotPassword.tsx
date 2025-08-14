
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Mail, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const navigate = useNavigate();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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
      console.log('Starting secure OTP system for:', emailAddress);
      
      // Check if account exists with this email first
      const { data: account, error: fetchError } = await supabase
        .from('client_accounts')
        .select('email, name')
        .eq('email', emailAddress)
        .maybeSingle();

      console.log('Account lookup result:', { found: !!account, error: fetchError });

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

      console.log('Account found, sending secure OTP via edge function');

      // Send OTP via secure edge function with retry logic
      let emailSent = false;
      let lastError = null;
      
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          console.log(`Secure OTP send attempt ${attempt} of 3`);
          
          const { data, error: emailError } = await supabase.functions.invoke('send-password-reset-code', {
            body: {
              email: emailAddress,
              name: account.name || 'User',
              userIp: 'web-client' // Could be enhanced to get actual IP
            }
          });

          if (emailError) {
            console.error(`Attempt ${attempt} failed:`, emailError);
            lastError = emailError;
            if (attempt < 3) {
              await new Promise(resolve => setTimeout(resolve, 2000));
              continue;
            }
          } else if (data?.success) {
            console.log(`Secure OTP sent successfully on attempt ${attempt}`);
            console.log('OTP details:', {
              expiresAt: data.expiresAt,
              attemptsAllowed: data.attemptsAllowed
            });
            emailSent = true;
            break;
          } else {
            console.error(`Attempt ${attempt} failed:`, data?.message || 'Unknown error');
            lastError = new Error(data?.message || 'Unknown error');
            
            // Handle rate limiting specifically
            if (data?.error === 'Rate limited') {
              toast({
                title: "Too Many Requests",
                description: data.message || "You've reached the maximum number of OTP requests per hour. Please try again later.",
                variant: "destructive",
              });
              return;
            }
            
            if (attempt < 3) {
              await new Promise(resolve => setTimeout(resolve, 2000));
              continue;
            }
          }
        } catch (networkError) {
          console.error(`Network error on attempt ${attempt}:`, networkError);
          lastError = networkError;
          if (attempt < 3) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            continue;
          }
        }
      }

      if (!emailSent) {
        console.error('All secure OTP send attempts failed:', lastError);
        setRetryCount(prev => prev + 1);
        
        toast({
          title: "OTP Send Failed",
          description: `Failed to send verification code after 3 attempts. ${retryCount < 2 ? 'Please try again.' : 'Please check your internet connection and try again later.'}`,
          variant: "destructive",
        });
        return;
      }

      console.log('Secure OTP sent successfully');
      setRetryCount(0);
      
      toast({
        title: "Verification Code Sent! ✅",
        description: `A 6-digit verification code has been sent to ${emailAddress}. You have exactly 3 minutes and 3 attempts to enter it correctly.`,
      });

      // Navigate to verification page
      navigate('/verify-reset-code', { 
        state: { 
          email: emailAddress,
          timestamp: Date.now(),
          secureOtpSystem: true
        } 
      });

    } catch (error: any) {
      console.error('Unexpected error in secure OTP system:', error);
      
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
              Enter your email address to receive a secure 6-digit verification code
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
                  Enter the email address associated with your Garrison Financial Nexus account
                </p>
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending Secure Code...
                  </>
                ) : (
                  <>
                    {retryCount > 0 && <RefreshCw className="h-4 w-4 mr-2" />}
                    {retryCount > 0 ? 'Retry Sending Code' : 'Send Verification Code'}
                  </>
                )}
              </Button>
              
              {retryCount > 0 && (
                <p className="text-xs text-center text-amber-600">
                  Attempt {retryCount + 1} - If this continues to fail, please check your internet connection
                </p>
              )}
            </form>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-2">🔒 Enhanced Security System:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>6-digit verification code sent to your email</li>
                    <li>Code expires in exactly 3 minutes</li>
                    <li>Maximum 3 attempts to enter the correct code</li>
                    <li>Rate limited to 3 requests per hour for security</li>
                    <li>Check both inbox and spam/junk folder</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium mb-1">Email not arriving?</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Check your spam/junk folder</li>
                    <li>Ensure your email address is correct</li>
                    <li>Wait a few minutes before retrying</li>
                    <li>Maximum 3 OTP requests per hour</li>
                    <li>Contact support if the problem persists</li>
                  </ul>
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
