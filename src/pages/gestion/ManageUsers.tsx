import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  UserPlus, 
  Edit, 
  Trash2, 
  Shield, 
  GraduationCap, 
  Users 
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { userService } from "@/services/user.service";
import { toast } from "sonner";
import UserAvatar from "@/components/UserAvatar";
import { Badge } from "@/components/ui/badge";

// Define user roles for filtering
const USER_ROLES = {
  admin: {
    label: 'Administradores',
    icon: Shield,
    description: 'Usuarios con acceso total al sistema'
  },
  teacher: {
    label: 'Profesores',
    icon: GraduationCap,
    description: 'Usuarios encargados de gestionar cursos y contenido'
  },
  student: {
    label: 'Estudiantes',
    icon: Users,
    description: 'Usuarios que participan en cursos'
  }
};

const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [activeRole, setActiveRole] = useState<keyof typeof USER_ROLES>('admin');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const fetchedUsers = await userService.findAll();
        setUsers(fetchedUsers);
      } catch (error) {
        toast.error('No se pudieron cargar los usuarios');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId: string) => {
    try {
      await userService.remove(userId);
      setUsers(prev => prev.filter(user => user.id !== userId));
      toast.success('Usuario eliminado exitosamente');
    } catch (error) {
      toast.error('No se pudo eliminar el usuario');
    }
  };

  const renderUserTable = (role: keyof typeof USER_ROLES) => {
    const filteredUsers = users.filter(user => user.rol === role);

    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-4">
            {React.createElement(USER_ROLES[role].icon, { className: "w-6 h-6 text-primary" })}
            <CardTitle>{USER_ROLES[role].label}</CardTitle>
          </div>
          <Button 
            onClick={() => navigate('/gestion/usuario/nuevo')}
            variant="outline"
          >
            <UserPlus className="mr-2 w-4 h-4" /> Agregar {USER_ROLES[role].label}
          </Button>
        </CardHeader>
        <CardContent>
          {filteredUsers.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No hay {USER_ROLES[role].label.toLowerCase()} registrados
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Perfil</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Nova ID</TableHead>
                  <TableHead>Correo</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="font-medium">{user._id}</div>
                    </TableCell>
                    <TableCell>
                      <UserAvatar 
                        name={user.nombre} 
                        photoUrl={user.foto_perfil} 
                        size="md" 
                      />
                    </TableCell>
                    <TableCell>{user.nombre}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{user.novaId}</Badge>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.telefono}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          size="icon" 
                          variant="outline"
                          onClick={() => navigate(`/gestion/usuario/editar/${user._id}`)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="destructive"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-8">
        <UserPlus className="w-8 h-8 mr-4 text-primary" />
        <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
      </div>

      <Tabs 
        value={activeRole} 
        onValueChange={(value) => setActiveRole(value as keyof typeof USER_ROLES)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          {Object.entries(USER_ROLES).map(([role, { label, icon: Icon }]) => (
            <TabsTrigger key={role} value={role}>
              <Icon className="mr-2 w-4 h-4" /> {label}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.keys(USER_ROLES).map((role) => (
          <TabsContent key={role} value={role}>
            {renderUserTable(role as keyof typeof USER_ROLES)}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ManageUsers;
