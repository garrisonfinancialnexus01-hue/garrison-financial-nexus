
import React from 'react';
import { Link } from 'react-router-dom';
import { Building, Target, Award, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const About = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-garrison-green to-green-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Garrison Financial Nexus</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Your trusted partner in financial growth and stability since 2010.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-garrison-black">Our Story</h2>
            <div className="w-24 h-1 bg-garrison-green mx-auto mt-4 mb-6"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Established in 2010, Garrison Financial Nexus was founded with a vision to make financial services accessible to everyone in Uganda, regardless of their economic status.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow flex flex-col items-center text-center">
              <Building className="h-12 w-12 text-garrison-green mb-4" />
              <h3 className="text-xl font-bold mb-2">Our Beginning</h3>
              <p className="text-gray-600">
                Starting as a small lending service in Kampala, we've grown to become one of Uganda's most trusted financial institutions with multiple branches across the country.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow flex flex-col items-center text-center">
              <Target className="h-12 w-12 text-garrison-green mb-4" />
              <h3 className="text-xl font-bold mb-2">Our Mission</h3>
              <p className="text-gray-600">
                To empower individuals and businesses through accessible and personalized financial solutions that foster economic growth and financial independence.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow flex flex-col items-center text-center">
              <Award className="h-12 w-12 text-garrison-green mb-4" />
              <h3 className="text-xl font-bold mb-2">Our Values</h3>
              <p className="text-gray-600">
                Integrity, accessibility, innovation, and commitment to customer success drive everything we do at Garrison Financial Nexus.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Our Founder Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/3 mb-8 md:mb-0">
              <Avatar className="h-64 w-64 mx-auto">
                <AvatarImage src="/lovable-uploads/9af5ef20-55fb-4257-a41b-223fa240c5da.png" alt="Isiah Kasule" className="object-cover" />
                <AvatarFallback className="text-white text-6xl font-bold bg-garrison-green">IK</AvatarFallback>
              </Avatar>
            </div>
            <div className="md:w-2/3 md:pl-12">
              <h2 className="text-3xl font-bold text-garrison-black mb-4">Meet Our Founder</h2>
              <h3 className="text-xl font-bold text-garrison-green mb-2">Isiah Kasule</h3>
              <p className="text-gray-600 mb-6">
                Founder & CEO, Garrison Financial Nexus
              </p>
              <p className="text-gray-800 mb-6">
                With over 15 years of experience in the financial industry, Isiah Kasule founded Garrison Financial Nexus with 
                a vision to make financial services accessible to everyone. His commitment to financial inclusion and customer 
                satisfaction has established Garrison Financial Nexus as a trusted name in Uganda's financial sector.
              </p>
              <p className="text-gray-800">
                "Our mission is to empower individuals and businesses through personalized financial solutions 
                that address their unique needs and aspirations."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Goals Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-garrison-black">Our Goals</h2>
            <div className="w-24 h-1 bg-garrison-green mx-auto mt-4 mb-6"></div>
          </div>

          <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-start gap-6 bg-white p-6 rounded-lg shadow-md">
              <div className="bg-garrison-green rounded-full p-4 flex-shrink-0">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Financial Literacy</h3>
                <p className="text-gray-600">
                  By 2026, we aim to provide financial education to over 100,000 Ugandans through our workshops, online resources, and community outreach programs.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start gap-6 bg-white p-6 rounded-lg shadow-md">
              <div className="bg-garrison-green rounded-full p-4 flex-shrink-0">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Community Impact</h3>
                <p className="text-gray-600">
                  We're committed to supporting small businesses and entrepreneurs by extending our financial services to underserved areas, with a goal of opening 10 new branches in rural communities by 2025.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start gap-6 bg-white p-6 rounded-lg shadow-md">
              <div className="bg-garrison-green rounded-full p-4 flex-shrink-0">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Sustainable Growth</h3>
                <p className="text-gray-600">
                  Our long-term vision includes becoming the leading financial services provider in East Africa by 2030, while maintaining our commitment to personalized customer service and community development.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-garrison-green py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Join Our Journey?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Discover how Garrison Financial Nexus can help you achieve your financial goals.
          </p>
          <div className="flex justify-center">
            <Button asChild className="bg-white text-garrison-green hover:bg-gray-100">
              <Link to="/contact">Contact Us Today</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
