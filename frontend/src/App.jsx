import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import LandingPage from "./pages/user/LandingPage";
import AuthPage from "./pages/user/AuthPage";
import DashboardPage from "./pages/user/DashboardPage";
import EligibilityPage from "./pages/user/EligibilityPage";
import SubmitPage from "./pages/user/SubmitPage";
import ProfilePage from "./pages/user/ProfilePage";
import PortalsPage from "./pages/user/PortalsPage";
import NotFound from "./pages/user/NotFound";
import GuidePage from "./pages/user/GuidePage";
import GuideSelectionPage from "./pages/user/GuideSelectionPage";
import InteractiveGuide from "./pages/user/InteractiveGuide";
import AdminDashboard from "./pages/admin/Dashboard";
import ManageForms from "./pages/admin/ManageForms";
import ManageUsers from "./pages/admin/ManageUsers";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/ user/eligibility" element={<EligibilityPage />} />
              <Route path="/user/submit" element={<SubmitPage />} />
              <Route path="/user/profile" element={<ProfilePage />} />
              <Route path="/user/portals" element={<PortalsPage />} />
              <Route path="/user/dashboard" element={<DashboardPage />} />
              <Route path="/user/guide" element={<GuideSelectionPage />} />
              <Route path="/user/guide/citizenship" element={<InteractiveGuide formName="Citizenship Form" />} />
              <Route path="/user/guide/passport" element={< interactiveGuide formName="Passport Form" />} />
              <Route path="/user/guide/license" element={<InteractiveGuide formName="Driving License Form" />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/manage-forms" element={<ManageForms />} />
              <Route path="/admin/manage-users" element={<ManageUsers />} />
              <Route path="/user/guide" element={<GuideSelectionPage />} />
              <Route path="/user/guide/citizenship" element={<InteractiveGuide formName="Citizenship Form" />} />
              <Route path="/user/guide/passport" element={<InteractiveGuide formName="Passport Form" />} />
              <Route path="/user/guide/license" element={<InteractiveGuide formName="Driving License Form" />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
