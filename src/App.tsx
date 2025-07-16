
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ClientAuthProvider } from "./context/ClientAuthContext";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import MoneySaving from "./pages/MoneySaving";
import MoneyLending from "./pages/MoneyLending";
import WealthManagement from "./pages/WealthManagement";
import FinancialAdvisory from "./pages/FinancialAdvisory";
import LoanApplication from "./pages/LoanApplication";
import ClientSignup from "./pages/ClientSignup";
import ClientAuth from "./pages/ClientAuth";
import ClientDashboard from "./pages/ClientDashboard";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyResetCode from "./pages/VerifyResetCode";
import ResetPassword from "./pages/ResetPassword";
import PasswordResetSuccess from "./pages/PasswordResetSuccess";
import SignupSuccess from "./pages/SignupSuccess";
import AccountActivation from "./pages/AccountActivation";
import VerifyMobileOtp from "./pages/VerifyMobileOtp";
import TransactionRequest from "./pages/TransactionRequest";
import LoanDetails from "./pages/LoanDetails";
import RepayLoan from "./pages/RepayLoan";
import SettleYourDebt from "./pages/SettleYourDebt";
import NotFound from "./pages/NotFound";
import AdminBalanceEditor from "./pages/AdminBalanceEditor";
import MobileMoneyDashboard from "./pages/MobileMoneyDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ClientAuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/money-saving" element={<MoneySaving />} />
              <Route path="/money-lending" element={<MoneyLending />} />
              <Route path="/wealth-management" element={<WealthManagement />} />
              <Route path="/financial-advisory" element={<FinancialAdvisory />} />
              <Route path="/loan-application" element={<LoanApplication />} />
              <Route path="/client-signup" element={<ClientSignup />} />
              <Route path="/client-auth" element={<ClientAuth />} />
              <Route path="/client-dashboard" element={<ClientDashboard />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/verify-reset-code" element={<VerifyResetCode />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/password-reset-success" element={<PasswordResetSuccess />} />
              <Route path="/signup-success" element={<SignupSuccess />} />
              <Route path="/account-activation" element={<AccountActivation />} />
              <Route path="/verify-mobile-otp" element={<VerifyMobileOtp />} />
              <Route path="/transaction-request" element={<TransactionRequest />} />
              <Route path="/loan-details" element={<LoanDetails />} />
              <Route path="/repay-loan" element={<RepayLoan />} />
              <Route path="/settle-debt" element={<SettleYourDebt />} />
              <Route path="/admin-balance-editor" element={<AdminBalanceEditor />} />
              <Route path="/mobile-money" element={<MobileMoneyDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </ClientAuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
