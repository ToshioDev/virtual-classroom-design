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
import CategoryCourses from "./pages/courses/CategoryCourses";
import CourseDetails from "./pages/courses/CourseDetails";
import Gestion from "./pages/gestion/Gestion"; 
import AddCategory from "./pages/gestion/AddCategory"; 
import ListCategories from "./pages/gestion/ListCategories"; 
import EditCategory from "./pages/gestion/EditCategory"; 
import AddUser from "./pages/gestion/AddUser"; 
import ManageUsers from "./pages/gestion/ManageUsers";
import EditUser from "./pages/gestion/EditUser";
import AddCourse from "./pages/gestion/AddCourse";
import ListCourses from "./pages/gestion/ListCourses";
import { authService } from "./services/auth.service";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Start token validation when the app loads
    const stopTokenValidation = authService.startTokenValidation();

    // Clean up the token validation when the component unmounts
    return () => {
      stopTokenValidation();
    };
  }, []);

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
              <Route path="/topics/:categoryId" element={authService.isAuthenticated() ? <CategoryCourses /> : <Navigate to="/login" />} />
              <Route path="/topics/:categoryId/course/:courseId" element={authService.isAuthenticated() ? <CourseDetails /> : <Navigate to="/login" />} />
              <Route path="/payments" element={authService.isAuthenticated() ? <Payments /> : <Navigate to="/login" />} />
              <Route path="/profile" element={authService.isAuthenticated() ? <Profile /> : <Navigate to="/login" />} />
              <Route path="/mobile/notifications" element={authService.isAuthenticated() ? <NotificationsMobile /> : <Navigate to="/login" />} />
              <Route path="/gestion" element={authService.isAuthenticated() ? <Gestion /> : <Navigate to="/login" />} />
              <Route path="/gestion/categoria/nueva" element={authService.isAuthenticated() ? <AddCategory /> : <Navigate to="/login" />} />
              <Route path="/gestion/categorias" element={authService.isAuthenticated() ? <ListCategories /> : <Navigate to="/login" />} />
              <Route path="/gestion/categoria/editar/:categoryId" element={authService.isAuthenticated() ? <EditCategory /> : <Navigate to="/login" />} />
              <Route path="/gestion/curso/nuevo" element={authService.isAuthenticated() ? <AddCourse /> : <Navigate to="/login" />} />
              <Route path="/gestion/cursos" element={authService.isAuthenticated() ? <ListCourses /> : <Navigate to="/login" />} />
              <Route path="/gestion/usuario/nuevo" element={authService.isAuthenticated() ? <AddUser /> : <Navigate to="/login" />} />
              <Route path="/gestion/usuarios" element={authService.isAuthenticated() ? <ManageUsers /> : <Navigate to="/login" />} />
              <Route path="/gestion/usuarios/gestionar" element={authService.isAuthenticated() ? <ManageUsers /> : <Navigate to="/login" />} />
              <Route path="/gestion/usuario/editar/:userId" element={authService.isAuthenticated() ? <EditUser /> : <Navigate to="/login" />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </MainLayout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
