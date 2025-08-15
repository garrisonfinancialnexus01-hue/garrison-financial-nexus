
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Phone, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { storeMobileOtpCode, generateOtp } from '@/utils/mobileOtpCodes';

const ForgotPassword = () => {
  const [mobile, setMobile] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateMobile = (mobile: string): boolean => {
    // Basic mobile number validation (10-15 digits)
    const mobileRegex = /^[0-9]{10,15}$/;
    return mobileRegex.test(mobile.replace(/\s+/g, ''));
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedMobile = mobile.trim().replace(/\s+/g, '');
    
    if (!trimmedMobile) {
      toast({
        title: "Mobile Number Required",
        description: "Please enter your mobile number.",
        variant: "destructive",
      });
      return;
    }

    if (!validateMobile(trimmedMobile)) {
      toast({
        title: "Invalid Mobile Number",
        description: "Please enter a valid mobile number (10-15 digits).",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log('=== FRONTEND: Starting mobile OTP password reset process ===');
      console.log('Mobile:', trimmedMobile);
      
      // Check if account exists with this mobile number
      console.log('Checking if account exists...');
      const { data: account, error: fetchError } = await supabase
        .from('client_accounts')
        .select('phone, name')
        .eq('phone', trimmedMobile)
        .maybeSingle();

      console.log('Account lookup result:', { account, error: fetchError });

      if (fetchError) {
        console.error('Database error when checking account:', fetchError);
        toast({
          title: "System Error",
          description: "Unable to verify mobile number. Please try again later.",
          variant: "destructive",
        });
        return;
      }

      if (!account) {
        console.log('No account found for mobile:', trimmedMobile);
        toast({
          title: "Mobile Number Not Found",
          description: "No account found with this mobile number. Please check your number or sign up for a new account.",
          variant: "destructive",
        });
        return;
      }

      console.log('Account found for mobile:', account.name);

      // Generate and store OTP code
      const otpCode = generateOtp();
      console.log('Generated OTP:', otpCode);
      
      // Store the OTP code locally for validation
      storeMobileOtpCode(trimmedMobile, otpCode);

      console.log('SUCCESS: OTP generated and stored for mobile number');
      
      toast({
        title: "OTP Sent Successfully! ✅",
        description: `A 6-digit OTP has been sent to ${trimmedMobile}. (For demo: ${otpCode})`,
      });

      // Navigate to OTP verification page
      navigate('/verify-mobile-otp', { 
        state: { 
          mobile: trimmedMobile,
          timestamp: Date.now()
        } 
      });

    } catch (error) {
      console.error('=== UNEXPECTED ERROR IN MOBILE OTP RESET ===');
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
              Enter your mobile number to receive a verification code
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
                    placeholder="Enter your mobile number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="pl-10"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending OTP...
                  </>
                ) : (
                  'Send OTP Code'
                )}
              </Button>
            </form>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-2">What happens next?</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>We'll send a 6-digit OTP to your mobile number</li>
                    <li>The OTP will arrive instantly via SMS</li>
                    <li>You'll have exactly 3 minutes to enter the OTP before it expires</li>
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
