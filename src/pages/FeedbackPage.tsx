
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
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Internship Feedback</h1>
          <p className="text-muted-foreground">
            Please share your experience about your internship at {application.companyInfo.companyName}
          </p>
        </div>
        <FeedbackForm applicationId={application.id} />
      </div>
    </div>
  );
};

export default FeedbackPage;
