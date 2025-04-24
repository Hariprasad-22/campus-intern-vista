
import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserRound, LogOut } from "lucide-react";

export const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const goToProfile = () => {
    navigate("/profile");
  };

  return (
    <header className="w-full bg-header text-white p-4 flex justify-between items-center">
      <div 
        className="text-xl font-semibold cursor-pointer" 
        onClick={() => navigate(user?.role === "student" ? "/dashboard" : "/admin")}
      >
        INTERNSHIP-DATA
      </div>
      {user && (
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            className="text-white hover:bg-gray-700 space-x-2"
            onClick={goToProfile}
          >
            <UserRound size={20} />
            <span>Profile</span>
          </Button>
          <Button 
            variant="ghost" 
            className="text-white hover:bg-gray-700 space-x-2"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            <span>Logout</span>
          </Button>
        </div>
      )}
    </header>
  );
};

export default Header;
