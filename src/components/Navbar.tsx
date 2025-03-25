import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Profile from "@/components/Profile";
import Bulletins from "@/components/Bulletins";
import Notifications from "@/components/Notifications";
import { ModeToggle } from "@/components/mode-toggle";
import { HomeIcon, BookOpenIcon, CreditCardIcon } from "@heroicons/react/24/outline";
import { Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { authService } from "@/services/auth.service";

const Navbar = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const user = authService.getUser();
    setIsAdmin(user?.rol === 'admin');
    setUserRole(user?.rol);
  }, []);

  return (
    <nav className="bg-white dark:bg-gray-800 shadow w-full fixed top-0 left-0 z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-xl font-bold text-gray-900 dark:text-white">
              <img
                src="/logo.svg"
                alt="Nova Logo"
                className="h-10 w-auto dark:brightness-100 brightness-0" // negro en claro, blanco en oscuro
              />
            </Link>
          </div>
          <div className="flex-1 flex items-center justify-center space-x-4">
            <Button asChild variant="outline" className="transition duration-300 ease-in-out hover:bg-gray-200 dark:hover:bg-gray-700">
              <Link to="/dashboard">
                <HomeIcon className="h-5 w-5 mr-2" /> Inicio
              </Link>
            </Button>
            <Button asChild variant="outline" className="transition duration-300 ease-in-out hover:bg-gray-200 dark:hover:bg-gray-700">
              <Link to="/topics">
                <BookOpenIcon className="h-5 w-5 mr-2" /> Materias
              </Link>
            </Button>
            {(userRole === "student" || userRole === "teacher") && (
              <Button asChild variant="outline" className="transition duration-300 ease-in-out hover:bg-gray-200 dark:hover:bg-gray-700">
                <Link to="/payments">
                  <CreditCardIcon className="h-5 w-5 mr-2" /> Pagos
                </Link>
              </Button>
            )}
            {isAdmin && (
              <Button asChild variant="outline" className="transition duration-300 ease-in-out hover:bg-gray-200 dark:hover:bg-gray-700">
                <Link to="/gestion">
                  <Settings className="h-5 w-5 mr-2" /> Gestión
                </Link>
              </Button>
            )}
          </div>
          <div className="flex items-center space-x-4 z-20">
            <Notifications />
            <Profile />
            <ModeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
