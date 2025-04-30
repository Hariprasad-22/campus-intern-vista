
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface InternshipApplication {
  id: string;
  student_id: string;
  full_name: string;
  company_name: string;
  role_offered: string;
  stipend: string;
  start_date: string;
  end_date: string;
  status: string;
  offer_letter_path?: string;
  noc_by_hod_path?: string;
  student_letter_to_hod_path?: string;
  created_at: string;
}

interface Feedback {
  id: string;
  application_id: string;
}

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<InternshipApplication[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<InternshipApplication | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch internship applications
        const { data: applicationsData, error: applicationsError } = await supabase
          .from('internship_applications')
          .select('*')
          .eq('student_id', user.id);

        if (applicationsError) throw applicationsError;
        
        // Fetch feedbacks
        const { data: feedbacksData, error: feedbacksError } = await supabase
          .from('internship_feedback')
          .select('id, application_id');

        if (feedbacksError) throw feedbacksError;

        setApplications(applicationsData || []);
        setFeedbacks(feedbacksData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load applications. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (!user) {
    navigate("/login");
    return null;
  }

  const hasFeedback = (applicationId: string) => {
    return feedbacks.some((feedback) => feedback.application_id === applicationId);
  };

  const isInternshipCompleted = (application: InternshipApplication) => {
    const endDate = new Date(application.end_date);
    return endDate < new Date() || application.status === 'completed';
  };

  const handleViewApplication = (application: InternshipApplication) => {
    setSelectedApplication(application);
  };

  return (
    <div className="min-h-screen bg-pageBackground">
      <Header />
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">My Internship Applications</h1>
          <Button asChild>
            <Link to="/application/new">
              <Plus className="mr-2 h-4 w-4" />
              New Application
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-card rounded-lg shadow-sm p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">No Applications Yet</h2>
            <p className="text-muted-foreground mb-6">
              You haven't submitted any internship applications yet. Start by
              creating a new application.
            </p>
            <Button asChild>
              <Link to="/application/new">
                <Plus className="mr-2 h-4 w-4" />
                Create New Application
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.map((application) => (
              <Card key={application.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">
                      {application.company_name}
                    </CardTitle>
                    <Badge
                      className={`
                        ${
                          application.status === "approved"
                            ? "bg-green-500"
                            : application.status === "rejected"
                            ? "bg-red-500"
                            : application.status === "completed"
                            ? "bg-blue-500"
                            : "bg-yellow-500"
                        }
                      `}
                    >
                      {application.status.charAt(0).toUpperCase() +
                        application.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <p className="text-sm font-medium">Role</p>
                    <p className="text-sm text-muted-foreground">
                      {application.role_offered}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Duration</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(application.start_date), "MMM dd, yyyy")} -{" "}
                      {format(new Date(application.end_date), "MMM dd, yyyy")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Stipend</p>
                    <p className="text-sm text-muted-foreground">
                      ₹{application.stipend}
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewApplication(application)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View Details
                  </Button>

                  {isInternshipCompleted(application) &&
                    !hasFeedback(application.id) && (
                      <Button
                        size="sm"
                        onClick={() => navigate(`/feedback/${application.id}`)}
                      >
                        Submit Feedback
                      </Button>
                    )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
        
        {/* Application Details Dialog */}
        <Dialog open={selectedApplication !== null} onOpenChange={(open) => !open && setSelectedApplication(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Application Details</DialogTitle>
            </DialogHeader>
            
            {selectedApplication && (
              <div className="space-y-4">
                <div className="border rounded p-4">
                  <h3 className="text-md font-semibold mb-2">Company Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm font-medium">Company Name</p>
                      <p className="text-sm text-muted-foreground">{selectedApplication.company_name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Role</p>
                      <p className="text-sm text-muted-foreground">{selectedApplication.role_offered}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Stipend</p>
                      <p className="text-sm text-muted-foreground">₹{selectedApplication.stipend}</p>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded p-4">
                  <h3 className="text-md font-semibold mb-2">Internship Duration</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm font-medium">Start Date</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(selectedApplication.start_date), "MMM dd, yyyy")}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">End Date</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(selectedApplication.end_date), "MMM dd, yyyy")}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded p-4">
                  <h3 className="text-md font-semibold mb-2">Status</h3>
                  <Badge
                    className={`${
                      selectedApplication.status === "approved"
                        ? "bg-green-500"
                        : selectedApplication.status === "rejected"
                        ? "bg-red-500"
                        : selectedApplication.status === "completed"
                        ? "bg-blue-500"
                        : "bg-yellow-500"
                    }`}
                  >
                    {selectedApplication.status.charAt(0).toUpperCase() +
                      selectedApplication.status.slice(1)}
                  </Badge>
                </div>
                
                {isInternshipCompleted(selectedApplication) &&
                  !hasFeedback(selectedApplication.id) && (
                    <div className="flex justify-end">
                      <Button onClick={() => {
                        setSelectedApplication(null);
                        navigate(`/feedback/${selectedApplication.id}`);
                      }}>
                        Submit Feedback
                      </Button>
                    </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default StudentDashboard;
