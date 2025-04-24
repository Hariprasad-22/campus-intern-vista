import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { applications, feedbacks } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Download, Filter, Search } from "lucide-react";
import Header from "@/components/Header";
import { branches, courses, companies } from "@/data/mockData";
import { InternshipApplication, FeedbackForm } from "@/types";

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
    company: "All Companies",
    role: "",
    duration: "",
    status: "All Status",
  });

  const filterApplications = () => {
    return applications.filter((application) => {
      return (
        (filters.rollNumber === "" || 
          application.studentInfo.rollNumber.toLowerCase().includes(filters.rollNumber.toLowerCase())) &&
        (filters.studentName === "" || 
          application.studentInfo.email.toLowerCase().includes(filters.studentName.toLowerCase())) &&
        (filters.branch === "All Branches" || 
          application.studentInfo.branch === filters.branch) &&
        (filters.year === "All Years" || 
          application.studentInfo.year === filters.year) &&
        (filters.course === "All Courses" || 
          application.studentInfo.course === filters.course) &&
        (filters.company === "All Companies" || 
          application.companyInfo.companyName === filters.company) &&
        (filters.role === "" || 
          application.companyInfo.roleOffered.toLowerCase().includes(filters.role.toLowerCase())) &&
        (filters.duration === "" || 
          application.companyInfo.duration === filters.duration) &&
        (filters.status === "All Status" || 
          application.status === filters.status.toLowerCase())
      );
    });
  };

  const exportToCSV = (type: "applications" | "feedback") => {
    let data: string[][];
    let filename: string;
    
    if (type === "applications") {
      const filteredData = filterApplications();
      data = [
        [
          "Roll No",
          "Student Name",
          "Branch",
          "Year",
          "Company",
          "Role",
          "Duration",
          "Start Date",
          "Status",
        ],
        ...filteredData.map((app) => [
          app.studentInfo.rollNumber,
          app.studentInfo.email.split("@")[0], // Using email as name for demo
          app.studentInfo.branch,
          app.studentInfo.year,
          app.companyInfo.companyName,
          app.companyInfo.roleOffered,
          `${app.companyInfo.duration} months`,
          format(new Date(app.internshipDuration.startDate!), "yyyy-MM-dd"),
          app.status,
        ]),
      ];
      filename = "internship-applications.csv";
    } else {
      data = [
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
      filename = "internship-feedback.csv";
    }

    const csvContent =
      "data:text/csv;charset=utf-8," + data.map((row) => row.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Roll Number</label>
                  <Input
                    placeholder="Filter by roll number"
                    value={filters.rollNumber}
                    onChange={(e) => setFilters({ ...filters, rollNumber: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Student Name</label>
                  <Input
                    placeholder="Filter by student name"
                    value={filters.studentName}
                    onChange={(e) => setFilters({ ...filters, studentName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Branch</label>
                  <Select
                    value={filters.branch}
                    onValueChange={(value) => setFilters({ ...filters, branch: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Branches" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Branches">All Branches</SelectItem>
                      {branches.map((branch) => (
                        <SelectItem key={branch} value={branch}>
                          {branch}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Year</label>
                  <Select
                    value={filters.year}
                    onValueChange={(value) => setFilters({ ...filters, year: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Years" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Years">All Years</SelectItem>
                      {[1, 2, 3, 4, 5].map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Role</label>
                  <Input
                    placeholder="Filter by role"
                    value={filters.role}
                    onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Duration (months)</label>
                  <Input
                    placeholder="Filter by duration"
                    value={filters.duration}
                    onChange={(e) => setFilters({ ...filters, duration: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={() => setFilters({
                    rollNumber: "",
                    studentName: "",
                    branch: "All Branches",
                    year: "All Years",
                    course: "All Courses",
                    company: "All Companies",
                    role: "",
                    duration: "",
                    status: "All Status",
                  })}
                >
                  Reset Filters
                </Button>
                <Button
                  variant="outline"
                  onClick={() => exportToCSV("applications")}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export to CSV
                </Button>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Roll No</TableHead>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Branch</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>Mobile</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Stipend</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filterApplications().map((application) => (
                      <TableRow key={application.id}>
                        <TableCell>{application.studentInfo.rollNumber}</TableCell>
                        <TableCell>{application.studentInfo.email.split("@")[0]}</TableCell>
                        <TableCell>{application.studentInfo.branch}</TableCell>
                        <TableCell>{application.studentInfo.year}</TableCell>
                        <TableCell>{application.studentInfo.mobileNumber}</TableCell>
                        <TableCell>{application.companyInfo.companyName}</TableCell>
                        <TableCell>{application.companyInfo.roleOffered}</TableCell>
                        <TableCell>{application.companyInfo.duration} months</TableCell>
                        <TableCell>₹{application.companyInfo.stipend}</TableCell>
                        <TableCell>
                          {format(new Date(application.internshipDuration.startDate!), "MMM dd, yyyy")}
                        </TableCell>
                        <TableCell>
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
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="feedback">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Feedback Forms</h2>
              <p className="text-gray-600 mb-6">
                View feedback submitted by students after completing internships
              </p>

              {/* Feedback Table */}
              <div className="overflow-x-auto">
                <div className="flex justify-end mb-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportToCSV("feedback")}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export to CSV
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Skills Learned</TableHead>
                      <TableHead>Experience</TableHead>
                      <TableHead>Submitted On</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {feedbacks.length > 0 ? (
                      feedbacks.map((feedback) => {
                        const application = applications.find(
                          (app) => app.id === feedback.applicationId
                        );
                        return (
                          <TableRow key={feedback.id}>
                            <TableCell>
                              {application?.studentInfo.email.split("@")[0] || "Unknown"}
                            </TableCell>
                            <TableCell>
                              {application?.companyInfo.companyName || "Unknown"}
                            </TableCell>
                            <TableCell>{feedback.rating}/5</TableCell>
                            <TableCell>{feedback.skills}</TableCell>
                            <TableCell className="max-w-xs truncate">
                              {feedback.experience}
                            </TableCell>
                            <TableCell>
                              {format(new Date(feedback.createdAt), "MMM dd, yyyy")}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          No feedback forms submitted yet.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
