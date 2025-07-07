
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, LogIn, Home, Shield } from 'lucide-react';

const PasswordResetSuccess = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-600">Password Reset Successful!</CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              Your password has been successfully updated and is ready to use.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="text-sm text-green-800">
                <p className="font-medium mb-3 flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  ✅ What's completed:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    Your new password is now active and secured
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    You can immediately sign in with your new password
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    Your account security has been updated
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    The system now recognizes your new password
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-3">
              <Link to="/client-auth">
                <Button className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-medium">
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In to Your Account
                </Button>
              </Link>

              <Link to="/">
                <Button variant="outline" className="w-full h-12 border-gray-300 hover:bg-gray-50">
                  <Home className="h-4 w-4 mr-2" />
                  Return to Home
                </Button>
              </Link>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-2 flex items-center">
                  💡 Next Steps:
                </p>
                <ul className="space-y-1">
                  <li>• Use your new password to sign in to your account</li>
                  <li>• Keep your password secure and don't share it</li>
                  <li>• Consider saving it in a secure password manager</li>
                  <li>• Contact support if you need any assistance</li>
                </ul>
              </div>
            </div>

            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Need help? Contact us at{' '}
                <span className="font-medium text-blue-600">+256 761 281 222</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PasswordResetSuccess;
