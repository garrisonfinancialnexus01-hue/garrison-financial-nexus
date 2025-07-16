import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { Menu, X, ChevronDown, Building2, Smartphone } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { 
    name: 'About', 
    href: '/about',
    description: 'Learn about Garrison Financial Nexus and our mission to provide accessible financial services in Uganda.'
  },
  { 
    name: 'Money Saving', 
    href: '/money-saving',
    description: 'Secure savings accounts with competitive interest rates and flexible terms.'
  },
  { 
    name: 'Money Lending', 
    href: '/money-lending',
    description: 'Quick and affordable loans with transparent terms and fast approval.'
  },
  { 
    name: 'Mobile Money', 
    href: '/mobile-money',
    description: 'Send and receive money using Airtel and MTN Mobile Money integration.'
  },
  { 
    name: 'Wealth Management', 
    href: '/wealth-management',
    description: 'Professional wealth management services to grow and protect your assets.'
  },
  { 
    name: 'Financial Advisory', 
    href: '/financial-advisory',
    description: 'Expert financial advice and planning services for your future.'
  },
  { 
    name: 'Contact', 
    href: '/contact',
    description: 'Get in touch with our team for support or inquiries about our services.'
  }
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-garrison-green" />
            <span className="text-xl font-bold text-garrison-black">
              Garrison Financial Nexus
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <NavigationMenu>
              <NavigationMenuList>
                {navItems.map((item) => (
                  <NavigationMenuItem key={item.name}>
                    <NavigationMenuTrigger 
                      className={cn(
                        "text-garrison-black hover:text-garrison-green transition-colors",
                        isActive(item.href) && "text-garrison-green"
                      )}
                    >
                      <Link to={item.href} className="flex items-center gap-2">
                        {item.name === 'Mobile Money' && <Smartphone className="h-4 w-4" />}
                        {item.name}
                      </Link>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="w-96 p-4">
                        <div className="space-y-2">
                          <h4 className="font-medium text-garrison-black">{item.name}</h4>
                          <p className="text-sm text-gray-600">{item.description}</p>
                          <Link 
                            to={item.href}
                            className="inline-flex items-center text-sm text-garrison-green hover:text-garrison-green/80 font-medium"
                          >
                            Learn more →
                          </Link>
                        </div>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>

            <div className="flex items-center space-x-4">
              <Link to="/client-auth">
                <Button variant="outline" className="border-garrison-green text-garrison-green hover:bg-garrison-green hover:text-white">
                  Client Login
                </Button>
              </Link>
              <Link to="/client-signup">
                <Button className="bg-garrison-green hover:bg-garrison-green/90 text-white">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 mt-8">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-lg text-garrison-black hover:bg-gray-100 transition-colors",
                        isActive(item.href) && "bg-garrison-green/10 text-garrison-green"
                      )}
                    >
                      {item.name === 'Mobile Money' && <Smartphone className="h-4 w-4" />}
                      {item.name}
                    </Link>
                  ))}
                  
                  <div className="border-t pt-4 space-y-2">
                    <Link to="/client-auth" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full border-garrison-green text-garrison-green hover:bg-garrison-green hover:text-white">
                        Client Login
                      </Button>
                    </Link>
                    <Link to="/client-signup" onClick={() => setIsOpen(false)}>
                      <Button className="w-full bg-garrison-green hover:bg-garrison-green/90 text-white">
                        Get Started
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
