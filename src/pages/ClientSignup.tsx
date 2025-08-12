import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { useSignupSound } from '@/hooks/useSignupSound';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { isValidUgandanNIN } from '@/utils/ninValidation';
import { generateNextAccountNumber } from '@/utils/accountNumberGenerator';
import { supabase } from '@/integrations/supabase/client';

const ClientSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    nin: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { playSignupSound } = useSignupSound();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validatePassword = (password: string): boolean => {
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
    const isValidLength = password.length >= 6 && password.length <= 10;
    
    return hasUppercase && hasNumber && hasSpecialChar && isValidLength;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate password match
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Error",
          description: "Passwords do not match",
          variant: "destructive",
        });
        return;
      }

      // Validate password strength
      if (!validatePassword(formData.password)) {
        toast({
          title: "Invalid Password",
          description: "Password must be 6-10 characters with at least one uppercase letter, one number, and one special character",
          variant: "destructive",
        });
        return;
      }

      // Validate NIN
      const isValidNIN = await isValidUgandanNIN(formData.nin);
      if (!isValidNIN) {
        toast({
          title: "Invalid NIN",
          description: "NIN must be 14 characters starting with CM or CF. Valid compositions: 8 numbers + 6 letters, 9 numbers + 5 letters, or 10 numbers + 4 letters",
          variant: "destructive",
        });
        return;
      }

      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('client_accounts')
        .select('email, nin')
        .or(`email.eq.${formData.email},nin.eq.${formData.nin.toUpperCase().replace(/\s+/g, '')}`)
        .maybeSingle();

      if (existingUser) {
        toast({
          title: "Account Already Exists",
          description: "An account with this email or NIN already exists.",
          variant: "destructive",
        });
        return;
      }

      // Generate account number
      const accountNumber = await generateNextAccountNumber();

      // Create account directly in database
      const { error: insertError } = await supabase
        .from('client_accounts')
        .insert({
          account_number: accountNumber,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          nin: formData.nin.toUpperCase().replace(/\s+/g, ''),
          password_hash: formData.password,
          account_balance: 0.00,
          status: 'pending'
        });

      if (insertError) {
        console.error('Error creating account:', insertError);
        toast({
          title: "Error",
          description: "Failed to create account. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Send notification email
      try {
        await supabase.functions.invoke('send-signup-notification', {
          body: {
            userDetails: {
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              nin: formData.nin.toUpperCase().replace(/\s+/g, ''),
              signupDate: new Date().toISOString()
            },
            accountNumber: accountNumber
          }
        });
      } catch (emailError) {
        console.error('Failed to send notification email:', emailError);
      }

      // Play signup success sound
      playSignupSound();

      toast({
        title: "Account Created Successfully!",
        description: `Your account number is ${accountNumber}. Please save this number and contact the manager for activation.`,
        duration: 8000,
      });

      // Navigate to success page with account details
      navigate('/signup-success', { 
        state: { 
          accountNumber: accountNumber,
          userDetails: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            nin: formData.nin.toUpperCase().replace(/\s+/g, ''),
          }
        } 
      });

    } catch (error) {
      console.error('Unexpected error during signup:', error);
      toast({
        title: "Error",
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
            <CardTitle className="text-2xl text-center">Create Account</CardTitle>
            <CardDescription className="text-center">
              Fill in your details to create a new client account. You'll receive an account number upon successful registration.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nin">NIN (National Identification Number)</Label>
                <Input
                  id="nin"
                  name="nin"
                  type="text"
                  placeholder="Enter your 14-character NIN"
                  value={formData.nin}
                  onChange={handleInputChange}
                  maxLength={14}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleInputChange}
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
                <p className="text-xs text-gray-500">
                  6-10 characters with uppercase, number, and special character
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/client-auth" className="text-garrison-green hover:underline">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientSignup;
