
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import MoneyLending from "./pages/MoneyLending";
import MoneySaving from "./pages/MoneySaving";
import FinancialAdvisory from "./pages/FinancialAdvisory";
import WealthManagement from "./pages/WealthManagement";
import LoanApplication from "./pages/LoanApplication";
import LoanDetails from "./pages/LoanDetails";
import Contact from "./pages/Contact";
import About from "./pages/About";
import SettleYourDebt from "./pages/SettleYourDebt";
import RepayLoan from "./pages/RepayLoan";
import ClientAuth from "./pages/ClientAuth";
import ClientSignup from "./pages/ClientSignup";
import SignupSuccess from "./pages/SignupSuccess";
import ClientDashboard from "./pages/ClientDashboard";
import TransactionRequest from "./pages/TransactionRequest";
import { ClientAuthProvider } from "./context/ClientAuthContext";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <ClientAuthProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Layout><Index /></Layout>} />
                <Route path="/money-lending" element={<Layout><MoneyLending /></Layout>} />
                <Route path="/money-saving" element={<Layout><MoneySaving /></Layout>} />
                <Route path="/financial-advisory" element={<Layout><FinancialAdvisory /></Layout>} />
                <Route path="/wealth-management" element={<Layout><WealthManagement /></Layout>} />
                <Route path="/loan-application" element={<Layout><LoanApplication /></Layout>} />
                <Route path="/loan-details" element={<Layout><LoanDetails /></Layout>} />
                <Route path="/settle-your-debt" element={<Layout><SettleYourDebt /></Layout>} />
                <Route path="/repay-loan" element={<Layout><RepayLoan /></Layout>} />
                <Route path="/contact" element={<Layout><Contact /></Layout>} />
                <Route path="/about" element={<Layout><About /></Layout>} />
                <Route path="/client-auth" element={<ClientAuth />} />
                <Route path="/client-signup" element={<ClientSignup />} />
                <Route path="/signup-success" element={<SignupSuccess />} />
                <Route path="/client-dashboard" element={<ClientDashboard />} />
                <Route path="/transaction-request" element={<TransactionRequest />} />
                <Route path="*" element={<Layout><NotFound /></Layout>} />
              </Routes>
            </BrowserRouter>
          </ClientAuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
