import { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/ui/theme-provider";
import Navbar from "@/components/Navbar";
import NavbarMobile from "@/components/NavbarMobile";
import TopNavbarMobile from "@/components/TopNavbarMobile";
import { Toaster as Sonner } from "sonner";
import Spinner from "@/components/ui/Spinner";

const isAuthenticated = () => {
  const token = sessionStorage.getItem("token") || localStorage.getItem("token");
  const isAuth = localStorage.getItem("isAuthenticated") === "true";
  return (token !== null && token !== undefined && token !== "") || isAuth;
};

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const showNavbar = isAuthenticated();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          
          {showNavbar && (isMobile ? <NavbarMobile /> : <Navbar />)}
          <main className={`flex-1 sm:px-6 lg:px-8 ${isMobile ? 'pt-0' : 'pt-16'}`}>
            {showNavbar && isMobile && <TopNavbarMobile />}
            {children}
          </main>
          <Sonner />
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}
