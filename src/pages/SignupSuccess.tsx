
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Copy, Phone, MessageCircle, Key } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const SignupSuccess = () => {
  const location = useLocation();
  const { accountNumber, userDetails } = location.state || {};

  const copyAccountNumber = () => {
    if (accountNumber) {
      navigator.clipboard.writeText(accountNumber);
      toast({
        title: "Copied!",
        description: "Account number copied to clipboard",
      });
    }
  };

  const openWhatsApp = () => {
    const message = `Hello, I just created a new account. My account number is ${accountNumber}. Please provide me with a verification code to activate my account. Name: ${userDetails?.name}`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/256761281222?text=${encodedMessage}`, '_blank');
  };

  if (!accountNumber) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Error</CardTitle>
            <CardDescription className="text-center">
              No account information found. Please try signing up again.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link to="/client-signup">
              <Button>Go to Sign Up</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-600">Account Created Successfully!</CardTitle>
            <CardDescription>
              Your account has been created. Follow the steps below to activate it.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Account Number Display */}
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="text-center">
                <p className="text-sm font-medium text-green-800 mb-2">Your Account Number</p>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-2xl font-bold text-green-900 font-mono">{accountNumber}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyAccountNumber}
                    className="text-green-700 hover:text-green-900"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-green-700 mt-2">Save this number - you'll need it for activation</p>
              </div>
            </div>

            {/* Account Details */}
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">Account Details:</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">{userDetails?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{userDetails?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium text-orange-600">Pending Activation</span>
                </div>
              </div>
            </div>

            {/* Activation Steps */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h3 className="font-medium text-blue-900 mb-2">Activation Steps:</h3>
              <ol className="list-decimal list-inside text-sm text-blue-800 space-y-1">
                <li>Save your account number: <strong>{accountNumber}</strong></li>
                <li>Contact the manager to get a verification code</li>
                <li>Use the verification code to activate your account</li>
                <li>Sign in with your account number and password</li>
              </ol>
            </div>

            {/* Contact Manager */}
            <div className="space-y-3">
              <Button onClick={openWhatsApp} className="w-full bg-green-600 hover:bg-green-700">
                <MessageCircle className="h-4 w-4 mr-2" />
                Contact Manager for Verification Code
              </Button>
              
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Or call directly:</p>
                <a href="tel:+256761281222" className="flex items-center justify-center space-x-2 text-garrison-green hover:underline">
                  <Phone className="h-4 w-4" />
                  <span>+256 761 281 222</span>
                </a>
              </div>
            </div>

            {/* Activation Link */}
            <div className="space-y-3">
              <Link to="/account-activation" state={{ accountNumber }}>
                <Button variant="outline" className="w-full">
                  <Key className="h-4 w-4 mr-2" />
                  I Have a Verification Code
                </Button>
              </Link>
            </div>

            {/* Sign In Link */}
            <div className="text-center pt-4 border-t">
              <p className="text-sm text-gray-600 mb-2">Account already activated?</p>
              <Link to="/client-auth">
                <Button variant="ghost" className="text-garrison-green hover:text-garrison-black">
                  Sign In to Your Account
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignupSuccess;
