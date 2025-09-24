
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, MessageSquare, Users } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center min-w-0 flex-1">
              <Link to="/" className="flex items-center min-w-0">
                <img 
                  src="/lovable-uploads/604aab9b-7408-4586-8092-31a6a8e6642f.png" 
                  alt="Garrison Financial Nexus Logo" 
                  className="h-8 sm:h-10 lg:h-12 w-auto mr-2 sm:mr-3 flex-shrink-0" 
                />
                <span className="text-lg sm:text-xl lg:text-2xl font-bold text-garrison-black truncate">
                  Garrison Financial Nexus
                </span>
              </Link>
            </div>
            
            <div className="flex items-center">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-garrison-black hover:text-garrison-green focus:outline-none transition-colors duration-200"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Menu backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 animate-fade-in"
          onClick={closeMenu}
        />
      )}
      
      {/* Professional menu drawer */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-garrison-green to-garrison-light">
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/604aab9b-7408-4586-8092-31a6a8e6642f.png" 
                alt="Logo" 
                className="h-8 w-auto mr-2" 
              />
              <span className="text-white font-bold text-lg">Menu</span>
            </div>
            <button
              onClick={closeMenu}
              className="p-2 rounded-full hover:bg-white/20 transition-colors duration-200"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>
          
          {/* Menu Content */}
          <div className="flex-1 overflow-y-auto py-6">
            <div className="px-6 space-y-2">
              <Link 
                to="/" 
                className="flex items-center px-4 py-3 rounded-lg text-garrison-black hover:bg-garrison-light hover:text-garrison-green transition-all duration-200 font-medium group"
                onClick={closeMenu}
              >
                <div className="w-1 h-6 bg-garrison-green rounded-full mr-3 group-hover:h-8 transition-all duration-200"></div>
                Home
              </Link>
              
              {/* Services Section */}
              <div className="pt-4">
                <div className="px-4 py-2 text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Services
                </div>
                <div className="space-y-1 ml-4">
                  <Link 
                    to="/money-lending" 
                    className="flex items-center px-4 py-3 rounded-lg text-garrison-black hover:bg-garrison-light hover:text-garrison-green transition-all duration-200 group"
                    onClick={closeMenu}
                  >
                    <div className="w-2 h-2 bg-garrison-green rounded-full mr-3 group-hover:scale-150 transition-transform duration-200"></div>
                    Money Lending
                  </Link>
                  <Link 
                    to="/money-saving" 
                    className="flex items-center px-4 py-3 rounded-lg text-garrison-black hover:bg-garrison-light hover:text-garrison-green transition-all duration-200 group"
                    onClick={closeMenu}
                  >
                    <div className="w-2 h-2 bg-garrison-green rounded-full mr-3 group-hover:scale-150 transition-transform duration-200"></div>
                    Money Saving
                  </Link>
                  <Link 
                    to="/financial-advisory" 
                    className="flex items-center px-4 py-3 rounded-lg text-garrison-black hover:bg-garrison-light hover:text-garrison-green transition-all duration-200 group"
                    onClick={closeMenu}
                  >
                    <div className="w-2 h-2 bg-garrison-green rounded-full mr-3 group-hover:scale-150 transition-transform duration-200"></div>
                    Financial Advisory
                  </Link>
                  <Link 
                    to="/wealth-management" 
                    className="flex items-center px-4 py-3 rounded-lg text-garrison-black hover:bg-garrison-light hover:text-garrison-green transition-all duration-200 group"
                    onClick={closeMenu}
                  >
                    <div className="w-2 h-2 bg-garrison-green rounded-full mr-3 group-hover:scale-150 transition-transform duration-200"></div>
                    Wealth Management
                  </Link>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="pt-4">
                <div className="px-4 py-2 text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Quick Actions
                </div>
                <Link 
                  to="/repay-loan"
                  className="flex items-center px-4 py-3 rounded-lg text-garrison-black hover:bg-garrison-light hover:text-garrison-green transition-all duration-200 font-medium group"
                  onClick={closeMenu}
                >
                  <MessageSquare className="h-5 w-5 mr-3 text-garrison-green group-hover:scale-110 transition-transform duration-200" />
                  Repay Your Loan
                </Link>
                <Link 
                  to="/client-auth" 
                  className="flex items-center px-4 py-3 rounded-lg text-garrison-black hover:bg-garrison-light hover:text-garrison-green transition-all duration-200 font-medium group"
                  onClick={closeMenu}
                >
                  <Users className="h-5 w-5 mr-3 text-garrison-green group-hover:scale-110 transition-transform duration-200" />
                  Client Accounts
                </Link>
              </div>
              
              {/* Information */}
              <div className="pt-4">
                <div className="px-4 py-2 text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Information
                </div>
                <Link 
                  to="/about" 
                  className="flex items-center px-4 py-3 rounded-lg text-garrison-black hover:bg-garrison-light hover:text-garrison-green transition-all duration-200 font-medium group"
                  onClick={closeMenu}
                >
                  <div className="w-1 h-6 bg-garrison-green rounded-full mr-3 group-hover:h-8 transition-all duration-200"></div>
                  About
                </Link>
                <Link 
                  to="/contact" 
                  className="flex items-center px-4 py-3 rounded-lg text-garrison-black hover:bg-garrison-light hover:text-garrison-green transition-all duration-200 font-medium group"
                  onClick={closeMenu}
                >
                  <div className="w-1 h-6 bg-garrison-green rounded-full mr-3 group-hover:h-8 transition-all duration-200"></div>
                  Contact
                </Link>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="text-center text-sm text-gray-600">
              © 2024 Garrison Financial Nexus
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
