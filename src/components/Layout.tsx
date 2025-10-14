
import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import BottomNav from './BottomNav';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 pb-32">
        <Outlet />
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
};

export default Layout;
