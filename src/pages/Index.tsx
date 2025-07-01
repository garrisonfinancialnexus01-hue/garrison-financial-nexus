import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, DollarSign, PiggyBank, TrendingUp, Users, Shield, Award, CheckCircle, Star, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const services = [
    {
      title: "Money Lending",
      description: "Quick and reliable loans with competitive interest rates",
      icon: DollarSign,
      link: "/money-lending",
      color: "bg-blue-500"
    },
    {
      title: "Money Saving",
      description: "Secure savings accounts with attractive returns",
      icon: PiggyBank,
      link: "/money-saving",
      color: "bg-green-500"
    },
    {
      title: "Wealth Management",
      description: "Professional investment advice and portfolio management",
      icon: TrendingUp,
      link: "/wealth-management",
      color: "bg-purple-500"
    },
    {
      title: "Financial Advisory",
      description: "Expert guidance for your financial planning needs",
      icon: Users,
      link: "/financial-advisory",
      color: "bg-orange-500"
    }
  ];

  const features = [
    {
      icon: Shield,
      title: "Secure & Trusted",
      description: "Your money is safe with our bank-level security measures"
    },
    {
      icon: Award,
      title: "Competitive Rates",
      description: "Best interest rates in the market for loans and savings"
    },
    {
      icon: Users,
      title: "Expert Support",
      description: "Professional financial advisors to guide your decisions"
    },
    {
      icon: CheckCircle,
      title: "Quick Processing",
      description: "Fast approval and processing of all financial services"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Mukasa",
      role: "Small Business Owner",
      content: "Garrison Financial helped me expand my business with their quick loan approval process. Highly recommended!",
      rating: 5
    },
    {
      name: "James Okello",
      role: "Teacher",
      content: "Their savings account has helped me build a solid financial foundation for my family's future.",
      rating: 5
    },
    {
      name: "Mary Nakato",
      role: "Entrepreneur",
      content: "Professional wealth management advice that actually works. My investments are growing steadily.",
      rating: 5
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-garrison-green to-green-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Your Trusted Financial Partner
              </h1>
              <p className="text-xl mb-8 text-green-100">
                Garrison Financial Nexus provides comprehensive financial services including money lending, savings, wealth management, and expert advisory services.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/loan-application">
                  <Button size="lg" className="w-full sm:w-auto bg-white text-garrison-green hover:bg-gray-100">
                    Apply for Loan
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/client-registration">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-garrison-green">
                    Open Account
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img 
                src="/lovable-uploads/8514a459-83a5-4a3a-9728-47047e5e465e.png" 
                alt="Garrison Financial Nexus" 
                className="w-full h-auto rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-garrison-black mb-4">
              Our Financial Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive financial solutions tailored to meet your personal and business needs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className={`w-12 h-12 ${service.color} rounded-lg flex items-center justify-center mb-4`}>
                    <service.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to={service.link}>
                    <Button variant="outline" className="w-full">
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Client Accounts Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-garrison-black mb-4">
              Client Accounts
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of satisfied clients managing their finances with us
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-2 border-garrison-green">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-garrison-green">New Clients</CardTitle>
                <CardDescription>Register for a new client account</CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-gray-600">
                  Create your account and start your financial journey with us. Complete registration and get your account details from our manager.
                </p>
                <div className="space-y-2">
                  <Link to="/client-registration">
                    <Button className="w-full bg-garrison-green hover:bg-green-700">
                      Register New Account
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-500">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-blue-600">Existing Clients</CardTitle>
                <CardDescription>Sign in to your account</CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-gray-600">
                  Already have an account? Sign in with your account number and sign-in code to access your dashboard.
                </p>
                <div className="space-y-2">
                  <Link to="/client-signin">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Sign In to Account
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-garrison-black mb-4">
              Why Choose Garrison Financial Nexus?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're committed to providing exceptional financial services with transparency and reliability
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-garrison-green rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-garrison-black mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-garrison-black mb-4">
              What Our Clients Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real stories from real clients who trust us with their financial needs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold text-garrison-black">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-garrison-green text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Financial Journey?
          </h2>
          <p className="text-xl mb-8 text-green-100 max-w-2xl mx-auto">
            Join thousands of satisfied clients and take control of your financial future today
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/client-registration">
              <Button size="lg" className="bg-white text-garrison-green hover:bg-gray-100">
                Open Account Today
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-garrison-green">
              <MessageCircle className="mr-2 h-5 w-5" />
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
