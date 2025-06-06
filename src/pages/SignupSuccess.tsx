
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, CheckCircle } from 'lucide-react';

const SignupSuccess = () => {
  const location = useLocation();
  const userDetails = location.state?.userDetails;

  const handleContactManager = () => {
    const message = `Hello, I just signed up for a client account with the following details:
Name: ${userDetails?.name || 'Not provided'}
Email: ${userDetails?.email || 'Not provided'}
Phone: ${userDetails?.phone || 'Not provided'}
NIN: ${userDetails?.nin || 'Not provided'}

Please provide me with an account number so I can access my account.`;
    
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
              Your details have been recorded successfully. To get your account number, please contact our manager.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                Contact our manager on WhatsApp to receive your account number:
              </p>
              <p className="font-semibold text-garrison-black">+256761281222</p>
            </div>
            <Button 
              onClick={handleContactManager}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Contact Manager on WhatsApp
            </Button>
            <div className="text-center">
              <Link to="/client-auth" className="text-sm text-garrison-green hover:underline">
                Already have an account number? Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignupSuccess;
