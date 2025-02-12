
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, BookOpen, Clock, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

// Datos mockeados para los cursos comprados
const MOCK_PURCHASED_COURSES = [
  {
    id: 1,
    title: "Desarrollo Web Full Stack",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    purchaseDate: "2024-03-15",
    renewalDate: "2024-04-15",
    progress: 35,
  },
  {
    id: 2,
    title: "Diseño UX/UI Avanzado",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    purchaseDate: "2024-02-28",
    renewalDate: "2024-03-28",
    progress: 75,
  },
  {
    id: 3,
    title: "JavaScript Moderno",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    purchaseDate: "2024-03-01",
    renewalDate: "2024-04-01",
    progress: 15,
  }
];

// Datos mockeados para las notificaciones
const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: "renewal",
    message: "Tu curso de JavaScript Moderno vence en 3 días",
    date: "2024-03-29"
  },
  {
    id: 2,
    type: "achievement",
    message: "¡Felicitaciones! Has completado el 75% de Diseño UX/UI Avanzado",
    date: "2024-03-28"
  },
  {
    id: 3,
    type: "reminder",
    message: "No olvides completar la tarea pendiente en Desarrollo Web Full Stack",
    date: "2024-03-27"
  }
];

export default function Dashboard() {
  // Función para calcular días restantes
  const getDaysRemaining = (renewalDate: string) => {
    const today = new Date();
    const renewal = new Date(renewalDate);
    const diffTime = Math.abs(renewal.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Función para formatear fecha
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sección de cursos comprados */}
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-3xl font-bold mb-6">Mis Cursos</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MOCK_PURCHASED_COURSES.map((course) => (
              <Link to={`/course/${course.id}`} key={course.id}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <div className="aspect-video w-full overflow-hidden">
                    <img 
                      src={course.image} 
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="line-clamp-1">{course.title}</CardTitle>
                    <CardDescription>
                      Comprado el {formatDate(course.purchaseDate)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>
                        Renovación en {getDaysRemaining(course.renewalDate)} días
                      </span>
                    </div>
                    <div className="mt-4 h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {course.progress}% completado
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Sidebar de notificaciones */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                <CardTitle>Notificaciones</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {MOCK_NOTIFICATIONS.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50"
                  >
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
                      <p className="text-sm font-medium">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(notification.date)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
