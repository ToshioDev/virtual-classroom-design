import { useState } from "react";
import { Bell, Clock, BookOpen, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

const NotificationsMobile = () => {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              <CardTitle>Notificaciones</CardTitle>
            </div>
            <button onClick={markAllAsRead} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
              Marcar todo como leído
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
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
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsMobile;
