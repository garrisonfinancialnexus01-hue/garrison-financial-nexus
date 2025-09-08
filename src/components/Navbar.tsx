
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
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between h-14 sm:h-16">
          <div className="flex items-center min-w-0 flex-1">
            <Link to="/" className="flex-shrink-0 flex items-center min-w-0">
              <img 
                src="/lovable-uploads/604aab9b-7408-4586-8092-31a6a8e6642f.png" 
                alt="Garrison Financial Nexus Logo" 
                className="h-8 sm:h-10 w-auto mr-1 sm:mr-2 flex-shrink-0" 
              />
              <span className="text-sm sm:text-lg lg:text-xl font-bold text-garrison-black truncate">
                <span className="hidden sm:inline">Garrison Financial Nexus</span>
                <span className="sm:hidden">GFN</span>
              </span>
            </Link>
          </div>
          
          <div className="hidden lg:flex items-center space-x-4 xl:space-x-6">
            <Link to="/" className="text-garrison-black hover:text-garrison-green font-medium text-sm xl:text-base">Home</Link>
            <div className="relative group">
              <button className="text-garrison-black hover:text-garrison-green font-medium text-sm xl:text-base">Services</button>
              <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition duration-300 z-50">
                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                  <Link to="/money-lending" className="block px-4 py-2 text-sm text-gray-700 hover:bg-garrison-light hover:text-garrison-green" role="menuitem">Money Lending</Link>
                  <Link to="/money-saving" className="block px-4 py-2 text-sm text-gray-700 hover:bg-garrison-light hover:text-garrison-green" role="menuitem">Money Saving</Link>
                  <Link to="/financial-advisory" className="block px-4 py-2 text-sm text-gray-700 hover:bg-garrison-light hover:text-garrison-green" role="menuitem">Financial Advisory</Link>
                  <Link to="/wealth-management" className="block px-4 py-2 text-sm text-gray-700 hover:bg-garrison-light hover:text-garrison-green" role="menuitem">Wealth Management</Link>
                </div>
              </div>
            </div>
            <Link 
              to="/repay-loan"
              className="flex items-center text-garrison-black hover:text-garrison-green font-medium text-sm xl:text-base"
            >
              <MessageSquare className="h-3 w-3 xl:h-4 xl:w-4 mr-1" />
              <span className="hidden xl:inline">Repay Your Loan</span>
              <span className="xl:hidden">Repay</span>
            </Link>
            <Link 
              to="/client-auth" 
              className="flex items-center text-garrison-black hover:text-garrison-green font-medium text-sm xl:text-base"
            >
              <Users className="h-3 w-3 xl:h-4 xl:w-4 mr-1" />
              <span className="hidden xl:inline">Clients Accounts</span>
              <span className="xl:hidden">Clients</span>
            </Link>
            <Link to="/about" className="text-garrison-black hover:text-garrison-green font-medium text-sm xl:text-base">About</Link>
            <Link to="/contact" className="text-garrison-black hover:text-garrison-green font-medium text-sm xl:text-base">Contact</Link>
          </div>
          
          <div className="lg:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-1.5 sm:p-2 rounded-md text-garrison-black hover:text-garrison-green focus:outline-none transition-colors"
            >
              {isOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t">
          <div className="px-3 pt-2 pb-3 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
            <Link 
              to="/" 
              className="block px-3 py-3 rounded-md text-base font-medium text-garrison-black hover:text-garrison-green hover:bg-gray-50 transition-colors"
              onClick={closeMenu}
            >
              Home
            </Link>
            <div className="block">
              <div className="px-3 py-3 text-base font-medium text-garrison-black">Services</div>
              <div className="pl-6 space-y-1">
                <Link 
                  to="/money-lending" 
                  className="block px-3 py-2 rounded-md text-sm text-garrison-black hover:text-garrison-green hover:bg-gray-50 transition-colors"
                  onClick={closeMenu}
                >
                  Money Lending
                </Link>
                <Link 
                  to="/money-saving" 
                  className="block px-3 py-2 rounded-md text-sm text-garrison-black hover:text-garrison-green hover:bg-gray-50 transition-colors"
                  onClick={closeMenu}
                >
                  Money Saving
                </Link>
                <Link 
                  to="/financial-advisory" 
                  className="block px-3 py-2 rounded-md text-sm text-garrison-black hover:text-garrison-green hover:bg-gray-50 transition-colors"
                  onClick={closeMenu}
                >
                  Financial Advisory
                </Link>
                <Link 
                  to="/wealth-management" 
                  className="block px-3 py-2 rounded-md text-sm text-garrison-black hover:text-garrison-green hover:bg-gray-50 transition-colors"
                  onClick={closeMenu}
                >
                  Wealth Management
                </Link>
              </div>
            </div>
            <Link 
              to="/repay-loan"
              className="flex items-center px-3 py-3 rounded-md text-base font-medium text-garrison-black hover:text-garrison-green hover:bg-gray-50 transition-colors"
              onClick={closeMenu}
            >
              <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0" />
              Repay Your Loan
            </Link>
            <Link 
              to="/client-auth" 
              className="flex items-center px-3 py-3 rounded-md text-base font-medium text-garrison-black hover:text-garrison-green hover:bg-gray-50 transition-colors"
              onClick={closeMenu}
            >
              <Users className="h-4 w-4 mr-2 flex-shrink-0" />
              Clients Accounts
            </Link>
            <Link 
              to="/about" 
              className="block px-3 py-3 rounded-md text-base font-medium text-garrison-black hover:text-garrison-green hover:bg-gray-50 transition-colors"
              onClick={closeMenu}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className="block px-3 py-3 rounded-md text-base font-medium text-garrison-black hover:text-garrison-green hover:bg-gray-50 transition-colors"
              onClick={closeMenu}
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
