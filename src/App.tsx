
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ClientAuthProvider } from "@/context/ClientAuthContext";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/central-dashboard" element={<CentralDashboard />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/money-lending" element={<MoneyLending />} />
            <Route path="/money-saving" element={<MoneySaving />} />
            <Route path="/financial-advisory" element={<FinancialAdvisory />} />
            <Route path="/wealth-management" element={<WealthManagement />} />
            <Route path="/loan-application" element={<LoanApplication />} />
            <Route path="/loan-details" element={<LoanDetails />} />
            <Route path="/signup-success" element={<SignupSuccess />} />
            <Route path="/admin-balance-editor" element={<AdminBalanceEditor />} />
            <Route path="/loan-repayment-receipt-portal" element={<LoanRepaymentReceiptPortal />} />
            <Route path="*" element={<NotFound />} />
            
            {/* Client Authentication Routes - Wrapped with ClientAuthProvider */}
            <Route path="/client-auth" element={
              <ClientAuthProvider>
                <ClientAuth />
              </ClientAuthProvider>
            } />
            <Route path="/client-signup" element={
              <ClientAuthProvider>
                <ClientSignup />
              </ClientAuthProvider>
            } />
            <Route path="/forgot-password" element={
              <ClientAuthProvider>
                <ForgotPassword />
              </ClientAuthProvider>
            } />
            <Route path="/reset-password" element={
              <ClientAuthProvider>
                <ResetPassword />
              </ClientAuthProvider>
            } />
            <Route path="/password-reset-success" element={
              <ClientAuthProvider>
                <PasswordResetSuccess />
              </ClientAuthProvider>
            } />
            <Route path="/client-dashboard" element={
              <ClientAuthProvider>
                <ClientDashboard />
              </ClientAuthProvider>
            } />
            <Route path="/account-activation" element={
              <ClientAuthProvider>
                <AccountActivation />
              </ClientAuthProvider>
            } />
            <Route path="/verify-mobile-otp" element={
              <ClientAuthProvider>
                <VerifyMobileOtp />
              </ClientAuthProvider>
            } />
            <Route path="/verify-reset-code" element={
              <ClientAuthProvider>
                <VerifyResetCode />
              </ClientAuthProvider>
            } />
            <Route path="/transaction-request" element={
              <ClientAuthProvider>
                <TransactionRequest />
              </ClientAuthProvider>
            } />
            <Route path="/repay-loan" element={
              <ClientAuthProvider>
                <RepayLoan />
              </ClientAuthProvider>
            } />
            <Route path="/settle-your-debt" element={
              <ClientAuthProvider>
                <SettleYourDebt />
              </ClientAuthProvider>
            } />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
