import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, DollarSign, Shield, Settings, BarChart, AlertCircle, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Panel de Administración</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/gestion/usuarios")}>
            Gestionar Usuarios
          </Button>
          <Button onClick={() => navigate("/gestion/configuracion")}>
            Configuración
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuarios</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,250</div>
            <p className="text-xs text-muted-foreground">
              +50 desde el último mes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cursos Totales</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">
              +3 desde el último mes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$25,000</div>
            <p className="text-xs text-muted-foreground">
              +$2,500 desde el último mes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profesores Activos</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">25</div>
            <p className="text-xs text-muted-foreground">
              +2 desde el último mes
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Aquí iría la actividad reciente */}
              <div className="text-sm text-muted-foreground">
                No hay actividad reciente
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alertas del Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Aquí irían las alertas del sistema */}
              <div className="text-sm text-muted-foreground">
                No hay alertas activas
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Estadísticas de Uso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Aquí irían las estadísticas de uso */}
              <div className="text-sm text-muted-foreground">
                No hay estadísticas disponibles
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="w-full" onClick={() => navigate("/gestion/usuarios/nuevo")}>
                <UserPlus className="mr-2 h-4 w-4" />
                Nuevo Usuario
              </Button>
              <Button variant="outline" className="w-full" onClick={() => navigate("/gestion/curso/nuevo")}>
                <BookOpen className="mr-2 h-4 w-4" />
                Nuevo Curso
              </Button>
              <Button variant="outline" className="w-full" onClick={() => navigate("/gestion/reportes")}>
                <BarChart className="mr-2 h-4 w-4" />
                Generar Reporte
              </Button>
              <Button variant="outline" className="w-full" onClick={() => navigate("/gestion/configuracion")}>
                <Settings className="mr-2 h-4 w-4" />
                Configuración
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 