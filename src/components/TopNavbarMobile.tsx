import { Link } from "react-router-dom";
import { Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { ModeToggle } from "@/components/mode-toggle";

const TopNavbarMobile = () => {
  const [hasNotifications, setHasNotifications] = useState(false);

  useEffect(() => {
    // Mock check for notifications
    const notifications = [
      { id: 1, read: false },
      { id: 2, read: true },
    ];
    setHasNotifications(notifications.some(notification => !notification.read));
  }, []);

  return (
    <nav className="bg-white dark:bg-gray-800 w-full z-10 md:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard" className="text-xl font-bold text-gray-900 dark:text-white">
            NOVA
          </Link>
          <div className="flex items-center space-x-4">
            <Link to="/mobile/notifications" className="relative flex items-center justify-center text-gray-900 dark:text-white hover:text-primary-500 transition duration-300 ease-in-out">
              <Bell className="w-6 h-6" />
              {hasNotifications && (
                <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-600 rounded-full"></span>
              )}
            </Link>
            <ModeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNavbarMobile;
