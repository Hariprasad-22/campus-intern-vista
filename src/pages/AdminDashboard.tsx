
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
import { exportToCSV } from "@/utils/csvExport";
import { InternshipApplication } from "@/types";
import ApplicationDetailsDialog from "@/components/admin/ApplicationDetailsDialog";

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedApplication, setSelectedApplication] = useState<InternshipApplication | null>(null);

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
    semester: true,
    email: true,
    mobileNumber: true,
    academicYear: true,
    company: true,
    role: true,
    duration: true,
    stipend: true,
    internshipYear: true,
    hrName: true,
    hrMobile: true,
    hrEmail: true,
    startDate: true,
    endDate: true,
    status: true,
    offerLetter: true,
    nocByHod: true,
    studentLetterToHod: true,
  });

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
          application.companyInfo.internshipYear === filters.internshipYear)
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

    const baseUrl = window.location.origin;
    const data = [
      headers,
      ...filteredData.map((app) => {
        const rowData: (string | number)[] = [];
        
        if (columnVisibility.rollNumber) rowData.push(app.studentInfo.rollNumber);
        if (columnVisibility.studentName) rowData.push(app.studentInfo.fullName);
        if (columnVisibility.branch) rowData.push(app.studentInfo.branch);
        if (columnVisibility.year) rowData.push(app.studentInfo.year);
        if (columnVisibility.course) rowData.push(app.studentInfo.course);
        if (columnVisibility.semester) rowData.push(app.studentInfo.semester);
        if (columnVisibility.email) rowData.push(app.studentInfo.email);
        if (columnVisibility.mobileNumber) rowData.push(app.studentInfo.mobileNumber);
        if (columnVisibility.academicYear) rowData.push(app.studentInfo.academicYear);
        if (columnVisibility.company) rowData.push(app.companyInfo.companyName);
        if (columnVisibility.role) rowData.push(app.companyInfo.roleOffered);
        if (columnVisibility.duration) rowData.push(`${app.companyInfo.duration} months`);
        if (columnVisibility.stipend) rowData.push(`₹${app.companyInfo.stipend}`);
        if (columnVisibility.internshipYear) rowData.push(app.companyInfo.internshipYear);
        if (columnVisibility.hrName) rowData.push(app.companyInfo.hrName);
        if (columnVisibility.hrMobile) rowData.push(app.companyInfo.hrMobile);
        if (columnVisibility.hrEmail) rowData.push(app.companyInfo.hrEmail);
        if (columnVisibility.startDate) 
          rowData.push(app.internshipDuration.startDate ? format(new Date(app.internshipDuration.startDate), "yyyy-MM-dd") : "Not set");
        if (columnVisibility.endDate)
          rowData.push(app.internshipDuration.endDate ? format(new Date(app.internshipDuration.endDate), "yyyy-MM-dd") : "Not set");
        if (columnVisibility.offerLetter)
          rowData.push(app.documents.offerLetter ? `${baseUrl}/document/view/${app.id}/offerLetter` : "Not uploaded");
        if (columnVisibility.nocByHod)
          rowData.push(app.documents.nocByHod ? `${baseUrl}/document/view/${app.id}/nocByHod` : "Not uploaded");
        if (columnVisibility.studentLetterToHod)
          rowData.push(app.documents.studentLetterToHod ? `${baseUrl}/document/view/${app.id}/studentLetterToHod` : "Not uploaded");
        
        return rowData;
      }),
    ];
    
    exportToCSV(data, "internship-applications.csv");
  };

  const handleExportFeedbackCsv = () => {
    const headers = [
      "Student",
      "Company",
      "Role",
      "Rating",
      "Skills Learned",
      "Experience",
      "Submitted On"
    ];

    const data = [
      headers,
      ...feedbacks.map((feedback) => {
        const application = applications.find(
          (app) => app.id === feedback.applicationId
        );
        
        return [
          application?.studentInfo.email.split("@")[0] || "Unknown",
          application?.companyInfo.companyName || "Unknown",
          application?.companyInfo.roleOffered || "Unknown",
          `${feedback.rating}/5`,
          feedback.skills,
          feedback.experience,
          format(new Date(feedback.createdAt), "yyyy-MM-dd")
        ];
      }),
    ];

    exportToCSV(data, "internship-feedback.csv");
  };

  return (
    <div className="min-h-screen bg-pageBackground">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList className="bg-white">
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
          </TabsList>

          <TabsContent value="applications">
            <div className="bg-white p-6 rounded-lg shadow-sm space-y-6 overflow-x-auto">
              <ApplicationFilters 
                filters={filters}
                setFilters={setFilters}
                columnVisibility={columnVisibility}
                setColumnVisibility={setColumnVisibility}
                handleExportToCSV={handleExportApplicationsCsv}
              />
              
              <div className="w-full overflow-x-auto">
                <ApplicationsTable 
                  filteredApplications={filterApplications()}
                  columnVisibility={columnVisibility}
                  onApplicationSelect={setSelectedApplication}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="feedback">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Feedback Forms</h2>
              <p className="text-gray-600 mb-6">
                View feedback submitted by students after completing internships
              </p>

              <div className="w-full overflow-x-auto">
                <FeedbackTable 
                  feedbacks={feedbacks}
                  applications={applications} 
                  handleExportToCSV={handleExportFeedbackCsv}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <ApplicationDetailsDialog
          application={selectedApplication}
          open={selectedApplication !== null}
          onOpenChange={(open) => !open && setSelectedApplication(null)}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
