
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';

const MoneyLending = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-garrison-black mb-4">Money Lending Services</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Welcome to our loan services. Our loans range from 10,000 UGX to 500,000 UGX.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <Card>
          <CardHeader className="bg-garrison-green text-white">
            <CardTitle className="text-2xl">Short-Term Loan</CardTitle>
            <CardDescription className="text-white/80">Pay after 2 weeks with 10% interest</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ul className="space-y-3">
              <li className="flex items-center">
                <Check className="h-5 w-5 text-garrison-green mr-2" />
                <span>Loan amount: 10,000 - 500,000 UGX</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-garrison-green mr-2" />
                <span>Quick approval process</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-garrison-green mr-2" />
                <span>Minimal documentation</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-garrison-green mr-2" />
                <span>10% interest rate</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-garrison-green mr-2" />
                <span>2 weeks repayment period</span>
              </li>
            </ul>
            <div className="mt-6">
              <Button asChild className="w-full bg-garrison-green hover:bg-green-700">
                <Link to="/loan-application?term=short">Apply Now</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-garrison-black text-white">
            <CardTitle className="text-2xl">Medium-Term Loan</CardTitle>
            <CardDescription className="text-white/80">Pay after 1 month with 18% interest</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ul className="space-y-3">
              <li className="flex items-center">
                <Check className="h-5 w-5 text-garrison-green mr-2" />
                <span>Loan amount: 10,000 - 500,000 UGX</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-garrison-green mr-2" />
                <span>Standard approval process</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-garrison-green mr-2" />
                <span>Basic documentation required</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-garrison-green mr-2" />
                <span>18% interest rate</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-garrison-green mr-2" />
                <span>1 month repayment period</span>
              </li>
            </ul>
            <div className="mt-6">
              <Button asChild className="w-full bg-garrison-green hover:bg-green-700">
                <Link to="/loan-application?term=medium">Apply Now</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-gray-50 p-8 rounded-lg mb-12">
        <h2 className="text-2xl font-bold text-garrison-black mb-4">Our Loan Process</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-garrison-green rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-white font-bold">1</div>
            <h3 className="text-lg font-medium mb-2">Apply Online</h3>
            <p className="text-gray-600">Fill out our simple loan application form with your details and desired loan amount.</p>
          </div>
          <div className="text-center">
            <div className="bg-garrison-green rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-white font-bold">2</div>
            <h3 className="text-lg font-medium mb-2">Quick Approval</h3>
            <p className="text-gray-600">Our team reviews your application and provides a fast decision.</p>
          </div>
          <div className="text-center">
            <div className="bg-garrison-green rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-white font-bold">3</div>
            <h3 className="text-lg font-medium mb-2">Receive Funds</h3>
            <p className="text-gray-600">Upon approval, funds are quickly transferred to your account.</p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <Button asChild className="bg-garrison-green hover:bg-green-700 text-lg px-8 py-6">
          <Link to="/loan-application">Get a Loan</Link>
        </Button>
      </div>
    </div>
  );
};

export default MoneyLending;
