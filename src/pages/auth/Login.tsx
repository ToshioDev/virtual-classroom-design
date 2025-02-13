import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("showWelcomeToast") === "true") {
      toast.success("¡Bienvenido al Aula Virtual!");
      localStorage.removeItem("showWelcomeToast");
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      await authService.login(email, password);

      const token = authService.getToken();
      const user = authService.getUser();
  
      if (token && user) {
        localStorage.setItem("isAuthenticated", "true");
        toast.success("¡Bienvenido al Aula Virtual!");
        setTimeout(() => {
          navigate("/dashboard");
          window.location.reload();
        }, 3000); // 3 seconds delay
      } else {
        toast.error("Error al obtener los datos del usuario.");
        navigate("/login");
      }
    } catch (error) {
      toast.error("Credenciales incorrectas. Intenta de nuevo.");
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md animate-fadeIn">
        <form onSubmit={handleLogin}>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Iniciar Sesión</CardTitle>
            <CardDescription>
              Ingresa tus credenciales para acceder a tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full">
              Iniciar Sesión
            </Button>
            <p className="text-sm text-center text-gray-600 dark:text-gray-400">
              ¿No tienes una cuenta?{" "}
              <Link to="/register" className="text-primary-600 hover:text-primary-500">
                Regístrate
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
