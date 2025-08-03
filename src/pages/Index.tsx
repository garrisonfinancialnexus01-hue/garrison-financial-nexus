
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Wallet, Building, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NeonButton } from '@/components/ui/neon-button';

const Index = () => {
  const openWhatsApp = () => {
    window.open(`https://wa.me/256761281222`, '_blank');
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-garrison-green to-green-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-3xl md:text-5xl font-bold mb-6">
                Your Gateway To Financial Prosperity
              </h1>
              <p className="text-xl mb-8">
                At <span className="font-bold">Garrison Financial Nexus</span>, we provide comprehensive financial services 
                to help you achieve your financial goals and secure your future.
              </p>
              <div className="flex space-x-4">
                <Button asChild className="bg-white text-garrison-green hover:bg-gray-100 border-2 border-white">
                  <Link to="/money-lending">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" asChild className="border-2 border-white hover:bg-white/10">
                  <Link to="/contact" className="text-white">
                    <span className="text-[#399B53]">Contact Us</span>
                  </Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="bg-white rounded-lg shadow-xl p-8">
                <h2 className="text-garrison-green text-2xl font-bold mb-4">Financial Calculator</h2>
                <p className="text-gray-600 mb-4">Estimate your potential savings or loan payments.</p>
                <div className="flex justify-center">
                  <Link to="/loan-application">
                    <NeonButton>
                      Calculate Now
                    </NeonButton>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-garrison-black">Our Services</h2>
            <p className="mt-4 text-xl text-gray-600">
              We offer a range of financial services to meet your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
              <Building className="h-12 w-12 text-garrison-green mb-4" />
              <h3 className="text-xl font-bold mb-2">Money Lending</h3>
              <p className="text-gray-600 mb-4">
                Access affordable loans ranging from 10,000 UGX to 200,000 UGX with flexible repayment options.
              </p>
              <Link to="/money-lending" className="text-garrison-green hover:underline inline-flex items-center">
                Learn More <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
              <Wallet className="h-12 w-12 text-garrison-green mb-4" />
              <h3 className="text-xl font-bold mb-2">Money Saving</h3>
              <p className="text-gray-600 mb-4">
                Save your money with us at a really low bank interest rate of only 2% every month.
              </p>
              <div className="flex flex-col space-y-2">
                <Link to="/money-saving" className="text-garrison-green hover:underline inline-flex items-center">
                  Learn More <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
                <button 
                  onClick={openWhatsApp}
                  className="text-garrison-green hover:underline inline-flex items-center mt-2"
                >
                  <img src="/lovable-uploads/cca0085d-a5e4-45a3-958c-e0e66dc68e16.png" alt="WhatsApp" className="mr-1 h-4 w-4" /> Contact Manager
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
              <Users className="h-12 w-12 text-garrison-green mb-4" />
              <h3 className="text-xl font-bold mb-2">Financial Advisory</h3>
              <p className="text-gray-600 mb-4">
                Get expert guidance on managing your finances, budgeting, and planning for your financial future.
              </p>
              <Link to="/financial-advisory" className="text-garrison-green hover:underline inline-flex items-center">
                Learn More <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
              <TrendingUp className="h-12 w-12 text-garrison-green mb-4" />
              <h3 className="text-xl font-bold mb-2">Wealth Management</h3>
              <p className="text-gray-600 mb-4">
                Comprehensive wealth management services to help you grow and preserve your assets.
              </p>
              <Link to="/wealth-management" className="text-garrison-green hover:underline inline-flex items-center">
                Learn More <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-garrison-green py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Your Financial Journey?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of satisfied clients who have transformed their financial future with <span className="text-sm md:text-base">Garrison Financial Nexus</span>.
          </p>
          <div className="flex justify-center space-x-4 flex-wrap">
            <Button asChild className="bg-white text-garrison-green hover:bg-gray-100 mb-2 sm:mb-0">
              <Link to="/money-lending">Apply for a Loan</Link>
            </Button>
            <Button asChild className="bg-white text-garrison-green hover:bg-gray-100 mb-2 sm:mb-0">
              <Link to="/money-saving">Start Saving</Link>
            </Button>
            <Button 
              className="bg-white text-garrison-green hover:bg-gray-100 flex items-center"
              onClick={openWhatsApp}
            >
              <img src="/lovable-uploads/cca0085d-a5e4-45a3-958c-e0e66dc68e16.png" alt="WhatsApp" className="mr-2 h-4 w-4" />
              Contact Manager on WhatsApp
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
