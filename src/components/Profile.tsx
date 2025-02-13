import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { UserIcon } from "@heroicons/react/24/outline";
import { DoorClosed } from "lucide-react";
import UserAvatar from "@/components/UserAvatar"; // Add this import

const Profile = () => {
  const [user, setUser] = useState({ name: "", email: "", photoUrl: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (storedUser) {
      setUser({
        name: storedUser.nombre || "",
        email: storedUser.email || "",
        photoUrl: storedUser.foto_perfil || ""
      });
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    localStorage.removeItem("token");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <button className="flex items-center space-x-2">
          <UserAvatar name={user.name} photoUrl={user.photoUrl} /> {/* Use UserAvatar component */}
          <span>{user.name}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white dark:bg-gray-800">
        <DropdownMenuLabel>
          <div>{user.name}</div>
          <div className="text-sm text-gray-500">{user.email}</div>
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

