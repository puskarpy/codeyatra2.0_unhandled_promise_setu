import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import  Navbar  from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

import {SubmitPage, PortalsPage, ProfilePage, AuthPage, 
        LandingPage, DashboardPage, NotFound, GuideSelectionPage, 
        InteractiveGuide, BookAppointmentPage} 
        from "./pages/user/index.js"

import {Analytics, Dashboard, ManageApplications, ManageUsers, 
        ManageAppointments, ManageForms, ManagePortals, 
        ManageSchemes, Settings} from './pages/admin/index.js'

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
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPage />} />
              
              {/* User Routes */}
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/submit" element={<SubmitPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/portals" element={<PortalsPage />} />
              <Route path="/appointment" element={<BookAppointmentPage/>}/>
              <Route path="/guide" element={<GuideSelectionPage />} />
              <Route path="/guide/citizenship" element={<InteractiveGuide formName="Citizenship Form" />} />
              <Route path="/guide/passport" element={<InteractiveGuide formName="Passport Form" />} />
              <Route path="/guide/license" element={<InteractiveGuide formName="Driving License Form" />} />
              
              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/users" element={<ManageUsers />} />
              <Route path="/admin/forms" element={<ManageForms />} />
              <Route path="/admin/applications" element={<ManageApplications />} />
              <Route path="/admin/appointments" element={<ManageAppointments />} />
              <Route path="/admin/portals" element={<ManagePortals />} />
              <Route path="/admin/schemes" element={<ManageSchemes />} />
              <Route path="/admin/analytics" element={<Analytics />} />
              <Route path="/admin/settings" element={<Settings />} />
              
              {/* 404 */}
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
