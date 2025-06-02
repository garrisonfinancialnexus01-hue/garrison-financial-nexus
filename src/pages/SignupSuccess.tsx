
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, MessageCircle } from 'lucide-react';

const SignupSuccess = () => {
  const location = useLocation();
  const accountNumber = location.state?.accountNumber;

  const handleContactManager = () => {
    const message = `Hello, I just signed up for a client account (Account Number: ${accountNumber}) and would like to get my account activated. Please help me with the next steps.`;
    const whatsappUrl = `https://wa.me/256761281222?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-600">Sign Up Successful!</CardTitle>
            <CardDescription>
              Your account has been created successfully. Your account number is:
            </CardDescription>
            <div className="bg-garrison-light p-4 rounded-lg">
              <p className="text-2xl font-bold text-garrison-black">{accountNumber}</p>
              <p className="text-sm text-gray-600 mt-1">Please save this number for future reference</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                To activate your account and set your account balance, please contact our manager:
              </p>
            </div>
            <Button 
              onClick={handleContactManager}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Get Your Account on WhatsApp
            </Button>
            <div className="text-center">
              <Link to="/client-auth" className="text-sm text-garrison-green hover:underline">
                Back to Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignupSuccess;
