
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, CheckCircle } from 'lucide-react';

const RegistrationSuccess = () => {
  const location = useLocation();
  const registrationData = location.state?.registrationData;

  const handleContactManager = () => {
    const message = `Hello, I just completed my client account registration with the following details:

Name: ${registrationData?.fullName || 'Not provided'}
Email: ${registrationData?.emailAddress || 'Not provided'}
Phone: ${registrationData?.phoneNumber || 'Not provided'}
Account Type: ${registrationData?.savingsAccountType || 'Not provided'}
Initial Deposit: ${registrationData?.initialDepositAmount || 'Not provided'} UGX

Please provide me with my account number and sign-in code so I can access my account.`;
    
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
            <CardTitle className="text-2xl text-green-600">Registration Successful!</CardTitle>
            <CardDescription>
              Your registration has been submitted successfully. To get your account number and sign-in code, please contact our manager.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                Contact our manager on WhatsApp to receive your account details:
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
              <Link to="/client-signin" className="text-sm text-garrison-green hover:underline">
                Already have account details? Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegistrationSuccess;
