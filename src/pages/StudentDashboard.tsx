
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { applications, feedbacks } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus } from "lucide-react";
import Header from "@/components/Header";

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  // Get applications for the current student
  const studentApplications = applications.filter(
    (application) => application.studentId === user.id
  );

  // Check if each application has feedback
  const hasFeedback = (applicationId: string) => {
    return feedbacks.some((feedback) => feedback.applicationId === applicationId);
  };

  // Check if the internship end date has passed
  const isInternshipCompleted = (application: any) => {
    const endDate = new Date(application.internshipDuration.endDate);
    return endDate < new Date();
  };

  return (
    <div className="min-h-screen bg-gray-100">
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

        {studentApplications.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">No Applications Yet</h2>
            <p className="text-gray-600 mb-6">
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
            {studentApplications.map((application) => (
              <Card key={application.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">
                      {application.companyInfo.companyName}
                    </CardTitle>
                    <Badge
                      className={`${
                        application.status === "approved"
                          ? "bg-green-500"
                          : application.status === "rejected"
                          ? "bg-red-500"
                          : application.status === "completed"
                          ? "bg-blue-500"
                          : "bg-yellow-500"
                      }`}
                    >
                      {application.status.charAt(0).toUpperCase() +
                        application.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <p className="text-sm font-medium">Role</p>
                    <p className="text-sm text-gray-600">
                      {application.companyInfo.roleOffered}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Duration</p>
                    <p className="text-sm text-gray-600">
                      {format(new Date(application.internshipDuration.startDate!), "MMM dd, yyyy")} -{" "}
                      {format(new Date(application.internshipDuration.endDate!), "MMM dd, yyyy")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Stipend</p>
                    <p className="text-sm text-gray-600">
                      ₹{application.companyInfo.stipend}
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <Link to={`/application/${application.id}`}>
                      <FileText className="h-4 w-4 mr-2" />
                      View Details
                    </Link>
                  </Button>

                  {isInternshipCompleted(application) &&
                    !hasFeedback(application.id) && (
                      <Button
                        size="sm"
                        asChild
                      >
                        <Link to={`/feedback/${application.id}`}>
                          Submit Feedback
                        </Link>
                      </Button>
                    )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
