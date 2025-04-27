
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { applications, feedbacks } from "@/data/mockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import ApplicationFilters from "@/components/admin/ApplicationFilters";
import ApplicationsTable from "@/components/admin/ApplicationsTable";
import FeedbackTable from "@/components/admin/FeedbackTable";
import { exportToCSV, getDocumentLink } from "@/utils/csvExport";
import { InternshipApplication, FeedbackForm } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { Link } from "react-router-dom";

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user || user.role !== "admin") {
    navigate("/login");
    return null;
  }

  const [filters, setFilters] = useState({
    rollNumber: "",
    studentName: "",
    branch: "All Branches",
    year: "All Years",
    course: "All Courses",
    academicYear: "All Academic Years",
    company: "All Companies",
    role: "",
    duration: "",
    internshipYear: "All Internship Years",
    status: "All Status",
  });

  const [columnVisibility, setColumnVisibility] = useState({
    rollNumber: true,
    studentName: true,
    branch: true,
    year: true,
    course: true,
    academicYear: true,
    company: true,
    role: true,
    duration: true,
    stipend: true,
    internshipYear: true,
    startDate: true,
    status: true,
    offerLetter: true,
    nocByHod: true,
    studentLetterToHod: true,
  });

  const [selectedApplication, setSelectedApplication] = useState<InternshipApplication | null>(null);

  const filterApplications = () => {
    return applications.filter((application) => {
      return (
        (filters.rollNumber === "" || 
          application.studentInfo.rollNumber.toLowerCase().includes(filters.rollNumber.toLowerCase())) &&
        (filters.studentName === "" || 
          application.studentInfo.fullName.toLowerCase().includes(filters.studentName.toLowerCase())) &&
        (filters.branch === "All Branches" || 
          application.studentInfo.branch === filters.branch) &&
        (filters.year === "All Years" || 
          application.studentInfo.year === filters.year) &&
        (filters.course === "All Courses" || 
          application.studentInfo.course === filters.course) &&
        (filters.academicYear === "All Academic Years" || 
          application.studentInfo.academicYear === filters.academicYear) &&
        (filters.company === "All Companies" || 
          application.companyInfo.companyName === filters.company) &&
        (filters.role === "" || 
          application.companyInfo.roleOffered.toLowerCase().includes(filters.role.toLowerCase())) &&
        (filters.duration === "" || 
          application.companyInfo.duration === filters.duration) &&
        (filters.internshipYear === "All Internship Years" || 
          application.companyInfo.internshipYear === filters.internshipYear) &&
        (filters.status === "All Status" || 
          application.status === filters.status.toLowerCase())
      );
    });
  };

  const handleExportApplicationsCsv = () => {
    const filteredData = filterApplications();
    const visibleColumns = Object.keys(columnVisibility).filter(key => columnVisibility[key]);
    
    const headers = visibleColumns.map(column => 
      column
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase())
        .trim()
    );

    const data = [
      headers,
      ...filteredData.map((app) => {
        const rowData: (string | number)[] = [];
        
        if (columnVisibility.rollNumber) rowData.push(app.studentInfo.rollNumber);
        if (columnVisibility.studentName) rowData.push(app.studentInfo.fullName);
        if (columnVisibility.branch) rowData.push(app.studentInfo.branch);
        if (columnVisibility.year) rowData.push(app.studentInfo.year);
        if (columnVisibility.course) rowData.push(app.studentInfo.course);
        if (columnVisibility.academicYear) rowData.push(app.studentInfo.academicYear);
        if (columnVisibility.company) rowData.push(app.companyInfo.companyName);
        if (columnVisibility.role) rowData.push(app.companyInfo.roleOffered);
        if (columnVisibility.duration) rowData.push(`${app.companyInfo.duration} months`);
        if (columnVisibility.stipend) rowData.push(`₹${app.companyInfo.stipend}`);
        if (columnVisibility.internshipYear) rowData.push(app.companyInfo.internshipYear);
        if (columnVisibility.startDate) rowData.push(app.internshipDuration.startDate ? format(new Date(app.internshipDuration.startDate), "yyyy-MM-dd") : "Not set");
        if (columnVisibility.status) rowData.push(app.status);
        
        // Update document links to include actual URLs
        if (columnVisibility.offerLetter) {
          const link = getDocumentLink(app.id, "offerLetter", !!app.documents.offerLetter);
          rowData.push(link);
        }
        
        if (columnVisibility.nocByHod) {
          const link = getDocumentLink(app.id, "nocByHod", !!app.documents.nocByHod);
          rowData.push(link);
        }
        
        if (columnVisibility.studentLetterToHod) {
          const link = getDocumentLink(app.id, "studentLetterToHod", !!app.documents.studentLetterToHod);
          rowData.push(link);
        }
        
        return rowData;
      }),
    ];
    
    exportToCSV(data, "internship-applications.csv");
  };

  const handleExportFeedbackCsv = () => {
    const data = [
      ["Student", "Company", "Rating", "Skills", "Feedback"],
      ...feedbacks.map((feedback) => {
        const application = applications.find(
          (app) => app.id === feedback.applicationId
        );
        return [
          application?.studentInfo.email.split("@")[0] || "Unknown",
          application?.companyInfo.companyName || "Unknown",
          feedback.rating.toString(),
          feedback.skills,
          feedback.experience,
        ];
      }),
    ];
    exportToCSV(data, "internship-feedback.csv");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
          </TabsList>

          <TabsContent value="applications">
            <div className="bg-card p-6 rounded-lg shadow-sm space-y-6">
              <ApplicationFilters 
                filters={filters}
                setFilters={setFilters}
                columnVisibility={columnVisibility}
                setColumnVisibility={setColumnVisibility}
                handleExportToCSV={handleExportApplicationsCsv}
              />
              
              <ApplicationsTable 
                filteredApplications={filterApplications()}
                columnVisibility={columnVisibility}
              />
            </div>
          </TabsContent>

          <TabsContent value="feedback">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Feedback Forms</h2>
              <p className="text-gray-600 mb-6">
                View feedback submitted by students after completing internships
              </p>

              <FeedbackTable 
                feedbacks={feedbacks}
                applications={applications} 
                handleExportToCSV={handleExportFeedbackCsv}
              />
            </div>
          </TabsContent>
        </Tabs>

        <Dialog open={selectedApplication !== null} onOpenChange={(open) => !open && setSelectedApplication(null)}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Application Details</DialogTitle>
            </DialogHeader>
            
            {selectedApplication && (
              <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                {/* Student Information */}
                <div className="border rounded p-4">
                  <h3 className="text-md font-semibold mb-2">Student Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm font-medium">Full Name</p>
                      <p className="text-sm text-muted-foreground">{selectedApplication.studentInfo.fullName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Roll Number</p>
                      <p className="text-sm text-muted-foreground">{selectedApplication.studentInfo.rollNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Course</p>
                      <p className="text-sm text-muted-foreground">{selectedApplication.studentInfo.course}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Branch</p>
                      <p className="text-sm text-muted-foreground">{selectedApplication.studentInfo.branch}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Year</p>
                      <p className="text-sm text-muted-foreground">{selectedApplication.studentInfo.year}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Semester</p>
                      <p className="text-sm text-muted-foreground">{selectedApplication.studentInfo.semester}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">{selectedApplication.studentInfo.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Mobile Number</p>
                      <p className="text-sm text-muted-foreground">{selectedApplication.studentInfo.mobileNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Academic Year</p>
                      <p className="text-sm text-muted-foreground">{selectedApplication.studentInfo.academicYear}</p>
                    </div>
                  </div>
                </div>

                {/* Company Information */}
                <div className="border rounded p-4">
                  <h3 className="text-md font-semibold mb-2">Company Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm font-medium">Company Name</p>
                      <p className="text-sm text-muted-foreground">{selectedApplication.companyInfo.companyName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Role Offered</p>
                      <p className="text-sm text-muted-foreground">{selectedApplication.companyInfo.roleOffered}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Stipend</p>
                      <p className="text-sm text-muted-foreground">₹{selectedApplication.companyInfo.stipend}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Duration</p>
                      <p className="text-sm text-muted-foreground">{selectedApplication.companyInfo.duration} months</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Internship Year</p>
                      <p className="text-sm text-muted-foreground">{selectedApplication.companyInfo.internshipYear}</p>
                    </div>
                  </div>
                </div>

                {/* HR Details */}
                <div className="border rounded p-4">
                  <h3 className="text-md font-semibold mb-2">HR Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm font-medium">HR Name</p>
                      <p className="text-sm text-muted-foreground">{selectedApplication.companyInfo.hrName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">HR Mobile</p>
                      <p className="text-sm text-muted-foreground">{selectedApplication.companyInfo.hrMobile}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">HR Email</p>
                      <p className="text-sm text-muted-foreground">{selectedApplication.companyInfo.hrEmail}</p>
                    </div>
                  </div>
                </div>

                {/* Internship Duration */}
                <div className="border rounded p-4">
                  <h3 className="text-md font-semibold mb-2">Internship Duration</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm font-medium">Start Date</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(selectedApplication.internshipDuration.startDate), "MMM dd, yyyy")}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">End Date</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(selectedApplication.internshipDuration.endDate), "MMM dd, yyyy")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Documents */}
                <div className="border rounded p-4">
                  <h3 className="text-md font-semibold mb-2">Documents</h3>
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <p className="text-sm font-medium">Offer Letter</p>
                      {selectedApplication.documents.offerLetter ? (
                        <Link 
                          to={`/document/view/${selectedApplication.id}/offerLetter`}
                          className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <FileText className="h-4 w-4" />
                          View Document
                        </Link>
                      ) : (
                        <p className="text-sm text-muted-foreground">Not uploaded</p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">NOC by HOD</p>
                      {selectedApplication.documents.nocByHod ? (
                        <Link 
                          to={`/document/view/${selectedApplication.id}/nocByHod`}
                          className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <FileText className="h-4 w-4" />
                          View Document
                        </Link>
                      ) : (
                        <p className="text-sm text-muted-foreground">Not uploaded</p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">Student Letter to HOD</p>
                      {selectedApplication.documents.studentLetterToHod ? (
                        <Link 
                          to={`/document/view/${selectedApplication.id}/studentLetterToHod`}
                          className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <FileText className="h-4 w-4" />
                          View Document
                        </Link>
                      ) : (
                        <p className="text-sm text-muted-foreground">Not uploaded</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminDashboard;
