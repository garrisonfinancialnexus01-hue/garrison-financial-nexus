
import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, Home } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-garrison-black text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Garrison Financial Nexus</h3>
            <p className="text-sm mb-4">"Your Gateway To Financial Prosperity"</p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/money-lending" className="text-gray-300 hover:text-white">Money Lending</Link>
              </li>
              <li>
                <Link to="/money-saving" className="text-gray-300 hover:text-white">Money Saving</Link>
              </li>
              <li>
                <Link to="/financial-advisory" className="text-gray-300 hover:text-white">Financial Advisory</Link>
              </li>
              <li>
                <Link to="/wealth-management" className="text-gray-300 hover:text-white">Wealth Management</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <div className="space-y-2">
              <p className="flex items-center text-sm">
                <Home className="mr-2 h-5 w-5" />
                Mattuga, Uganda
              </p>
              <p className="flex items-center text-sm">
                <Phone className="mr-2 h-5 w-5" />
                +256756530349 / +256761281222
              </p>
              <p className="flex items-center text-sm">
                <Mail className="mr-2 h-5 w-5" />
                garrisonfinancialnexus01@gmail.com
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-700">
          <p className="text-center text-sm text-gray-300">
            © {new Date().getFullYear()} Garrison Financial Nexus. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
