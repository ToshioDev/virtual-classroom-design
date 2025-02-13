import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel } from "@/components/ui/dropdown-menu";

const Profile = () => {
  const [user] = useState({ name: "John Doe", email: "john.doe@example.com" });
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    localStorage.removeItem("token");
    localStorage.removeItem("isAuthenticated");
    navigate("/");
    window.location.reload();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <button className="flex items-center space-x-2">
          <span>{user.name}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white dark:bg-gray-800">
        <DropdownMenuLabel>
          <div>{user.name}</div>
          <div className="text-sm text-gray-500">{user.email}</div>
        </DropdownMenuLabel>
        <DropdownMenuItem onSelect={() => navigate("/profile")}>Profile</DropdownMenuItem>
        <DropdownMenuItem onSelect={handleLogout}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Profile;

