
import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, Home } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-garrison-black text-white pt-8 pb-6 sm:pt-12 sm:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Garrison Financial Nexus</h3>
            <p className="text-sm mb-3 sm:mb-4">"Your Gateway To Financial Prosperity"</p>
            <p className="text-sm">Founded by Isiah Kasule, CEO</p>
          </div>
          
          <div className="text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/money-lending" className="text-gray-300 hover:text-white text-sm">Money Lending</Link>
              </li>
              <li>
                <Link to="/money-saving" className="text-gray-300 hover:text-white text-sm">Money Saving</Link>
              </li>
              <li>
                <Link to="/financial-advisory" className="text-gray-300 hover:text-white text-sm">Financial Advisory</Link>
              </li>
              <li>
                <Link to="/wealth-management" className="text-gray-300 hover:text-white text-sm">Wealth Management</Link>
              </li>
            </ul>
          </div>
          
          <div className="text-center sm:text-left col-span-1 sm:col-span-2 lg:col-span-1">
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Contact Us</h3>
            <div className="space-y-2">
              <p className="flex items-center justify-center sm:justify-start text-sm">
                <Home className="mr-2 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <span className="break-words">Mattuga, Uganda</span>
              </p>
              <p className="flex items-center justify-center sm:justify-start text-sm">
                <Phone className="mr-2 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <span className="break-all">+256756530349 / +256761281222</span>
              </p>
              <p className="flex items-center justify-center sm:justify-start text-sm">
                <Mail className="mr-2 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <span className="break-all">garrisonfinancialnexus01@gmail.com</span>
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-700">
          <p className="text-center text-xs sm:text-sm text-gray-300 px-2">
            © {new Date().getFullYear()} Garrison Financial Nexus. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
