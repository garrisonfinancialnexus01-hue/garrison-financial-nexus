
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ClientAuthProvider } from "@/context/ClientAuthContext";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import MoneyLending from "./pages/MoneyLending";
import MoneySaving from "./pages/MoneySaving";
import WealthManagement from "./pages/WealthManagement";
import FinancialAdvisory from "./pages/FinancialAdvisory";
import LoanApplication from "./pages/LoanApplication";
import LoanDetails from "./pages/LoanDetails";
import RepayLoan from "./pages/RepayLoan";
import SettleYourDebt from "./pages/SettleYourDebt";
import TransactionRequest from "./pages/TransactionRequest";
import NotFound from "./pages/NotFound";
import ClientAuth from "./pages/ClientAuth";
import ClientSignup from "./pages/ClientSignup";
import SignupSuccess from "./pages/SignupSuccess";
import ClientDashboard from "./pages/ClientDashboard";
// New client accounts system
import ClientRegistration from "./pages/ClientRegistration";
import RegistrationSuccess from "./pages/RegistrationSuccess";
import ClientSignIn from "./pages/ClientSignIn";
import ClientDashboardNew from "./pages/ClientDashboardNew";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ClientAuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/money-lending" element={<MoneyLending />} />
              <Route path="/money-saving" element={<MoneySaving />} />
              <Route path="/wealth-management" element={<WealthManagement />} />
              <Route path="/financial-advisory" element={<FinancialAdvisory />} />
              <Route path="/loan-application" element={<LoanApplication />} />
              <Route path="/loan-details" element={<LoanDetails />} />
              <Route path="/repay-loan" element={<RepayLoan />} />
              <Route path="/settle-debt" element={<SettleYourDebt />} />
              <Route path="/transaction-request" element={<TransactionRequest />} />
              
              {/* Old client system (still functional) */}
              <Route path="/client-auth" element={<ClientAuth />} />
              <Route path="/client-signup" element={<ClientSignup />} />
              <Route path="/signup-success" element={<SignupSuccess />} />
              <Route path="/client-dashboard" element={<ClientDashboard />} />
              
              {/* New client accounts system */}
              <Route path="/client-registration" element={<ClientRegistration />} />
              <Route path="/registration-success" element={<RegistrationSuccess />} />
              <Route path="/client-signin" element={<ClientSignIn />} />
              <Route path="/client-dashboard-new" element={<ClientDashboardNew />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ClientAuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
