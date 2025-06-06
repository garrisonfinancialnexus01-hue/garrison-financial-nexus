
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, ArrowLeft } from 'lucide-react';
import { useClientAuth } from '@/context/ClientAuthContext';

const TransactionRequest = () => {
  const location = useLocation();
  const { currentClient } = useClientAuth();
  const transactionType = location.state?.transactionType || 'transaction';

  const handleContactManager = () => {
    const message = `Hello, I would like to ${transactionType} from my account.

My Account Details:
Account Number: ${currentClient?.account_number}
Name: ${currentClient?.name}
Current Balance: ${currentClient?.account_balance.toLocaleString()} UGX

Please assist me with this ${transactionType}.`;
    
    const whatsappUrl = `https://wa.me/256761281222?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-4">
            <div className="flex items-center mb-4">
              <Link to="/client-dashboard" className="flex items-center text-garrison-green hover:text-garrison-black">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </div>
            <CardTitle className="text-2xl text-center capitalize">
              {transactionType} Request
            </CardTitle>
            <CardDescription className="text-center">
              Contact our manager to proceed with your {transactionType}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                To {transactionType}, please contact our manager on WhatsApp:
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TransactionRequest;
