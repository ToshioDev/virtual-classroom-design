import { Link } from "react-router-dom";
import { Home, Book, CreditCard } from "lucide-react";

const NavbarMobile = () => {
  return (
    <nav className="bg-white dark:bg-gray-800 shadow w-full fixed bottom-0 left-0 z-10 rounded-t-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/categories" className="flex flex-col items-center justify-center text-gray-900 dark:text-white hover:text-primary-500 transition duration-300 ease-in-out px-4">
            <Book className="w-6 h-6 mb-1" />
            <span className="text-xs">Materias</span>
          </Link>
          <Link to="/dashboard" className="flex flex-col items-center justify-center text-gray-900 dark:text-white hover:text-primary-500 transition duration-300 ease-in-out px-4">
            <div className="bg-primary-500 text-white p-3 rounded-full transform translate-y-[-15%]">
              <Home className="w-6 h-6" />
            </div>
            <span className="text-xs mt-1">Inicio</span>
          </Link>
          <Link to="/payments" className="flex flex-col items-center justify-center text-gray-900 dark:text-white hover:text-primary-500 transition duration-300 ease-in-out px-4">
            <CreditCard className="w-6 h-6 mb-1" />
            <span className="text-xs">Pagos</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavbarMobile;
