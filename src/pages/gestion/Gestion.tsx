import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  ListPlus, 
  Users, 
  FolderPlus, 
  FileText, 
  UserPlus, 
  BookmarkPlus 
} from "lucide-react";

const Gestion: React.FC = () => {
  const navigate = useNavigate();

  const creationOptions = [
    {
      icon: FolderPlus,
      label: "Crear Categoría",
      onClick: () => navigate('/gestion/categoria/nueva')
    },
    {
      icon: BookmarkPlus,
      label: "Crear Curso",
      onClick: () => navigate('/gestion/curso/nuevo')
    },
    {
      icon: UserPlus,
      label: "Registrar Usuario",
      onClick: () => navigate('/gestion/usuario/nuevo')
    }
  ];

  const managementOptions = [
    {
      icon: ListPlus,
      title: "Gestionar Categorías",
      description: "Administra y organiza las categorías de cursos",
      route: "/gestion/categorias"
    },
    {
      icon: BookOpen,
      title: "Gestionar Cursos",
      description: "Administra los cursos disponibles",
      route: "/gestion/cursos"
    },
    {
      icon: Users,
      title: "Gestionar Usuarios",
      description: "Administra usuarios y roles",
      route: "/gestion/usuarios"
    },
    {
      icon: FileText,
      title: "Informes",
      description: "Genera y visualiza informes del sistema",
      route: "/gestion/informes"
    }
  ];

  return (
    <div className="container mx-auto py-8 px-4 sm:pb-0 pb-20">
      <h1 className="text-3xl font-bold mb-8">Panel de Gestión</h1>

      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
        {/* Left Column: Creation HUD */}
        <div className="bg-secondary/10 p-6 rounded-xl border border-secondary/20 shadow-sm h-fit">
          <h2 className="text-xl font-semibold mb-4 text-center">Crear Nuevo</h2>
          <div className="flex flex-col space-y-4">
            {creationOptions.map((option, index) => (
              <Button 
                key={index} 
                variant="outline" 
                className="flex items-center justify-start gap-3 w-full h-14"
                onClick={option.onClick}
              >
                <option.icon className="w-6 h-6 text-primary" />
                <span className="text-sm">{option.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Right Column: Management Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {managementOptions.map((option, index) => (
            <Card 
              key={index} 
              className="hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              onClick={() => navigate(option.route)}
            >
              <CardHeader className="flex flex-row items-center space-x-4">
                <option.icon className="w-8 h-8 text-primary" />
                <CardTitle>{option.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{option.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gestion;
