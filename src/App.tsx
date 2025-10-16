import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ClientAuthProvider } from "./context/ClientAuthContext";
import LoadingScreen from "./components/LoadingScreen";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import MoneyLending from "./pages/MoneyLending";
import MoneySaving from "./pages/MoneySaving";
import FinancialAdvisory from "./pages/FinancialAdvisory";
import WealthManagement from "./pages/WealthManagement";
import LoanApplication from "./pages/LoanApplication";
import LoanDetails from "./pages/LoanDetails";
import ClientTypeSelection from "./pages/ClientTypeSelection";
import RegularClientSearch from "./pages/RegularClientSearch";
import RegularClientApplication from "./pages/RegularClientApplication";
import ClientAuth from "./pages/ClientAuth";
import ClientSignup from "./pages/ClientSignup";
import SignupSuccess from "./pages/SignupSuccess";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import PasswordResetSuccess from "./pages/PasswordResetSuccess";
import ClientDashboard from "./pages/ClientDashboard";
import AccountActivation from "./pages/AccountActivation";
import VerifyMobileOtp from "./pages/VerifyMobileOtp";
import VerifyResetCode from "./pages/VerifyResetCode";
import TransactionRequest from "./pages/TransactionRequest";
import RepayLoan from "./pages/RepayLoan";
import SettleYourDebt from "./pages/SettleYourDebt";
import AdminBalanceEditor from "./pages/AdminBalanceEditor";
import LoanRepaymentReceiptPortal from "./pages/LoanRepaymentReceiptPortal";
import CentralDashboard from "./pages/CentralDashboard";
import AdminEmailPortal from "./components/AdminEmailPortal";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {isLoading ? (
          <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />
        ) : (
          <>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ClientAuthProvider>
                <Routes>
                  <Route path="/central-dashboard" element={<CentralDashboard />} />
                  <Route path="/admin-email-portal" element={<AdminEmailPortal />} />
                  <Route path="/loan-repayment-receipt" element={<LoanRepaymentReceiptPortal />} />
                  <Route element={<Layout />}>
                    <Route path="/" element={<Index />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/money-lending" element={<MoneyLending />} />
                    <Route path="/money-saving" element={<MoneySaving />} />
                    <Route path="/financial-advisory" element={<FinancialAdvisory />} />
                    <Route path="/wealth-management" element={<WealthManagement />} />
                    <Route path="/loan-application" element={<LoanApplication />} />
                    <Route path="/client-type-selection" element={<ClientTypeSelection />} />
                    <Route path="/regular-client-search" element={<RegularClientSearch />} />
                    <Route path="/regular-client-application" element={<RegularClientApplication />} />
                    <Route path="/loan-details" element={<LoanDetails />} />
                    <Route path="/client-auth" element={<ClientAuth />} />
                    <Route path="/client-signup" element={<ClientSignup />} />
                    <Route path="/signup-success" element={<SignupSuccess />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/password-reset-success" element={<PasswordResetSuccess />} />
                    <Route path="/client-dashboard" element={<ClientDashboard />} />
                    <Route path="/account-activation" element={<AccountActivation />} />
                    <Route path="/verify-mobile-otp" element={<VerifyMobileOtp />} />
                    <Route path="/verify-reset-code" element={<VerifyResetCode />} />
                    <Route path="/transaction-request" element={<TransactionRequest />} />
                    <Route path="/repay-loan" element={<RepayLoan />} />
                    <Route path="/settle-your-debt" element={<SettleYourDebt />} />
                    <Route path="/admin-balance-editor" element={<AdminBalanceEditor />} />
                    <Route path="/loan-repayment-receipt-portal" element={<LoanRepaymentReceiptPortal />} />
                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Routes>
              </ClientAuthProvider>
            </BrowserRouter>
          </>
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
