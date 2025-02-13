import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import UserAvatar from "@/components/UserAvatar";
import { 
  UserCircleIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  CalendarIcon,
  PencilIcon, 
  XMarkIcon, 
  CheckIcon,
  TrashIcon, 
  KeyIcon 
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";

const Profile = () => {
  const [user, setUser] = useState({ name: "", email: "", photoUrl: "", telefono: "", createdAt: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", telefono: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        const userId = storedUser._id;
        const response = await axios.get(`http://localhost:3000/api/v1/user/getById/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser({
          name: response.data.nombre || "",
          email: response.data.email || "",
          photoUrl: response.data.foto_perfil || "",
          telefono: response.data.telefono || "",
          createdAt: new Date(response.data.createdAt).toLocaleDateString() || ""
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setFormData({
      name: user.name,
      email: user.email,
      telefono: user.telefono
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: user.name,
      email: user.email,
      telefono: user.telefono
    });
  };

  const handleSave = async () => {
    // TODO: Implement save functionality
    setIsEditing(false);
  };

  const handleDeleteAccount = () => {
    // TODO: Implement account deletion
    console.log("Delete account");
  };

  const handleChangePassword = () => {
    // TODO: Implement password change
    console.log("Change password");
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* User Info Card - Presentational */}
        <Card className="md:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Tu Perfil</CardTitle>
            <CardDescription className="whitespace-normal">
              Revisa tus datos de usuario registrados en la plataforma.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <UserAvatar 
                name={user.name} 
                photoUrl={user.photoUrl} 
                size={80} 
                className="shadow-lg"
              />
              <div className="min-w-0">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white truncate">
                  {user.name}
                </h2>
                <div className="mt-1 space-y-1">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <EnvelopeIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <PhoneIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>{user.telefono}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <CalendarIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>Desde {user.createdAt}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Updated actions section */}
            <div className="mt-6 border-t pt-4">
              <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
                <Button 
                  variant="outline" 
                  className="justify-center md:justify-start text-gray-600 dark:text-gray-400"
                  onClick={handleChangePassword}
                >
                  <KeyIcon className="h-4 w-4 md:mr-2 mr-0" />
                  <span className="hidden md:inline">Cambiar Contraseña</span>
                  <span className="md:hidden">Contraseña</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="justify-center md:justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300"
                  onClick={handleDeleteAccount}
                >
                  <TrashIcon className="h-4 w-4 md:mr-2 mr-0" />
                  <span className="hidden md:inline">Eliminar Cuenta</span>
                  <span className="md:hidden">Eliminar</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Update Form */}
        <Card className="md:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>Actualizar Perfil</CardTitle>
              <CardDescription>Modifica tu información personal</CardDescription>
            </div>
            {!isEditing ? (
              <Button onClick={handleEdit} variant="outline" size="sm">
                <PencilIcon className="h-4 w-4 mr-2" />
                Editar
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button onClick={handleCancel} variant="outline" size="sm">
                  <XMarkIcon className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
                <Button onClick={handleSave} size="sm">
                  <CheckIcon className="h-4 w-4 mr-2" />
                  Guardar
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <UserCircleIcon className="h-5 w-5 text-gray-500" />
                <div className="flex-1 space-y-1">
                  <Label htmlFor="name">Nombre completo</Label>
                  <Input
                    id="name"
                    value={isEditing ? formData.name : user.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-white dark:bg-gray-800"
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <EnvelopeIcon className="h-5 w-5 text-gray-500" />
                <div className="flex-1 space-y-1">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    value={isEditing ? formData.email : user.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-white dark:bg-gray-800"
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <PhoneIcon className="h-5 w-5 text-gray-500" />
                <div className="flex-1 space-y-1">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={isEditing ? formData.telefono : user.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    className="bg-white dark:bg-gray-800"
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
