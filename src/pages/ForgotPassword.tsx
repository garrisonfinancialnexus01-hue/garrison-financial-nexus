
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Mail, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const getErrorMessage = (errorCode: string, defaultMessage: string): { title: string; description: string; variant: "destructive" | "default" } => {
    switch (errorCode) {
      case 'MISSING_API_KEY':
        return {
          title: "Service Configuration Error",
          description: "Email service is not properly configured. Please contact support at +256 761 281 222.",
          variant: "destructive"
        };
      case 'DOMAIN_NOT_VERIFIED':
        return {
          title: "Email Domain Issue",
          description: "Our email domain needs verification. Please contact support or try again later.",
          variant: "destructive"
        };
      case 'RATE_LIMIT':
        return {
          title: "Too Many Requests",
          description: "Please wait a few minutes before requesting another code.",
          variant: "destructive"
        };
      case 'CONNECTION_ERROR':
        return {
          title: "Connection Problem",
          description: "Unable to connect to email service. Please check your internet connection and try again.",
          variant: "destructive"
        };
      case 'TIMEOUT_ERROR':
        return {
          title: "Request Timeout",
          description: "The request took too long. Please try again.",
          variant: "destructive"
        };
      default:
        return {
          title: "Service Error",
          description: defaultMessage,
          variant: "destructive"
        };
    }
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedEmail = email.trim().toLowerCase();
    
    // Enhanced validation
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
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log('Starting password reset process for email:', trimmedEmail);
      
      // Check if account exists
      const { data: account, error: fetchError } = await supabase
        .from('client_accounts')
        .select('email, name')
        .eq('email', trimmedEmail)
        .maybeSingle();

      if (fetchError) {
        console.error('Database error when checking account:', fetchError);
        toast({
          title: "System Error",
          description: "Unable to verify email address. Please try again later.",
          variant: "destructive",
        });
        return;
      }

      if (!account) {
        console.log('No account found for email:', trimmedEmail);
        toast({
          title: "Email Not Found",
          description: "No account found with this email address. Please check your email or sign up for a new account.",
          variant: "destructive",
        });
        return;
      }

      console.log('Account found, sending reset code for:', account.name);

      // Send password reset code with comprehensive error handling
      const { data, error: functionError } = await supabase.functions.invoke('send-password-reset-code', {
        body: {
          email: trimmedEmail,
          name: account.name || 'User'
        }
      });

      console.log('Edge function response:', { data, error: functionError });

      // Handle function invocation errors
      if (functionError) {
        console.error('Edge function invocation error:', functionError);
        
        const errorMessage = getErrorMessage('NETWORK_ERROR', "Email service is temporarily unavailable. Please try again in a few minutes.");
        toast({
          title: errorMessage.title,
          description: errorMessage.description,
          variant: errorMessage.variant,
        });
        return;
      }

      // Handle function response errors
      if (!data || data.error || !data.success) {
        console.error('Edge function returned error:', data);
        
        const errorCode = data?.errorCode || 'UNKNOWN_ERROR';
        const defaultMessage = data?.message || "Failed to send verification code. Please try again.";
        const errorMessage = getErrorMessage(errorCode, defaultMessage);
        
        toast({
          title: errorMessage.title,
          description: errorMessage.description,
          variant: errorMessage.variant,
        });

        // For configuration errors, show additional help
        if (errorCode === 'MISSING_API_KEY' || errorCode === 'DOMAIN_NOT_VERIFIED') {
          setTimeout(() => {
            toast({
              title: "Need Immediate Help?",
              description: "Contact us via WhatsApp: +256 761 281 222 or Phone: +256 761 281 222",
            });
          }, 3000);
        }
        
        return;
      }

      console.log('Password reset email sent successfully:', data);
      
      toast({
        title: "Code Sent Successfully! ✅",
        description: "A 6-digit verification code has been sent to your email. Please check your inbox and spam folder.",
      });

      // Navigate to code verification page
      navigate('/verify-reset-code', { 
        state: { 
          email: trimmedEmail,
          timestamp: Date.now()
        } 
      });

    } catch (error) {
      console.error('Unexpected error in password reset:', error);
      toast({
        title: "System Error",
        description: "An unexpected error occurred. Please try again or contact support at +256 761 281 222.",
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
            <CardTitle className="text-2xl text-center">Forgot Password</CardTitle>
            <CardDescription className="text-center">
              Enter your email address to receive a password reset code
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
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending Code...
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
                    <li>We'll send a 6-digit code to your email instantly</li>
                    <li>Check your inbox and spam folder</li>
                    <li>The code expires in 2 minutes for security</li>
                    <li>Enter the code to create a new secure password</li>
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

            {/* Troubleshooting Section */}
            <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-red-800">
                  <p className="font-medium mb-2">Having Issues?</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Check your internet connection</li>
                    <li>Try refreshing the page and attempting again</li>
                    <li>Contact support if the problem persists</li>
                  </ul>
                  <div className="mt-2 p-2 bg-white rounded border">
                    <p className="font-medium text-xs">Support Contact:</p>
                    <p className="text-xs">📱 WhatsApp: +256 761 281 222</p>
                    <p className="text-xs">📞 Phone: +256 761 281 222</p>
                  </div>
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
