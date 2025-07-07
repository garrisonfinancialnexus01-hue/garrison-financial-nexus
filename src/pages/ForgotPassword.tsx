
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Mail, AlertCircle, CheckCircle, Send } from 'lucide-react';
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

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedEmail = email.trim().toLowerCase();
    
    if (!trimmedEmail) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      toast({
        title: "Invalid Email Format",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log('Starting password reset process for:', trimmedEmail);
      
      // Check if account exists
      const { data: account, error: fetchError } = await supabase
        .from('client_accounts')
        .select('email, name')
        .eq('email', trimmedEmail)
        .maybeSingle();

      if (fetchError) {
        console.error('Database error:', fetchError);
        toast({
          title: "System Error",
          description: "Unable to process request. Please try again later.",
          variant: "destructive",
        });
        return;
      }

      if (!account) {
        console.log('No account found for email:', trimmedEmail);
        toast({
          title: "Email Not Found",
          description: "No account found with this email address. Please check your email or create a new account.",
          variant: "destructive",
        });
        return;
      }

      console.log('Account found, sending password reset code...');

      // Send password reset code
      const { data, error } = await supabase.functions.invoke('send-password-reset-code', {
        body: {
          email: trimmedEmail,
          name: account.name || 'User'
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        toast({
          title: "Service Error",
          description: "Failed to send verification code. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (!data?.success) {
        console.error('Edge function returned failure:', data);
        toast({
          title: "Send Failed",
          description: data?.message || "Unable to send verification code.",
          variant: "destructive",
        });
        return;
      }

      // Store the verification code locally
      if (data.code) {
        console.log('Storing verification code locally');
        storeVerificationCode(trimmedEmail, data.code);
      }

      console.log('Password reset email sent successfully');
      
      toast({
        title: "Code Sent Successfully! ✅",
        description: "A 6-digit verification code has been sent to your email.",
      });

      // Navigate to verification page
      navigate('/verify-reset-code', { 
        state: { 
          email: trimmedEmail,
          timestamp: Date.now()
        } 
      });

    } catch (error: any) {
      console.error('Unexpected error:', error);
      toast({
        title: "System Error",
        description: error.message || "An unexpected error occurred. Please try again.",
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
              <Link to="/client-auth" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Sign In
              </Link>
            </div>
            <CardTitle className="text-2xl text-center">Reset Your Password</CardTitle>
            <CardDescription className="text-center">
              Enter your email address to receive a secure verification code
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSendCode} className="space-y-4">
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
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading || !email.trim()}>
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending Code...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Verification Code
                  </>
                )}
              </Button>
            </form>
            
            {/* Process Information */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-2">What happens next?</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>We'll send a 6-digit code to your email instantly</li>
                    <li>Check your inbox and spam folder for the code</li>
                    <li>You'll have exactly 3 minutes to enter the code</li>
                    <li>After verification, you can set a new password</li>
                    <li>Your account will be immediately accessible</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Security Information */}
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
