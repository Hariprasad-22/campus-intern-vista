
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import Header from "@/components/Header";
import InternshipFormContainer from "@/components/internship-form/InternshipFormContainer";

const NewApplication: React.FC = () => {
  const { user } = useAuth();
  
  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  // Redirect if not a student
  if (user.role !== "student") {
    return <Navigate to="/admin" />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto py-8">
        <InternshipFormContainer />
      </div>
    </div>
  );
};

export default NewApplication;
