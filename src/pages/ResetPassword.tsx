
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Eye, EyeOff, Lock, CheckCircle, XCircle, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { email, verifiedCode } = location.state || {};

  // Password validation state
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    number: false,
    special: false
  });

  // Redirect if no email or verified code provided
  useEffect(() => {
    if (!email || !verifiedCode) {
      toast({
        title: "Access Denied",
        description: "Please complete the verification process first.",
        variant: "destructive",
      });
      navigate('/forgot-password');
      return;
    }
  }, [email, verifiedCode, navigate]);

  // Real-time password validation
  useEffect(() => {
    const validation = {
      length: password.length >= 6 && password.length <= 10,
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password)
    };
    setPasswordValidation(validation);
  }, [password]);

  const isPasswordValid = () => {
    return Object.values(passwordValidation).every(Boolean);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password.trim() || !confirmPassword.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in both password fields.",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Please make sure both passwords are identical.",
        variant: "destructive",
      });
      return;
    }

    if (!isPasswordValid()) {
      toast({
        title: "Invalid Password",
        description: "Password must meet all security requirements shown below.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log('Updating password for email:', email);
      
      // Update password in database
      const { error } = await supabase
        .from('client_accounts')
        .update({ 
          password_hash: password,
          updated_at: new Date().toISOString()
        })
        .eq('email', email);

      if (error) {
        console.error('Password update error:', error);
        toast({
          title: "Reset Failed",
          description: "Failed to update password. Please try the reset process again.",
          variant: "destructive",
        });
        return;
      }

      console.log('Password updated successfully');
      
      toast({
        title: "Password Reset Successful! ✅",
        description: "Your password has been updated successfully.",
      });

      // Navigate to success page
      navigate('/password-reset-success');

    } catch (error) {
      console.error('Unexpected error in password reset:', error);
      toast({
        title: "System Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!email || !verifiedCode) {
    return null;
  }

  const ValidationItem = ({ isValid, text }: { isValid: boolean; text: string }) => (
    <div className="flex items-center space-x-2">
      {isValid ? (
        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
      ) : (
        <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
      )}
      <span className={`text-sm ${isValid ? 'text-green-700' : 'text-red-600'}`}>
        {text}
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-6">
            <div className="flex items-center mb-4">
              <Link to="/verify-reset-code" state={{ email }} className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">Create New Password</CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                Set a new secure password for your account
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Real-time password validation */}
              {password && (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-3">Password Requirements:</p>
                  <div className="space-y-2">
                    <ValidationItem 
                      isValid={passwordValidation.length} 
                      text="6-10 characters in length" 
                    />
                    <ValidationItem 
                      isValid={passwordValidation.uppercase} 
                      text="At least one uppercase letter (A-Z)" 
                    />
                    <ValidationItem 
                      isValid={passwordValidation.number} 
                      text="At least one number (0-9)" 
                    />
                    <ValidationItem 
                      isValid={passwordValidation.special} 
                      text="At least one special character (!@#$%^&*)" 
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm Your Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-sm text-red-600 flex items-center">
                    <XCircle className="h-3 w-3 mr-1" />
                    Passwords do not match
                  </p>
                )}
                {confirmPassword && password === confirmPassword && password && (
                  <p className="text-sm text-green-600 flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Passwords match
                  </p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium" 
                disabled={isLoading || !isPasswordValid() || password !== confirmPassword}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating Password...
                  </>
                ) : (
                  'Update Password'
                )}
              </Button>
            </form>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-sm text-green-800">
                <p className="font-medium mb-1 flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  Security Note:
                </p>
                <p>Your new password will be active immediately and you can sign in with it right away.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
