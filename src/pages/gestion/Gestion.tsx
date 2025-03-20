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
  BookmarkPlus,
  Receipt,
  PlusCircle
} from "lucide-react";

const Gestion: React.FC = () => {
  const navigate = useNavigate();

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
    },
    {
      icon: Receipt,
      title: "Compras",
      description: "Gestiona las compras y asignaciones de cursos",
      route: "/gestion/compras",
      actions: [
        {
          icon: PlusCircle,
          label: "Asignar",
          route: "/gestion/compras/asignar"
        }
      ]
    }
  ];

  return (
    <div className="container mx-auto py-8 px-4 sm:pb-0 pb-20">
      <h1 className="text-3xl font-bold mb-8">Panel de Gestión</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <CardDescription className="mb-4">{option.description}</CardDescription>
              {option.actions && (
                <div className="flex gap-2">
                  {option.actions.map((action, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(action.route);
                      }}
                    >
                      <action.icon className="w-4 h-4" />
                      {action.label}
                    </Button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Gestion;
