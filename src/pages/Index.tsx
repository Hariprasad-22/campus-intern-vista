
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();
  const [selectedRole, setSelectedRole] = useState<"student" | "admin" | null>(null);

  if (user) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace />;
  }

  if (selectedRole) {
    return <Navigate to={`/login?role=${selectedRole}`} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Welcome</CardTitle>
          <CardDescription className="text-center">
            Choose your role to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button
            onClick={() => setSelectedRole("student")}
            className="w-full"
            size="lg"
          >
            Login as Student
          </Button>
          <Button
            onClick={() => setSelectedRole("admin")}
            variant="outline"
            className="w-full"
            size="lg"
          >
            Login as Admin
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
