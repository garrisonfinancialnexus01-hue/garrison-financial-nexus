
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, LogIn } from 'lucide-react';

const PasswordResetSuccess = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-600">Password Reset Successful!</CardTitle>
            <CardDescription>
              Your password has been successfully updated. You can now sign in with your new password.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="text-sm text-green-800">
                <p className="font-medium mb-1">What's Next?</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Your new password is now active</li>
                  <li>Use it to sign in to your account</li>
                  <li>Keep your password secure and don't share it</li>
                </ul>
              </div>
            </div>

            <Link to="/client-auth">
              <Button className="w-full">
                <LogIn className="h-4 w-4 mr-2" />
                Sign In to Your Account
              </Button>
            </Link>

            <div className="text-center">
              <Link to="/" className="text-sm text-garrison-green hover:underline">
                Return to Home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PasswordResetSuccess;
