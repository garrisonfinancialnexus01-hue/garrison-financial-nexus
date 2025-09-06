
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Wallet, Building, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NeonButton } from '@/components/ui/neon-button';
import TypewriterAnimation from '@/components/TypewriterAnimation';

const Index = () => {
  const openWhatsApp = () => {
    window.open(`https://wa.me/256761281222`, '_blank');
  };

  const typewriterTexts = [
    "Welcome to Garrison Financial Nexus...",
    "We help you grow smarter with your money.",
    "Money Lending?",
    'Click "Calculate Now" to begin.',
    "Need a place to Save Money?",
    'Go to the Main Menu → Click "Clients Accounts"',
    "Seeking Financial Advisory?",
    "We've got expert guidance for every step.",
    "Want Wealth Management?",
    "Your long-term success is our goal.",
    "Garrison Financial Nexus – Lending. Saving. Advising. Growing."
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Typewriter Animation */}
      <section className="bg-gradient-to-r from-garrison-green to-green-700 text-white py-8 sm:py-12 md:py-16 lg:py-20 min-h-[70vh] sm:min-h-[75vh] md:min-h-[80vh] flex items-center">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
            {/* Left side with Typewriter Animation */}
            <div className="w-full lg:w-1/2 mb-6 sm:mb-8 lg:mb-0 animate-fade-in">
              <div className="mb-6 sm:mb-8">
                <TypewriterAnimation 
                  texts={typewriterTexts}
                  typeSpeed={60}
                  deleteSpeed={30}
                  delayBetweenTexts={2500}
                  className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 sm:mb-6 min-h-[2.5em] sm:min-h-[3em] flex items-center justify-center lg:justify-start text-center lg:text-left px-2 sm:px-0"
                />
              </div>
              
              <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto lg:mx-0 text-center lg:text-left opacity-90 px-4 sm:px-2 lg:px-0 leading-relaxed">
                At <span className="font-bold text-white">Garrison Financial Nexus</span>, we provide comprehensive financial services 
                to help you achieve your financial goals and secure your future.
              </p>
            </div>
            
            {/* Right side with Financial Calculator Card */}
            <div className="w-full lg:w-1/2 animate-fade-in animation-delay-300 px-4 sm:px-2 lg:px-0">
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 max-w-lg mx-auto transform hover:scale-105 transition-all duration-300">
                <h2 className="text-garrison-green text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 font-inter text-center">Financial Calculator</h2>
                <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base md:text-lg text-center leading-relaxed">Estimate your potential savings or loan payments with our smart calculator.</p>
                <div className="flex justify-center">
                  <Link to="/loan-application">
                    <button
                      className="relative px-4 sm:px-6 md:px-8 py-3 sm:py-4 text-sm sm:text-base md:text-lg font-semibold text-[#399B53] rounded-full bg-[#000000] transition-all duration-300 hover:scale-105"
                      style={{
                        boxShadow: '0 0 20px #399B53, 0 0 40px #399B53, 0 0 60px #399B53',
                        animation: 'pulse 2s ease-in-out infinite alternate',
                      }}
                    >
                      Calculate Now
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-16 animate-fade-in px-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-garrison-black mb-3 sm:mb-4 font-inter">Our Services</h2>
            <p className="mt-2 sm:mt-4 text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We offer a comprehensive range of financial services designed to meet your unique needs and help you achieve financial success
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in">
              <Building className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 text-garrison-green mb-4 sm:mb-6 mx-auto" />
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 text-center font-inter">Money Lending</h3>
              <p className="text-gray-600 mb-4 sm:mb-6 text-center leading-relaxed text-sm sm:text-base">
                Access affordable loans ranging from 10,000 UGX to 200,000 UGX with flexible repayment options and competitive rates.
              </p>
              <div className="text-center">
                <Link to="/money-lending" className="text-garrison-green hover:text-green-700 font-semibold inline-flex items-center transition-colors duration-200 text-sm sm:text-base">
                  Learn More <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in animation-delay-150">
              <Wallet className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 text-garrison-green mb-4 sm:mb-6 mx-auto" />
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 text-center font-inter">Money Saving</h3>
              <p className="text-gray-600 mb-4 sm:mb-6 text-center leading-relaxed text-sm sm:text-base">
                Save your money with us at a competitive interest rate of only 2% per month and watch your savings grow securely.
              </p>
              <div className="flex flex-col space-y-2 sm:space-y-3 items-center">
                <Link to="/money-saving" className="text-garrison-green hover:text-green-700 font-semibold inline-flex items-center transition-colors duration-200 text-sm sm:text-base">
                  Learn More <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
                <button 
                  onClick={openWhatsApp}
                  className="text-garrison-green hover:text-green-700 font-semibold inline-flex items-center transition-colors duration-200 text-sm sm:text-base"
                >
                  <img src="/lovable-uploads/cca0085d-a5e4-45a3-958c-e0e66dc68e16.png" alt="WhatsApp" className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> 
                  Contact Manager
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in animation-delay-300">
              <Users className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 text-garrison-green mb-4 sm:mb-6 mx-auto" />
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 text-center font-inter">Financial Advisory</h3>
              <p className="text-gray-600 mb-4 sm:mb-6 text-center leading-relaxed text-sm sm:text-base">
                Get expert guidance on managing your finances, budgeting, and strategic planning for your financial future.
              </p>
              <div className="text-center">
                <Link to="/financial-advisory" className="text-garrison-green hover:text-green-700 font-semibold inline-flex items-center transition-colors duration-200 text-sm sm:text-base">
                  Learn More <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in animation-delay-450">
              <TrendingUp className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 text-garrison-green mb-4 sm:mb-6 mx-auto" />
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 text-center font-inter">Wealth Management</h3>
              <p className="text-gray-600 mb-4 sm:mb-6 text-center leading-relaxed text-sm sm:text-base">
                Comprehensive wealth management services designed to help you grow and preserve your assets for long-term success.
              </p>
              <div className="text-center">
                <Link to="/wealth-management" className="text-garrison-green hover:text-green-700 font-semibold inline-flex items-center transition-colors duration-200 text-sm sm:text-base">
                  Learn More <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-garrison-green py-12 sm:py-16 md:py-20 text-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 text-center">
          <div className="animate-fade-in px-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 font-inter">Ready to Start Your Financial Journey?</h2>
            <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 md:mb-10 max-w-4xl mx-auto leading-relaxed">
              Join thousands of satisfied clients who have transformed their financial future with <span className="font-bold">Garrison Financial Nexus</span>. 
              Take the first step towards financial freedom today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4 gap-2 sm:gap-4">
              <Button asChild className="bg-white text-garrison-green hover:bg-gray-100 px-4 sm:px-6 md:px-8 py-3 sm:py-4 text-sm sm:text-base md:text-lg font-semibold transition-all duration-300 hover:scale-105 w-full sm:w-auto">
                <Link to="/money-lending">Apply for a Loan</Link>
              </Button>
              <Button asChild className="bg-white text-garrison-green hover:bg-gray-100 px-4 sm:px-6 md:px-8 py-3 sm:py-4 text-sm sm:text-base md:text-lg font-semibold transition-all duration-300 hover:scale-105 w-full sm:w-auto">
                <Link to="/money-saving">Start Saving</Link>
              </Button>
              <Button 
                className="bg-white text-garrison-green hover:bg-gray-100 flex items-center justify-center px-4 sm:px-6 md:px-8 py-3 sm:py-4 text-sm sm:text-base md:text-lg font-semibold transition-all duration-300 hover:scale-105 w-full sm:w-auto"
                onClick={openWhatsApp}
              >
                <img src="/lovable-uploads/cca0085d-a5e4-45a3-958c-e0e66dc68e16.png" alt="WhatsApp" className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">Contact Manager on WhatsApp</span>
                <span className="sm:hidden">WhatsApp Manager</span>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
