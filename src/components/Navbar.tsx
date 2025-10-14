
import React from 'react';
import { Link } from 'react-router-dom';
import garrisonFullLogo from '@/assets/garrison-full-logo.png';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-24 sm:h-28 lg:h-32">
          <Link to="/" className="flex items-center">
            <img 
              src={garrisonFullLogo} 
              alt="Garrison Financial Nexus - Your Gateway To Financial Prosperity" 
              className="h-20 sm:h-24 lg:h-28 w-auto" 
            />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
