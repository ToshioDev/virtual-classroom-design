import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { UserIcon } from "@heroicons/react/24/outline";
import { DoorClosed } from "lucide-react";
import UserAvatar from "@/components/UserAvatar"; // Add this import
import { authService } from "@/services/auth.service";

const Profile = () => {
  const [userData, setUserData] = useState({ name: "", email: "", photoUrl: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const user = authService.getUser();
    if (user) {
      setUserData({
        name: user.nombre,
        email: user.email,
        photoUrl: user.foto_perfil || ""
      });
    }
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <button className="flex items-center space-x-2">
          <UserAvatar name={userData.name} photoUrl={userData.photoUrl} /> {/* Use UserAvatar component */}
          <span>{userData.name}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white dark:bg-gray-800">
        <DropdownMenuLabel>
          <div>{userData.name}</div>
          <div className="text-sm text-gray-500">{userData.email}</div>
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

