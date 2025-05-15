
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, MessageCircle, TrendingUp, Check, Clock } from 'lucide-react';

const MoneySaving = () => {
  const handleWhatsAppClick = () => {
    window.open('https://wa.me/256756530349', '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-garrison-black mb-4">Money Saving Services</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Welcome to Our Money Saving services
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        <div>
          <h2 className="text-2xl font-bold text-garrison-green mb-4">Grow Your Wealth</h2>
          <p className="text-gray-700 mb-4">
            As per our company we only save money for our clients that ranges from 10,000 UGX to 1,000,000 UGX.
          </p>
          <p className="text-gray-700 mb-6">
            Start building your financial future today with our flexible savings plans designed to help you achieve your goals.
          </p>
          <div className="bg-garrison-light p-4 rounded-lg border-l-4 border-garrison-green mb-6">
            <p className="font-medium">
              Note: Any amount saved with us ranging from 10,000 UGX to 1,000,000 UGX, will generate for you 5% profits every 2 months.
            </p>
          </div>
          <p className="text-gray-700 mb-6">
            To start saving your money with us, Contact the manager on Whatsapp for more details.
          </p>
          <Button 
            onClick={handleWhatsAppClick}
            className="bg-[#25D366] hover:bg-[#128C7E] flex items-center"
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Contact Manager on WhatsApp
          </Button>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="bg-garrison-green text-white">
            <CardTitle className="text-2xl">5% Return Every 2 Months</CardTitle>
            <CardDescription className="text-white/80">Grow your savings faster</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="flex items-start space-x-3">
                <TrendingUp className="h-6 w-6 text-garrison-green flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium">Competitive Returns</h3>
                  <p className="text-sm text-gray-600">Earn 5% on your savings every 2 months, significantly higher than traditional banks</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Check className="h-6 w-6 text-garrison-green flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium">Flexible Deposit Amount</h3>
                  <p className="text-sm text-gray-600">Save any amount between 10,000 UGX and 1,000,000 UGX</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="h-6 w-6 text-garrison-green flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium">Regular Profit Payouts</h3>
                  <p className="text-sm text-gray-600">Receive your profits reliably every 2 months</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-gray-50 p-8 rounded-lg mb-12">
        <h2 className="text-2xl font-bold text-garrison-black mb-6 text-center">How Our Savings Plan Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="bg-garrison-green rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-white font-bold">1</div>
            <h3 className="text-lg font-medium mb-2">Contact Us</h3>
            <p className="text-gray-600">Reach out to our manager via WhatsApp to discuss your savings goals.</p>
          </div>
          <div className="text-center">
            <div className="bg-garrison-green rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-white font-bold">2</div>
            <h3 className="text-lg font-medium mb-2">Set Up Your Plan</h3>
            <p className="text-gray-600">Choose your deposit amount between 10,000 UGX and 1,000,000 UGX.</p>
          </div>
          <div className="text-center">
            <div className="bg-garrison-green rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-white font-bold">3</div>
            <h3 className="text-lg font-medium mb-2">Start Saving</h3>
            <p className="text-gray-600">Make your initial deposit and begin your savings journey.</p>
          </div>
          <div className="text-center">
            <div className="bg-garrison-green rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-white font-bold">4</div>
            <h3 className="text-lg font-medium mb-2">Earn Profits</h3>
            <p className="text-gray-600">Receive 5% returns on your savings every 2 months.</p>
          </div>
        </div>
      </div>

      <div className="bg-garrison-green text-white p-8 rounded-lg">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0 md:mr-8">
            <h2 className="text-2xl font-bold mb-4">Ready to Start Saving?</h2>
            <p className="text-white/90">
              Take the first step towards financial security and growth with our competitive savings plan.
            </p>
          </div>
          <Button 
            onClick={handleWhatsAppClick}
            className="bg-white text-garrison-green hover:bg-gray-100 flex-shrink-0"
          >
            Start Saving Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MoneySaving;
