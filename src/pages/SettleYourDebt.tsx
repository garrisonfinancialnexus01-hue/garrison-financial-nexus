import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, CheckCircle, Clock, DollarSign, User } from 'lucide-react';

const SettleYourDebt = () => {
  const handleWhatsAppClick = () => {
    window.open('https://wa.me/256761281222', '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-garrison-black mb-4">Settle Your Debt</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Contact our manager directly to discuss and settle your outstanding debt with flexible payment options.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <Card className="shadow-lg">
          <CardHeader className="bg-garrison-green text-white">
            <CardTitle className="text-2xl flex items-center">
              <img src="/lovable-uploads/cca0085d-a5e4-45a3-958c-e0e66dc68e16.png" alt="WhatsApp" className="mr-3 h-6 w-6" />
              Contact Manager
            </CardTitle>
            <CardDescription className="text-white/80">
              Speak directly with our debt settlement manager
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-gray-700 mb-6">
                Our dedicated manager is available to help you settle your debt with personalized payment plans 
                that suit your financial situation.
              </p>
              <Button 
                onClick={handleWhatsAppClick}
                className="bg-[#25D366] hover:bg-[#128C7E] text-white flex items-center mx-auto"
                size="lg"
              >
                <img src="/lovable-uploads/cca0085d-a5e4-45a3-958c-e0e66dc68e16.png" alt="WhatsApp" className="mr-2 h-5 w-5" />
                Contact Manager on WhatsApp
              </Button>
              <p className="text-sm text-gray-500 mt-3">
                Manager: +256761281222
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="bg-garrison-black text-white">
            <CardTitle className="text-2xl">Debt Settlement Benefits</CardTitle>
            <CardDescription className="text-white/80">
              Why settle your debt with us
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-garrison-green flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium">Flexible Payment Plans</h3>
                  <p className="text-sm text-gray-600">Customize your repayment schedule to fit your budget</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <User className="h-6 w-6 text-garrison-green flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium">Personal Consultation</h3>
                  <p className="text-sm text-gray-600">One-on-one discussion with our experienced manager</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <DollarSign className="h-6 w-6 text-garrison-green flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium">Competitive Terms</h3>
                  <p className="text-sm text-gray-600">Fair and reasonable settlement terms</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="h-6 w-6 text-garrison-green flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium">Quick Resolution</h3>
                  <p className="text-sm text-gray-600">Fast processing and settlement approval</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-gray-50 p-8 rounded-lg mb-12">
        <h2 className="text-2xl font-bold text-garrison-black mb-6 text-center">Debt Settlement Process</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="bg-garrison-green rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-white font-bold">1</div>
            <h3 className="text-lg font-medium mb-2">Contact Manager</h3>
            <p className="text-gray-600">Reach out to our debt settlement manager via WhatsApp to discuss your situation.</p>
          </div>
          <div className="text-center">
            <div className="bg-garrison-green rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-white font-bold">2</div>
            <h3 className="text-lg font-medium mb-2">Assessment</h3>
            <p className="text-gray-600">Our manager will review your debt details and current financial situation.</p>
          </div>
          <div className="text-center">
            <div className="bg-garrison-green rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-white font-bold">3</div>
            <h3 className="text-lg font-medium mb-2">Payment Plan</h3>
            <p className="text-gray-600">Develop a customized payment plan that works for your budget.</p>
          </div>
          <div className="text-center">
            <div className="bg-garrison-green rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-white font-bold">4</div>
            <h3 className="text-lg font-medium mb-2">Settlement</h3>
            <p className="text-gray-600">Complete your debt settlement according to the agreed terms.</p>
          </div>
        </div>
      </div>

      <div className="bg-garrison-green text-white p-8 rounded-lg">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0 md:mr-8">
            <h2 className="text-2xl font-bold mb-4">Need Help Settling Your Debt?</h2>
            <p className="text-white/90">
              Don't let debt burden you. Contact our manager today for a personalized solution.
            </p>
          </div>
          <Button 
            onClick={handleWhatsAppClick}
            className="bg-white text-garrison-green hover:bg-gray-100 flex-shrink-0"
          >
            Contact Manager Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettleYourDebt;
