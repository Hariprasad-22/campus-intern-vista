
import React from "react";
import { useParams, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { applications } from "@/data/mockData";
import Header from "@/components/Header";
import FeedbackForm from "@/components/FeedbackForm";

const FeedbackPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  
  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Redirect if not a student
  if (user.role !== "student") {
    return <Navigate to="/admin" />;
  }

  // Check if application exists and belongs to the user
  const application = applications.find(app => app.id === id && app.studentId === user.id);
  if (!application) {
    return <Navigate to="/dashboard" />;
  }

  // Check if internship has ended
  const endDate = new Date(application.internshipDuration.endDate!);
  const isEnded = endDate < new Date();
  if (!isEnded) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto py-8">
        <FeedbackForm applicationId={application.id} />
      </div>
    </div>
  );
};

export default FeedbackPage;
