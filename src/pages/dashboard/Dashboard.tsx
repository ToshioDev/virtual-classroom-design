import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentDashboard from "./templates/StudentDashboard";
import TeacherDashboard from "./templates/TeacherDashboard";
import AdminDashboard from "./templates/AdminDashboard";
import { authService } from "@/services/auth.service";
import { User } from "@/interfaces/user.interface";

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = authService.getUser();
    
    if (!currentUser) {
      navigate("/login");
      return;
    }

    setUser(currentUser);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  switch (user.rol) {
    case "student":
      return <StudentDashboard />;
    case "teacher":
      return <TeacherDashboard />;
    case "admin":
      return <AdminDashboard />;
    default:
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Rol no reconocido</h1>
            <p className="text-muted-foreground">
              No se pudo determinar el rol del usuario
            </p>
          </div>
        </div>
      );
  }
}
