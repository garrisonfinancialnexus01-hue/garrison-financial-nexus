
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, TrendingUp, Wallet, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const WealthManagement = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-garrison-black mb-4">Wealth Management Services</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Comprehensive wealth management solutions to preserve and grow your assets
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-garrison-green mb-4">Building Lasting Wealth</h2>
          <p className="text-gray-700 mb-4">
            At Garrison Financial Nexus, we understand that true wealth management goes beyond just investment advice. 
            It's about creating a comprehensive strategy that addresses all aspects of your financial life, 
            from investment management and retirement planning to tax optimization and estate planning.
          </p>
          <p className="text-gray-700 mb-6">
            Our wealth management team takes a holistic approach to managing your assets, ensuring that your financial 
            strategy aligns with your long-term goals and values. We work diligently to preserve and grow your wealth 
            while providing the peace of mind that comes from knowing your financial future is secure.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild className="bg-garrison-green hover:bg-green-700">
              <a href="#strategies">Our Strategies</a>
            </Button>
            <Button asChild variant="outline" className="border-garrison-green text-garrison-green hover:bg-garrison-light">
              <Link to="/contact">Schedule a Consultation</Link>
            </Button>
          </div>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="bg-garrison-green text-white">
            <CardTitle className="text-2xl">Wealth Management Benefits</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ul className="space-y-4">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-garrison-green mr-2 flex-shrink-0 mt-0.5" />
                <span>Personalized investment strategies</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-garrison-green mr-2 flex-shrink-0 mt-0.5" />
                <span>Tax-efficient wealth structure</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-garrison-green mr-2 flex-shrink-0 mt-0.5" />
                <span>Estate and legacy planning</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-garrison-green mr-2 flex-shrink-0 mt-0.5" />
                <span>Regular portfolio reviews</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-garrison-green mr-2 flex-shrink-0 mt-0.5" />
                <span>Risk management solutions</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-garrison-green mr-2 flex-shrink-0 mt-0.5" />
                <span>Access to exclusive investment opportunities</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div id="strategies" className="mb-16">
        <h2 className="text-2xl font-bold text-garrison-black mb-8 text-center">Our Wealth Management Strategies</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="mb-4">
                <TrendingUp className="h-12 w-12 text-garrison-green" />
              </div>
              <h3 className="text-xl font-bold mb-2">Investment Management</h3>
              <p className="text-gray-600 mb-4">
                Our expert team creates diversified investment portfolios tailored to your risk tolerance, time horizon, and financial goals. 
                We carefully select investments across various asset classes to optimize returns while managing risk.
              </p>
              <Link to="/contact" className="text-garrison-green hover:underline inline-flex items-center">
                Learn More <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="mb-4">
                <Wallet className="h-12 w-12 text-garrison-green" />
              </div>
              <h3 className="text-xl font-bold mb-2">Retirement Planning</h3>
              <p className="text-gray-600 mb-4">
                We help you build a retirement strategy that ensures financial security in your golden years. 
                Our approach includes retirement income planning, pension optimization, and sustainable withdrawal strategies.
              </p>
              <Link to="/contact" className="text-garrison-green hover:underline inline-flex items-center">
                Learn More <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#399B53" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-scroll-text">
                  <path d="M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3h4" />
                  <path d="M19 17V5a2 2 0 0 0-2-2H4" />
                  <path d="M15 8h-5" />
                  <path d="M15 12h-5" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Estate Planning</h3>
              <p className="text-gray-600 mb-4">
                We help you create a comprehensive estate plan to protect your legacy and ensure your assets are transferred according to your wishes. 
                Our services include will preparation, trust establishment, and beneficiary planning.
              </p>
              <Link to="/contact" className="text-garrison-green hover:underline inline-flex items-center">
                Learn More <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#399B53" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Risk Management</h3>
              <p className="text-gray-600 mb-4">
                We identify and mitigate financial risks through appropriate insurance strategies and protective structures. 
                Our approach includes liability protection, business succession planning, and asset protection strategies.
              </p>
              <Link to="/contact" className="text-garrison-green hover:underline inline-flex items-center">
                Learn More <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="bg-gray-50 p-8 rounded-lg mb-16">
        <h2 className="text-2xl font-bold text-garrison-black mb-6 text-center">Our Wealth Management Process</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="text-center">
            <div className="bg-garrison-green rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-white font-bold">1</div>
            <h3 className="text-lg font-medium mb-2">Discovery</h3>
            <p className="text-gray-600">Understanding your financial situation, goals, and risk tolerance</p>
          </div>
          <div className="text-center">
            <div className="bg-garrison-green rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-white font-bold">2</div>
            <h3 className="text-lg font-medium mb-2">Strategy Development</h3>
            <p className="text-gray-600">Creating your personalized wealth management plan</p>
          </div>
          <div className="text-center">
            <div className="bg-garrison-green rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-white font-bold">3</div>
            <h3 className="text-lg font-medium mb-2">Implementation</h3>
            <p className="text-gray-600">Executing your wealth management strategy</p>
          </div>
          <div className="text-center">
            <div className="bg-garrison-green rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-white font-bold">4</div>
            <h3 className="text-lg font-medium mb-2">Monitoring</h3>
            <p className="text-gray-600">Regular review and analysis of your portfolio</p>
          </div>
          <div className="text-center">
            <div className="bg-garrison-green rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-white font-bold">5</div>
            <h3 className="text-lg font-medium mb-2">Optimization</h3>
            <p className="text-gray-600">Adjusting strategies as your life and goals evolve</p>
          </div>
        </div>
      </div>

      <div className="bg-garrison-green text-white p-8 rounded-lg">
        <div className="md:flex items-center justify-between">
          <div className="md:w-2/3 mb-6 md:mb-0">
            <h2 className="text-2xl font-bold mb-4">Take the Next Step in Your Wealth Journey</h2>
            <p className="text-white/90">
              Our wealth management experts are ready to help you build, preserve, and transfer your wealth effectively.
              Schedule a consultation today to begin your journey toward financial prosperity.
            </p>
          </div>
          <div>
            <Button asChild className="bg-white text-garrison-green hover:bg-gray-100">
              <Link to="/contact">
                Schedule a Consultation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WealthManagement;
