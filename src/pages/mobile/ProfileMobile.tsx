import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PhoneIcon, EnvelopeIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";
import axios from "axios";

const ProfileMobile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user")); // Parse the user object from localStorage
        const userId = user?._id; // Extract the user ID
        if (!userId) {
          throw new Error("User ID is null");
        }
        const response = await axios.get(`http://localhost:3000/api/v1/user/getById/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    localStorage.removeItem("token");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userId");
    navigate("/login");
    window.location.reload();
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <img src={user.foto_perfil} alt="Profile" className="w-16 h-16 rounded-full shadow-md" />
              <div>
                <h2 className="text-xl font-bold">{user.nombre}</h2>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Información de contacto</h3>
              <div className="flex items-center space-x-2">
                <PhoneIcon className="w-5 h-5" />
                <input type="text" value={user.telefono} readOnly className="border-none bg-transparent w-full" />
              </div>
              <div className="flex items-center space-x-2">
                <EnvelopeIcon className="w-5 h-5" />
                <input type="text" value={user.email} readOnly className="border-none bg-transparent w-full" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Fecha de Inscripción</h3>
              <div className="flex items-center space-x-2">
                <CalendarDaysIcon className="w-5 h-5" />
                <input type="text" value={new Date(user.createdAt).toLocaleDateString()} readOnly className="border-none bg-transparent w-full" />
              </div>
            </div>
            <Button variant="destructive" onClick={handleLogout} className="w-full mt-4">Cerrar Sesión</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileMobile;
