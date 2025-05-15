
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="marquee-container bg-primary text-white py-2 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap">
          <p className="inline-block animate-marquee">
            Welcome to Garrison Financial Nexus, we offer mainly four services which include; Money Lending, Money Saving, Financial Advisory and Wealth Management. We offer the best services anyone could wish to get. Thank you!
          </p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-garrison-green">Garrison</span>
              <span className="text-2xl font-bold text-garrison-black">Financial</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-garrison-black hover:text-garrison-green font-medium">Home</Link>
            <div className="relative group">
              <button className="text-garrison-black hover:text-garrison-green font-medium">Services</button>
              <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition duration-300 z-50">
                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                  <Link to="/money-lending" className="block px-4 py-2 text-sm text-gray-700 hover:bg-garrison-light hover:text-garrison-green" role="menuitem">Money Lending</Link>
                  <Link to="/money-saving" className="block px-4 py-2 text-sm text-gray-700 hover:bg-garrison-light hover:text-garrison-green" role="menuitem">Money Saving</Link>
                  <Link to="/financial-advisory" className="block px-4 py-2 text-sm text-gray-700 hover:bg-garrison-light hover:text-garrison-green" role="menuitem">Financial Advisory</Link>
                  <Link to="/wealth-management" className="block px-4 py-2 text-sm text-gray-700 hover:bg-garrison-light hover:text-garrison-green" role="menuitem">Wealth Management</Link>
                </div>
              </div>
            </div>
            <Link to="/about" className="text-garrison-black hover:text-garrison-green font-medium">About</Link>
            <Link to="/contact" className="text-garrison-black hover:text-garrison-green font-medium">Contact</Link>
          </div>
          
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-garrison-black hover:text-garrison-green focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-garrison-black hover:text-garrison-green">Home</Link>
            <div className="block px-3 py-2 rounded-md text-base font-medium text-garrison-black">
              <span>Services</span>
              <div className="pl-4 mt-2 space-y-2">
                <Link to="/money-lending" className="block px-3 py-2 rounded-md text-sm text-garrison-black hover:text-garrison-green">Money Lending</Link>
                <Link to="/money-saving" className="block px-3 py-2 rounded-md text-sm text-garrison-black hover:text-garrison-green">Money Saving</Link>
                <Link to="/financial-advisory" className="block px-3 py-2 rounded-md text-sm text-garrison-black hover:text-garrison-green">Financial Advisory</Link>
                <Link to="/wealth-management" className="block px-3 py-2 rounded-md text-sm text-garrison-black hover:text-garrison-green">Wealth Management</Link>
              </div>
            </div>
            <Link to="/about" className="block px-3 py-2 rounded-md text-base font-medium text-garrison-black hover:text-garrison-green">About</Link>
            <Link to="/contact" className="block px-3 py-2 rounded-md text-base font-medium text-garrison-black hover:text-garrison-green">Contact</Link>
          </div>
        </div>
      )}

      <style jsx>{`
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
