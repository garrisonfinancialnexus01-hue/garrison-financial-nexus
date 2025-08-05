
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

  const normalizePhoneNumber = (phone: string): string => {
    // Remove all spaces and special characters except +
    const cleaned = phone.replace(/\s+/g, '').replace(/[^\d+]/g, '');
    
    // If it starts with 0, convert to +256 format
    if (cleaned.startsWith('0') && cleaned.length === 10) {
      return '+256' + cleaned.substring(1);
    }
    
    // If it starts with 256, add + prefix
    if (cleaned.startsWith('256') && cleaned.length === 12) {
      return '+' + cleaned;
    }
    
    // If it already starts with +256, return as is
    if (cleaned.startsWith('+256') && cleaned.length === 13) {
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
      console.log('=== FRONTEND: Starting mobile OTP password reset process ===');
      console.log('Original mobile input:', mobile);
      console.log('Normalized mobile:', normalizedMobile);
      
      // Check if account exists with this mobile number
      console.log('Checking if account exists...');
      const { data: account, error: fetchError } = await supabase
        .from('client_accounts')
        .select('phone, name')
        .eq('phone', normalizedMobile)
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
        console.log('No account found for mobile:', normalizedMobile);
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
      
      // Store the OTP code locally for validation using normalized phone number
      storeMobileOtpCode(normalizedMobile, otpCode);

      console.log('SUCCESS: OTP generated and stored for mobile number');
      
      toast({
        title: "OTP Sent Successfully! ✅",
        description: `A 6-digit OTP has been sent to ${normalizedMobile}. (For demo: ${otpCode})`,
      });

      // Navigate to OTP verification page
      navigate('/verify-mobile-otp', { 
        state: { 
          mobile: normalizedMobile,
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
