import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { UserIcon } from "@heroicons/react/24/outline";
import { DoorClosed } from "lucide-react";
import UserAvatar from "@/components/UserAvatar";
import { authService } from "@/services/auth.service";

const Profile = () => {
  const [userData, setUserData] = useState({ 
    name: "", 
    novaId: "",
    email: "", 
    photoUrl: "" 
  });
  const navigate = useNavigate();

  useEffect(() => {
    const user = authService.getUser();
    if (user) {
      setUserData({
        name: user.nombre,
        novaId: user.novaId,
        email: user.email,
        photoUrl: user.foto_perfil || ""
      });
    }
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    window.location.href = '/login';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center space-x-2 cursor-pointer focus:outline-none focus:ring-0">
          <UserAvatar name={userData.name} photoUrl={userData.photoUrl} />
          <div className="flex flex-col items-start">
            <span>{userData.name}</span>
            <span className="text-xs text-gray-500">@{userData.novaId}</span>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white dark:bg-gray-800">
        <DropdownMenuLabel>
          <div>{userData.name}</div>
          <div className="text-sm text-gray-500">@{userData.novaId}</div>
        </DropdownMenuLabel>
        <DropdownMenuItem onSelect={() => navigate("/profile")}>
          <UserIcon className="h-5 w-5 mr-2" /> Perfil
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={handleLogout}>
          <DoorClosed className="h-5 w-5 mr-2" /> Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Profile;