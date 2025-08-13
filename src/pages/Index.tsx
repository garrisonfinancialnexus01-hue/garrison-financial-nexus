import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Wallet, Building, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NeonButton } from '@/components/ui/neon-button';
import TypewriterAnimation from '@/components/TypewriterAnimation';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

// Import hero images
import loanApplicationHero from '@/assets/loan-application-hero.jpg';
import accountCreationHero from '@/assets/account-creation-hero.jpg';
import financialAdvisoryHero from '@/assets/financial-advisory-hero.jpg';
import wealthManagementHero from '@/assets/wealth-management-hero.jpg';

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
      <section className="bg-gradient-to-r from-garrison-green to-green-700 text-white py-20 min-h-[80vh] flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col md:flex-row items-center">
            {/* Left side with Typewriter Animation */}
            <div className="md:w-1/2 mb-10 md:mb-0 animate-fade-in">
              <div className="mb-8">
                <TypewriterAnimation 
                  texts={typewriterTexts}
                  typeSpeed={60}
                  deleteSpeed={30}
                  delayBetweenTexts={2500}
                  className="text-2xl md:text-4xl lg:text-5xl font-bold mb-6 min-h-[3em] flex items-center justify-center md:justify-start"
                />
              </div>
              
              <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto md:mx-0 text-center md:text-left opacity-90">
                At <span className="font-bold text-white">Garrison Financial Nexus</span>, we provide comprehensive financial services 
                to help you achieve your financial goals and secure your future.
              </p>
            </div>
            
            {/* Right side with Financial Calculator Card */}
            <div className="md:w-1/2 animate-fade-in animation-delay-300">
              <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg mx-auto transform hover:scale-105 transition-all duration-300">
                <h2 className="text-garrison-green text-2xl md:text-3xl font-bold mb-4 font-inter">Financial Calculator</h2>
                <p className="text-gray-600 mb-6 text-lg">Estimate your potential savings or loan payments with our smart calculator.</p>
                <div className="flex justify-center">
                  <Link to="/loan-application">
                    <NeonButton className="px-8 py-4 text-lg font-semibold">
                      Calculate Now
                    </NeonButton>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Carousel Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl font-bold text-garrison-black mb-4 font-inter">See Our Services in Action</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover how Garrison Financial Nexus empowers Ugandans to achieve their financial goals
            </p>
          </div>
          
          <Carousel
            plugins={[
              Autoplay({
                delay: 4000,
                stopOnInteraction: false,
                stopOnMouseEnter: true,
              }),
            ]}
            className="w-full max-w-5xl mx-auto"
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent>
              <CarouselItem>
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img 
                    src={loanApplicationHero} 
                    alt="Ugandan woman applying for a loan with Garrison Financial Nexus" 
                    className="w-full h-96 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end">
                    <div className="p-8 text-white">
                      <h3 className="text-2xl font-bold mb-2">Quick & Easy Loan Applications</h3>
                      <p className="text-lg opacity-90">Apply for loans from 10,000 UGX to 200,000 UGX with our simple online process</p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
              
              <CarouselItem>
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img 
                    src={accountCreationHero} 
                    alt="Ugandan man creating account with Garrison Financial Nexus" 
                    className="w-full h-96 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end">
                    <div className="p-8 text-white">
                      <h3 className="text-2xl font-bold mb-2">Simple Account Creation</h3>
                      <p className="text-lg opacity-90">Join thousands of satisfied clients with our quick and secure registration process</p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
              
              <CarouselItem>
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img 
                    src={financialAdvisoryHero} 
                    alt="Ugandan woman using financial advisory service at Garrison Financial Nexus" 
                    className="w-full h-96 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end">
                    <div className="p-8 text-white">
                      <h3 className="text-2xl font-bold mb-2">Expert Financial Advisory</h3>
                      <p className="text-lg opacity-90">Get professional guidance to make informed financial decisions and plan for your future</p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
              
              <CarouselItem>
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img 
                    src={wealthManagementHero} 
                    alt="Ugandan man using wealth management service at Garrison Financial Nexus" 
                    className="w-full h-96 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end">
                    <div className="p-8 text-white">
                      <h3 className="text-2xl font-bold mb-2">Comprehensive Wealth Management</h3>
                      <p className="text-lg opacity-90">Grow and preserve your assets with our strategic investment and wealth planning services</p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-bold text-garrison-black mb-4 font-inter">Our Services</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              We offer a comprehensive range of financial services designed to meet your unique needs and help you achieve financial success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in">
              <Building className="h-16 w-16 text-garrison-green mb-6 mx-auto" />
              <h3 className="text-2xl font-bold mb-4 text-center font-inter">Money Lending</h3>
              <p className="text-gray-600 mb-6 text-center leading-relaxed">
                Access affordable loans ranging from 10,000 UGX to 200,000 UGX with flexible repayment options and competitive rates.
              </p>
              <div className="text-center">
                <Link to="/money-lending" className="text-garrison-green hover:text-green-700 font-semibold inline-flex items-center transition-colors duration-200">
                  Learn More <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in animation-delay-150">
              <Wallet className="h-16 w-16 text-garrison-green mb-6 mx-auto" />
              <h3 className="text-2xl font-bold mb-4 text-center font-inter">Money Saving</h3>
              <p className="text-gray-600 mb-6 text-center leading-relaxed">
                Save your money with us at a competitive interest rate of only 2% per month and watch your savings grow securely.
              </p>
              <div className="flex flex-col space-y-3 items-center">
                <Link to="/money-saving" className="text-garrison-green hover:text-green-700 font-semibold inline-flex items-center transition-colors duration-200">
                  Learn More <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <button 
                  onClick={openWhatsApp}
                  className="text-garrison-green hover:text-green-700 font-semibold inline-flex items-center transition-colors duration-200"
                >
                  <img src="/lovable-uploads/cca0085d-a5e4-45a3-958c-e0e66dc68e16.png" alt="WhatsApp" className="mr-2 h-5 w-5" /> 
                  Contact Manager
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in animation-delay-300">
              <Users className="h-16 w-16 text-garrison-green mb-6 mx-auto" />
              <h3 className="text-2xl font-bold mb-4 text-center font-inter">Financial Advisory</h3>
              <p className="text-gray-600 mb-6 text-center leading-relaxed">
                Get expert guidance on managing your finances, budgeting, and strategic planning for your financial future.
              </p>
              <div className="text-center">
                <Link to="/financial-advisory" className="text-garrison-green hover:text-green-700 font-semibold inline-flex items-center transition-colors duration-200">
                  Learn More <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in animation-delay-450">
              <TrendingUp className="h-16 w-16 text-garrison-green mb-6 mx-auto" />
              <h3 className="text-2xl font-bold mb-4 text-center font-inter">Wealth Management</h3>
              <p className="text-gray-600 mb-6 text-center leading-relaxed">
                Comprehensive wealth management services designed to help you grow and preserve your assets for long-term success.
              </p>
              <div className="text-center">
                <Link to="/wealth-management" className="text-garrison-green hover:text-green-700 font-semibold inline-flex items-center transition-colors duration-200">
                  Learn More <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-garrison-green py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            <h2 className="text-4xl font-bold mb-6 font-inter">Ready to Start Your Financial Journey?</h2>
            <p className="text-xl mb-10 max-w-4xl mx-auto leading-relaxed">
              Join thousands of satisfied clients who have transformed their financial future with <span className="font-bold">Garrison Financial Nexus</span>. 
              Take the first step towards financial freedom today.
            </p>
            <div className="flex justify-center space-x-4 flex-wrap gap-4">
              <Button asChild className="bg-white text-garrison-green hover:bg-gray-100 px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105">
                <Link to="/money-lending">Apply for a Loan</Link>
              </Button>
              <Button asChild className="bg-white text-garrison-green hover:bg-gray-100 px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105">
                <Link to="/money-saving">Start Saving</Link>
              </Button>
              <Button 
                className="bg-white text-garrison-green hover:bg-gray-100 flex items-center px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105"
                onClick={openWhatsApp}
              >
                <img src="/lovable-uploads/cca0085d-a5e4-45a3-958c-e0e66dc68e16.png" alt="WhatsApp" className="mr-2 h-5 w-5" />
                Contact Manager on WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
