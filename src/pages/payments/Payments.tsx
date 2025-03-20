import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { authService } from "@/services/auth.service";
import StudentPayments from "./templates/StudentPayments";
import TeacherPayments from "./templates/TeacherPayments";

export default function Payments() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      try {
        const user = await authService.getUser();
        if (user) {
          setRole(user.rol);
        }
      } catch (error) {
        console.error("Error al obtener el rol del usuario:", error);
      } finally {
        setLoading(false);
      }
    };

    checkRole();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Renderizar la vista correspondiente según el rol
  switch (role) {
    case "student":
      return <StudentPayments />;
    case "teacher":
      return <TeacherPayments />;
    default:
      return <Navigate to="/login" replace />;
  }
}
