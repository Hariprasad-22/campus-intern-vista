
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

  // Filter states
  const [branch, setBranch] = useState("All Branches");
  const [year, setYear] = useState("All Years");
  const [course, setCourse] = useState("All Courses");
  const [company, setCompany] = useState("All Companies");
  const [status, setStatus] = useState("All Status");
  const [searchQuery, setSearchQuery] = useState("");

  // For CSV export
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

  // Filter applications based on selected filters
  const filterApplications = (): InternshipApplication[] => {
    return applications.filter((application) => {
      // Branch filter
      if (branch !== "All Branches" && application.studentInfo.branch !== branch)
        return false;

      // Year filter
      if (year !== "All Years" && application.studentInfo.year !== year)
        return false;

      // Course filter
      if (course !== "All Courses" && application.studentInfo.course !== course)
        return false;

      // Company filter
      if (
        company !== "All Companies" &&
        application.companyInfo.companyName !== company
      )
        return false;

      // Status filter
      if (status !== "All Status" && application.status !== status.toLowerCase())
        return false;

      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          application.studentInfo.rollNumber.toLowerCase().includes(query) ||
          application.studentInfo.email.toLowerCase().includes(query) ||
          application.companyInfo.companyName.toLowerCase().includes(query) ||
          application.companyInfo.roleOffered.toLowerCase().includes(query)
        );
      }

      return true;
    });
  };

  // Ensure user is admin
  if (!user || user.role !== "admin") {
    navigate("/login");
    return null;
  }

  const filteredApplications = filterApplications();

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

        <Tabs defaultValue="applications">
          <TabsList className="mb-6">
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
          </TabsList>

          <TabsContent value="applications">
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h2 className="text-xl font-semibold mb-4">
                Internship Applications
              </h2>
              <p className="text-gray-600 mb-6">
                View and manage student internship applications
              </p>

              {/* Filters */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Filters</h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                  <div>
                    <label className="text-sm font-medium">Branch</label>
                    <Select
                      value={branch}
                      onValueChange={(value) => setBranch(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Branches" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All Branches">All Branches</SelectItem>
                        {branches.map((b) => (
                          <SelectItem key={b} value={b}>
                            {b}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Year</label>
                    <Select
                      value={year}
                      onValueChange={(value) => setYear(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Years" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All Years">All Years</SelectItem>
                        {[1, 2, 3, 4, 5].map((y) => (
                          <SelectItem key={y} value={y.toString()}>
                            {y}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Course</label>
                    <Select
                      value={course}
                      onValueChange={(value) => setCourse(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Courses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All Courses">All Courses</SelectItem>
                        {courses.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Company</label>
                    <Select
                      value={company}
                      onValueChange={(value) => setCompany(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Companies" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All Companies">All Companies</SelectItem>
                        {companies.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Status</label>
                    <Select
                      value={status}
                      onValueChange={(value) => setStatus(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All Status">All Status</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Approved">Approved</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by roll number, name, company..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setBranch("All Branches");
                        setYear("All Years");
                        setCourse("All Courses");
                        setCompany("All Companies");
                        setStatus("All Status");
                        setSearchQuery("");
                      }}
                    >
                      Reset
                    </Button>
                    <Button>
                      <Filter className="h-4 w-4 mr-2" />
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </div>

              {/* Applications Table */}
              <div className="overflow-x-auto">
                <div className="flex justify-end mb-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportToCSV("applications")}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export to CSV
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Roll No</TableHead>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Branch</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplications.length > 0 ? (
                      filteredApplications.map((application) => (
                        <TableRow key={application.id}>
                          <TableCell>
                            {application.studentInfo.rollNumber}
                          </TableCell>
                          <TableCell>
                            {application.studentInfo.email.split("@")[0]}
                          </TableCell>
                          <TableCell>{application.studentInfo.branch}</TableCell>
                          <TableCell>{application.studentInfo.year}</TableCell>
                          <TableCell>
                            {application.companyInfo.companyName}
                          </TableCell>
                          <TableCell>
                            {application.companyInfo.roleOffered}
                          </TableCell>
                          <TableCell>{application.companyInfo.duration} months</TableCell>
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
                              {application.status.charAt(0).toUpperCase() +
                                application.status.slice(1)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-4">
                          No internship applications found.
                        </TableCell>
                      </TableRow>
                    )}
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
