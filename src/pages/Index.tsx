
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6 animate-fadeIn">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          Bienvenido al Aula Virtual
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-[600px] mx-auto">
          Accede a tus cursos y comienza tu viaje de aprendizaje
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild>
            <Link to="/login">Iniciar Sesión</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/register">Registrarse</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Index;
