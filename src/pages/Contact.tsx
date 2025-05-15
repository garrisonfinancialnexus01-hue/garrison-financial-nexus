
import React from 'react';
import { Phone, Mail, MessageCircle, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Contact = () => {
  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-garrison-black mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600">
            We're here to help with all your financial needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-garrison-black mb-6">Get in Touch</h2>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <MapPin className="h-6 w-6 text-garrison-green mr-4" />
                <div>
                  <h3 className="font-semibold">Office Location</h3>
                  <p className="text-gray-600">Kisaasi, Kampala, Uganda</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Phone className="h-6 w-6 text-garrison-green mr-4" />
                <div>
                  <h3 className="font-semibold">Phone</h3>
                  <p className="text-gray-600">+256756530349 / +256761281222</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Mail className="h-6 w-6 text-garrison-green mr-4" />
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p className="text-gray-600">garrisonfinancialnexus01@gmail.com</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <MessageCircle className="h-6 w-6 text-garrison-green mr-4" />
                <div>
                  <h3 className="font-semibold">WhatsApp</h3>
                  <p className="text-gray-600">Chat with us directly</p>
                  <Button 
                    className="mt-2 bg-[#25D366] hover:bg-[#128C7E] text-white"
                    onClick={() => window.open(`https://wa.me/256756530349`, '_blank')}
                  >
                    Contact via WhatsApp
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-garrison-black mb-6">Send us a Message</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-garrison-green"
                  placeholder="Your Name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-garrison-green"
                  placeholder="your.email@example.com"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-garrison-green"
                  placeholder="Your Phone Number"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-garrison-green"
                  placeholder="How can we help you?"
                ></textarea>
              </div>
              
              <Button className="w-full bg-garrison-green hover:bg-green-700 text-white">
                Submit Message
              </Button>
            </form>
          </div>
        </div>
        
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-garrison-black mb-6 text-center">Business Hours</h2>
          <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-right font-medium">Monday - Friday:</div>
              <div>8:00 AM - 5:00 PM</div>
              <div className="text-right font-medium">Saturday:</div>
              <div>9:00 AM - 1:00 PM</div>
              <div className="text-right font-medium">Sunday:</div>
              <div>Closed</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
