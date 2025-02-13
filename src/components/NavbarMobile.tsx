import { Link } from "react-router-dom";
import { Home, Book, CreditCard, User } from "lucide-react";

const NavbarMobile = () => {
  return (
    <nav className="bg-white dark:bg-gray-800 shadow w-full fixed bottom-0 left-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <Link to="/dashboard" className="flex flex-col items-center justify-center text-gray-900 dark:text-white hover:text-primary-500 transition duration-300 ease-in-out">
            <Home className="w-6 h-6 mb-1" />
            <span className="text-xs">Inicio</span>
          </Link>
          <Link to="/categories" className="flex flex-col items-center justify-center text-gray-900 dark:text-white hover:text-primary-500 transition duration-300 ease-in-out">
            <Book className="w-6 h-6 mb-1" />
            <span className="text-xs">Materias</span>
          </Link>
          <Link to="/payments" className="flex flex-col items-center justify-center text-gray-900 dark:text-white hover:text-primary-500 transition duration-300 ease-in-out">
            <CreditCard className="w-6 h-6 mb-1" />
            <span className="text-xs">Pagos</span>
          </Link>
          <Link to="/mobile/profile" className="flex flex-col items-center justify-center text-gray-900 dark:text-white hover:text-primary-500 transition duration-300 ease-in-out">
            <User className="w-6 h-6 mb-1" />
            <span className="text-xs">Perfil</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavbarMobile;
