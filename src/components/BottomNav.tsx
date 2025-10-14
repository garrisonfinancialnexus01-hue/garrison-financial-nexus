import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Banknote, PiggyBank, TrendingUp, Gem, CreditCard, Users, Info, MessageSquare } from 'lucide-react';

const BottomNav = () => {
  const [activeTab, setActiveTab] = useState<'services' | 'actions' | 'info'>('services');
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const services = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/money-lending', icon: Banknote, label: 'Lending' },
    { to: '/money-saving', icon: PiggyBank, label: 'Saving' },
    { to: '/financial-advisory', icon: TrendingUp, label: 'Advisory' },
    { to: '/wealth-management', icon: Gem, label: 'Wealth' },
  ];

  const actions = [
    { to: '/repay-loan', icon: CreditCard, label: 'Repay Loan' },
    { to: '/client-auth', icon: Users, label: 'Client Portal' },
  ];

  const info = [
    { to: '/about', icon: Info, label: 'About' },
    { to: '/contact', icon: MessageSquare, label: 'Contact' },
  ];

  const getCurrentItems = () => {
    switch (activeTab) {
      case 'services':
        return services;
      case 'actions':
        return actions;
      case 'info':
        return info;
      default:
        return services;
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
      {/* Navigation Items */}
      <div className="flex items-center justify-around px-2 py-3 border-b border-gray-200">
        {getCurrentItems().map((item) => {
          const Icon = item.icon;
          const active = isActive(item.to);
          
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center justify-center min-w-[64px] px-3 py-2 rounded-xl transition-all duration-300 ${
                active 
                  ? 'bg-garrison-green text-white scale-110 shadow-lg' 
                  : 'text-garrison-black hover:bg-garrison-light hover:text-garrison-green'
              }`}
            >
              <Icon className={`h-5 w-5 mb-1 transition-transform duration-300 ${active ? 'scale-110' : ''}`} />
              <span className={`text-xs font-medium ${active ? 'font-bold' : ''}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center justify-around bg-gradient-to-r from-garrison-green to-garrison-green/90">
        <button
          onClick={() => setActiveTab('services')}
          className={`flex-1 py-3 text-sm font-semibold transition-all duration-300 ${
            activeTab === 'services'
              ? 'text-white bg-white/20 border-t-2 border-white'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          Services
        </button>
        <button
          onClick={() => setActiveTab('actions')}
          className={`flex-1 py-3 text-sm font-semibold transition-all duration-300 ${
            activeTab === 'actions'
              ? 'text-white bg-white/20 border-t-2 border-white'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          Quick Actions
        </button>
        <button
          onClick={() => setActiveTab('info')}
          className={`flex-1 py-3 text-sm font-semibold transition-all duration-300 ${
            activeTab === 'info'
              ? 'text-white bg-white/20 border-t-2 border-white'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          Information
        </button>
      </div>
    </div>
  );
};

export default BottomNav;
