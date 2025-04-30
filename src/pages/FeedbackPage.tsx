
import React, { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import FeedbackForm from "@/components/FeedbackForm";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface InternshipApplication {
  id: string;
  student_id: string;
  company_name: string;
  role_offered: string;
  end_date: string;
}

const FeedbackPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [application, setApplication] = useState<InternshipApplication | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!user || !id) return;

    const fetchApplication = async () => {
      setLoading(true);
      try {
        // Fetch the application
        const { data, error } = await supabase
          .from("internship_applications")
          .select("id, student_id, company_name, role_offered, end_date")
          .eq("id", id)
          .eq("student_id", user.id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setApplication(data);
        }
      } catch (error) {
        console.error("Error fetching application:", error);
        toast.error("Failed to load application details");
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id, user]);

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Redirect if not a student
  if (user.role !== "student") {
    return <Navigate to="/admin" />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-pageBackground">
        <Header />
        <div className="container mx-auto py-8 flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  // Check if application exists and belongs to the user
  if (!application) {
    return <Navigate to="/dashboard" />;
  }

  // Check if internship has ended
  const endDate = new Date(application.end_date);
  const isEnded = endDate < new Date();
  if (!isEnded) {
    toast.error("You can only submit feedback after the internship has ended");
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen bg-pageBackground">
      <Header />
      <div className="container mx-auto py-8">
        <FeedbackForm 
          applicationId={application.id}
          companyName={application.company_name}
          role={application.role_offered}
        />
      </div>
    </div>
  );
};

export default FeedbackPage;
