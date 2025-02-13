import { useState } from "react";
import { Bell, Clock, BookOpen, AlertCircle, CheckCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

// Datos mockeados para las notificaciones
const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: "renewal",
    message: "Tu curso de JavaScript Moderno vence en 3 días",
    date: "2024-03-29",
    read: false
  },
  {
    id: 2,
    type: "achievement",
    message: "¡Felicitaciones! Has completado el 75% de Diseño UX/UI Avanzado",
    date: "2024-03-28",
    read: false
  },
  {
    id: 3,
    type: "reminder",
    message: "No olvides completar la tarea pendiente en Desarrollo Web Full Stack",
    date: "2024-03-27",
    read: false
  }
];

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const Notifications = () => {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <button className="relative">
          <Bell className="w-6 h-6 text-gray-900 dark:text-white" />
          {notifications.some(notification => !notification.read) && (
            <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-600 rounded-full"></span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white dark:bg-gray-800 w-80">
        <DropdownMenuLabel>
          <div className="flex justify-between items-center">
            <span>Notificaciones</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <button onClick={markAllAsRead} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                  <CheckCircle className="w-5 h-5 text-gray-900 dark:text-white" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="z-50 bg-gray-900 text-white dark:bg-white dark:text-black">
                <p>Marcar todo como leído</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </DropdownMenuLabel>
        <ul className="space-y-2">
          {notifications.map((notification) => (
            <li key={notification.id} className={`flex items-start gap-3 p-3 rounded-lg transition-all duration-300 ${notification.read ? 'bg-secondary/50' : 'bg-secondary dark:bg-gray-700'}`}>
              {notification.type === "renewal" && (
                <Clock className="w-5 h-5 text-yellow-500 flex-shrink-0" />
              )}
              {notification.type === "achievement" && (
                <BookOpen className="w-5 h-5 text-green-500 flex-shrink-0" />
              )}
              {notification.type === "reminder" && (
                <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
              )}
              <div>
                <p className={`text-sm font-medium ${notification.read ? 'text-gray-900 dark:text-gray-300' : 'text-gray-800 dark:text-gray-100'}`}>{notification.message}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDate(notification.date)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Notifications;
