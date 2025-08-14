
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Phone, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const ForgotPassword = () => {
  const [mobile, setMobile] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const normalizePhoneNumber = (phone: string): string => {
    // Remove all spaces, hyphens, and special characters except +
    const cleaned = phone.replace(/\s+/g, '').replace(/[^\d+]/g, '');
    
    // If it starts with 0, convert to +256 format
    if (cleaned.startsWith('0') && cleaned.length >= 10) {
      return '+256' + cleaned.substring(1);
    }
    
    // If it starts with 256, add + prefix
    if (cleaned.startsWith('256') && cleaned.length >= 12) {
      return '+' + cleaned;
    }
    
    // If it already starts with +256, return as is
    if (cleaned.startsWith('+256')) {
      return cleaned;
    }
    
    // If it's just 9 digits (without leading 0), add +256
    if (/^\d{9}$/.test(cleaned)) {
      return '+256' + cleaned;
    }
    
    return cleaned;
  };

  const validateMobile = (mobile: string): boolean => {
    const normalized = normalizePhoneNumber(mobile);
    // Valid format: +256XXXXXXXXX (13 characters total)
    return /^\+256[0-9]{9}$/.test(normalized);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const normalizedMobile = normalizePhoneNumber(mobile.trim());
    
    if (!normalizedMobile) {
      toast({
        title: "Mobile Number Required",
        description: "Please enter your mobile number.",
        variant: "destructive",
      });
      return;
    }

    if (!validateMobile(normalizedMobile)) {
      toast({
        title: "Invalid Mobile Number",
        description: "Please enter a valid Ugandan mobile number (e.g., 0701234567 or +256701234567).",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log('=== MOBILE PASSWORD RESET: Starting process ===');
      console.log('Original mobile input:', mobile);
      console.log('Normalized mobile:', normalizedMobile);
      
      // Check if account exists with this mobile number
      // Try multiple phone number formats to ensure we find the account
      const phoneFormats = [
        normalizedMobile,
        normalizedMobile.replace('+256', '0'), // Convert +256701234567 to 0701234567
        normalizedMobile.replace('+', ''), // Convert +256701234567 to 256701234567
      ];

      console.log('Searching for account with phone formats:', phoneFormats);

      const { data: accounts, error: fetchError } = await supabase
        .from('client_accounts')
        .select('phone, name, email')
        .in('phone', phoneFormats);

      console.log('Account lookup result:', { accounts, error: fetchError });

      if (fetchError) {
        console.error('Database error when checking account:', fetchError);
        toast({
          title: "System Error",
          description: "Unable to verify mobile number. Please try again later.",
          variant: "destructive",
        });
        return;
      }

      if (!accounts || accounts.length === 0) {
        console.log('No account found for any mobile format:', phoneFormats);
        toast({
          title: "Mobile Number Not Found",
          description: "No account found with this mobile number. Please check your number or sign up for a new account.",
          variant: "destructive",
        });
        return;
      }

      const account = accounts[0]; // Take the first matching account
      console.log('Account found:', account.name, 'with phone:', account.phone);

      if (!account.email) {
        toast({
          title: "Email Not Found",
          description: "Your account doesn't have an email address associated. Please contact support.",
          variant: "destructive",
        });
        return;
      }

      // Generate OTP using the database function
      console.log('Calling database function to generate OTP...');
      const { data: otpResult, error: otpError } = await supabase.rpc('generate_password_reset_otp', {
        user_email: account.email,
        client_ip: null
      });

      console.log('OTP generation result:', { otpResult, error: otpError });

      if (otpError) {
        console.error('OTP generation error:', otpError);
        toast({
          title: "System Error",
          description: "Failed to generate verification code. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (!otpResult || otpResult.length === 0 || !otpResult[0].success) {
        const errorMessage = otpResult?.[0]?.message || 'Unknown error occurred';
        console.error('OTP generation failed:', errorMessage);
        toast({
          title: "Request Failed",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      const otpData = otpResult[0];
      console.log('OTP generated successfully, calling email service...');

      // Send OTP via email
      const { data: emailResult, error: emailError } = await supabase.functions.invoke('send-password-reset-code', {
        body: {
          email: account.email,
          name: account.name,
          code: otpData.otp_code
        }
      });

      console.log('Email service result:', { emailResult, error: emailError });

      if (emailError) {
        console.error('Email service error:', emailError);
        toast({
          title: "Email Send Failed",
          description: "Failed to send verification code to your email. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (!emailResult?.success) {
        console.error('Email send failed:', emailResult);
        toast({
          title: "Email Send Failed",
          description: emailResult?.message || "Failed to send verification code. Please try again.",
          variant: "destructive",
        });
        return;
      }

      console.log('SUCCESS: Password reset OTP sent via email');
      
      toast({
        title: "Verification Code Sent! ✅",
        description: `A 6-digit verification code has been sent to ${account.email}`,
      });

      // Navigate to OTP verification page
      navigate('/verify-reset-code', { 
        state: { 
          email: account.email,
          mobile: normalizedMobile,
          name: account.name,
          timestamp: Date.now()
        } 
      });

    } catch (error) {
      console.error('=== UNEXPECTED ERROR IN MOBILE PASSWORD RESET ===');
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
              Enter your mobile number to receive a verification code via email
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="mobile"
                    type="tel"
                    placeholder="Enter mobile number (e.g., 0701234567)"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="pl-10"
                    required
                    disabled={isLoading}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Accepts: 0701234567, +256701234567, or 256701234567
                </p>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending Verification Code...
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
                    <li>We'll look up your account using your mobile number</li>
                    <li>A 6-digit verification code will be sent to your registered email</li>
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
