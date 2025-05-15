
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Users, TrendingUp, Wallet, Bank } from 'lucide-react';
import { Link } from 'react-router-dom';

const FinancialAdvisory = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-garrison-black mb-4">Financial Advisory Services</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Expert guidance to help you make informed financial decisions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-garrison-green mb-4">Our Advisory Approach</h2>
          <p className="text-gray-700 mb-6">
            At Garrison Financial Nexus, we believe that good financial advice should be personalized, practical, and accessible. 
            Our team of experienced financial advisors work closely with you to understand your unique situation, 
            goals, and challenges to create tailored financial strategies.
          </p>
          <p className="text-gray-700 mb-6">
            Whether you're planning for retirement, looking to invest, starting a business, or just trying to manage your day-to-day finances better, 
            our advisors are here to provide expert guidance every step of the way.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild className="bg-garrison-green hover:bg-green-700">
              <a href="#services">Explore Our Services</a>
            </Button>
            <Button asChild variant="outline" className="border-garrison-green text-garrison-green hover:bg-garrison-light">
              <Link to="/contact">Schedule a Consultation</Link>
            </Button>
          </div>
        </div>

        <Card className="shadow-lg bg-garrison-green text-white">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-4">Why Choose Our Advisory Services?</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Personalized advice tailored to your financial situation</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Experienced advisors with local market knowledge</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Practical strategies you can implement immediately</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Regular financial reviews to keep you on track</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Affordable advisory options for every budget</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div id="services" className="mb-16">
        <h2 className="text-2xl font-bold text-garrison-black mb-8 text-center">Our Financial Advisory Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="mb-4">
                <Wallet className="h-12 w-12 text-garrison-green" />
              </div>
              <h3 className="text-xl font-bold mb-2">Personal Financial Planning</h3>
              <p className="text-gray-600 mb-4">
                Comprehensive financial planning tailored to your personal goals and circumstances. 
                We help you create budgets, manage debt, build emergency funds, and plan for major life events.
              </p>
              <Link to="/contact" className="text-garrison-green hover:underline inline-flex items-center">
                Learn More <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="mb-4">
                <TrendingUp className="h-12 w-12 text-garrison-green" />
              </div>
              <h3 className="text-xl font-bold mb-2">Investment Advisory</h3>
              <p className="text-gray-600 mb-4">
                Strategic investment guidance to help you grow your wealth. Our advisors will help you 
                understand investment options, assess risk tolerance, and build a diversified portfolio.
              </p>
              <Link to="/contact" className="text-garrison-green hover:underline inline-flex items-center">
                Learn More <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="mb-4">
                <Bank className="h-12 w-12 text-garrison-green" />
              </div>
              <h3 className="text-xl font-bold mb-2">Retirement Planning</h3>
              <p className="text-gray-600 mb-4">
                Plan for a secure and comfortable retirement with strategies tailored to your age, 
                income, and retirement goals. We help you maximize savings and create sustainable withdrawal plans.
              </p>
              <Link to="/contact" className="text-garrison-green hover:underline inline-flex items-center">
                Learn More <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="mb-4">
                <Users className="h-12 w-12 text-garrison-green" />
              </div>
              <h3 className="text-xl font-bold mb-2">Business Financial Advisory</h3>
              <p className="text-gray-600 mb-4">
                Expert financial guidance for small businesses and entrepreneurs. We provide advice on cash flow management, 
                business expansion, capital raising, and creating financial projections.
              </p>
              <Link to="/contact" className="text-garrison-green hover:underline inline-flex items-center">
                Learn More <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="bg-gray-50 p-8 rounded-lg mb-12">
        <h2 className="text-2xl font-bold text-garrison-black mb-6 text-center">Our Advisory Process</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="bg-garrison-green rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-white font-bold">1</div>
            <h3 className="text-lg font-medium mb-2">Initial Consultation</h3>
            <p className="text-gray-600">We begin by understanding your current financial situation and goals.</p>
          </div>
          <div className="text-center">
            <div className="bg-garrison-green rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-white font-bold">2</div>
            <h3 className="text-lg font-medium mb-2">Financial Analysis</h3>
            <p className="text-gray-600">Our experts analyze your finances and identify opportunities and challenges.</p>
          </div>
          <div className="text-center">
            <div className="bg-garrison-green rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-white font-bold">3</div>
            <h3 className="text-lg font-medium mb-2">Strategy Development</h3>
            <p className="text-gray-600">We create a customized financial plan tailored to your specific needs.</p>
          </div>
          <div className="text-center">
            <div className="bg-garrison-green rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-white font-bold">4</div>
            <h3 className="text-lg font-medium mb-2">Ongoing Support</h3>
            <p className="text-gray-600">Regular reviews and adjustments to keep your financial plan on track.</p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold text-garrison-black mb-6">Ready to Take Control of Your Finances?</h2>
        <p className="text-gray-600 max-w-3xl mx-auto mb-8">
          Our financial advisors are ready to help you navigate your financial journey with confidence.
          Schedule a consultation today to get started.
        </p>
        <Button asChild className="bg-garrison-green hover:bg-green-700 text-lg px-8 py-6">
          <Link to="/contact">Schedule a Consultation</Link>
        </Button>
      </div>
    </div>
  );
};

export default FinancialAdvisory;
