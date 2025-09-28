import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserPlus } from 'lucide-react';

const ClientTypeSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const loanData = location.state;

  if (!loanData) {
    navigate('/loan-application');
    return null;
  }

  const handleRegularClient = () => {
    navigate('/regular-client-search', { state: loanData });
  };

  const handleNewClient = () => {
    navigate('/loan-details', { state: loanData });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-garrison-black mb-4">Select Client Type</h1>
        <p className="text-gray-600">
          Please choose whether you are a returning client or applying for the first time.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={handleRegularClient}>
          <CardHeader className="bg-garrison-green text-white text-center">
            <div className="flex justify-center mb-2">
              <Users size={48} />
            </div>
            <CardTitle>Regular Client</CardTitle>
            <CardDescription className="text-white/80">
              I have applied for a loan before
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-gray-600 mb-4">
              If you have previously applied for a loan with us, select this option to search for your existing information.
            </p>
            <Button 
              onClick={handleRegularClient}
              className="w-full bg-garrison-green hover:bg-green-700"
            >
              Continue as Regular Client
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={handleNewClient}>
          <CardHeader className="bg-blue-600 text-white text-center">
            <div className="flex justify-center mb-2">
              <UserPlus size={48} />
            </div>
            <CardTitle>New Client</CardTitle>
            <CardDescription className="text-white/80">
              This is my first loan application
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-gray-600 mb-4">
              If this is your first time applying for a loan with us, select this option to complete the full application process.
            </p>
            <Button 
              onClick={handleNewClient}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Continue as New Client
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientTypeSelection;