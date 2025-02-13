import { useState, useEffect } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/auth/Login";
import NotFound from "./pages/NotFound";
import MainLayout from "./components/layouts/MainLayout";
import Topics from "./pages/categories/Categories";
import CourseDetail from "./pages/courses/CourseDetail";
import Dashboard from "./pages/dashboard/Dashboard";
import Payments from "./pages/payments/Payments";
import NotificationsMobile from "./pages/mobile/NotificationsMobile";
import Profile from "./pages/profile/Profile";
import { authService } from "./services/auth.service";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <MainLayout>
            <Routes>
              <Route path="/" element={authService.isAuthenticated() ? <Navigate to="/dashboard" /> : <Index />} />
              <Route path="/login" element={authService.isAuthenticated() ? <Navigate to="/dashboard" /> : <Login />} />
              <Route path="/dashboard" element={authService.isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />} />
              <Route path="/topics" element={authService.isAuthenticated() ? <Topics /> : <Navigate to="/login" />} />
              <Route path="/course/:id" element={authService.isAuthenticated() ? <CourseDetail /> : <Navigate to="/login" />} />
              <Route path="/payments" element={authService.isAuthenticated() ? <Payments /> : <Navigate to="/login" />} />
              <Route path="/profile" element={authService.isAuthenticated() ? <Profile /> : <Navigate to="/login" />} />
              <Route path="/mobile/notifications" element={authService.isAuthenticated() ? <NotificationsMobile /> : <Navigate to="/login" />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </MainLayout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
