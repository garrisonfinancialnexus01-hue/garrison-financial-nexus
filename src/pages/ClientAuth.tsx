
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useClientAuth } from '@/context/ClientAuthContext';
import { useSignInSound } from '@/hooks/useSignInSound';
import { useErrorSound } from '@/hooks/useErrorSound';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, AlertCircle, Eye, EyeOff } from 'lucide-react';

const ClientAuth = () => {
  const [accountNumber, setAccountNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useClientAuth();
  const { playSignInSound } = useSignInSound();
  const { playErrorSound } = useErrorSound();
  const navigate = useNavigate();
  const location = useLocation();

  // Show success message if coming from account activation
  React.useEffect(() => {
    if (location.state?.message) {
      toast({
        title: "Success!",
        description: location.state.message,
      });
    }
  }, [location.state]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!accountNumber.trim() || !password.trim()) {
      // Play error sound for missing information
      playErrorSound();
      
      toast({
        title: "Missing Information",
        description: "Please enter both account number and password.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const { error } = await signIn(accountNumber.trim(), password);
    
    if (error) {
      // Play error sound for sign-in failure
      playErrorSound();
      
      toast({
        title: "Sign In Failed",
        description: error,
        variant: "destructive",
      });
    } else {
      // Play success sound
      playSignInSound();
      
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      navigate('/client-dashboard');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <div className="flex items-center mb-4">
              <Link to="/" className="flex items-center text-garrison-green hover:text-garrison-black">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </div>
            <CardTitle className="text-2xl text-center">Client Sign In</CardTitle>
            <CardDescription className="text-center">
              Enter your account number and password to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="account-number">Account Number</Label>
                <Input
                  id="account-number"
                  type="text"
                  placeholder="Enter your 8-digit account number"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  maxLength={8}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <div className="text-right">
                  <Link to="/forgot-password" className="text-sm text-garrison-green hover:underline">
                    Forgot your password?
                  </Link>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Account Not Working?</p>
                  <p>New accounts need to be activated with a verification code from the manager before you can sign in.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 text-center space-y-2">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/client-signup" className="text-garrison-green hover:underline">
                  Sign up here
                </Link>
              </p>
              <p className="text-sm text-gray-600">
                Need to activate your account?{' '}
                <Link to="/account-activation" className="text-garrison-green hover:underline">
                  Enter verification code
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientAuth;
