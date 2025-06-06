
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import { isValidUgandanNIN } from '@/utils/ninValidation';

const ClientSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    nin: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
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
        setIsLoading(false);
        return;
      }

      // Validate password strength
      if (!validatePassword(formData.password)) {
        toast({
          title: "Invalid Password",
          description: "Password must be 6-10 characters with at least one uppercase letter, one number, and one special character",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Validate NIN
      const isValidNIN = await isValidUgandanNIN(formData.nin);
      if (!isValidNIN) {
        toast({
          title: "Invalid NIN",
          description: "NIN must be 14 characters starting with CM or CF, with either 8 numbers + 6 letters or 9 numbers + 5 letters",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      console.log('Storing user signup details temporarily...');

      // Store user details temporarily in localStorage for the manager to use
      const userSignupDetails = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        nin: formData.nin.toUpperCase().replace(/\s+/g, ''),
        password: formData.password,
        signupDate: new Date().toISOString()
      };

      localStorage.setItem('pendingSignupDetails', JSON.stringify(userSignupDetails));

      console.log('User details stored, redirecting to contact manager...');

      // Navigate to success page with user details
      navigate('/signup-success', { state: { userDetails: userSignupDetails } });

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
              Fill in your details to create a new client account
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
                <p className="text-xs text-gray-500">
                  Must be 14 characters starting with CM or CF
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <p className="text-xs text-gray-500">
                  6-10 characters with uppercase, number, and special character
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Processing...' : 'Sign Up'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientSignup;
