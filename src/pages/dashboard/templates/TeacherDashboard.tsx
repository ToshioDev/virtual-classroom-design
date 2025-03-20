import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, Star, DollarSign, Calendar, MessageSquare, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function TeacherDashboard() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard del Profesor</h1>
        <Button onClick={() => navigate("/cursos/aplicar")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Aplicar como Docente
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Estudiantes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">150</div>
            <p className="text-xs text-muted-foreground">
              +12 desde el último mes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cursos Asignados</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              +1 desde el último mes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calificación Promedio</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8</div>
            <p className="text-xs text-muted-foreground">
              +0.1 desde el último mes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Mensuales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2,500</div>
            <p className="text-xs text-muted-foreground">
              +$300 desde el último mes
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Mis Cursos Asignados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Aquí irían los cursos asignados */}
              <div className="text-sm text-muted-foreground">
                No hay cursos asignados
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Próximas Clases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Aquí irían las próximas clases */}
              <div className="text-sm text-muted-foreground">
                No hay clases programadas
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Estadísticas de Cursos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Aquí irían las estadísticas de los cursos */}
              <div className="text-sm text-muted-foreground">
                No hay estadísticas disponibles
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Calendario de Actividades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Aquí iría el calendario de actividades */}
              <div className="text-sm text-muted-foreground">
                No hay actividades programadas
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 