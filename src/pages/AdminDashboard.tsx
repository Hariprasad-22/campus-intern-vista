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
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Download, Filter } from "lucide-react";
import Header from "@/components/Header";
import { branches, courses, companies } from "@/data/mockData";
import { InternshipApplication, FeedbackForm } from "@/types";

// Add column visibility type
type ColumnVisibility = {
  [key: string]: boolean;
};

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

  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    rollNumber: true,
    studentName: true,
    branch: true,
    year: true,
    course: true,
    company: true,
    role: true,
    duration: true,
    stipend: true,
    startDate: true,
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
      const headers = [
        "Roll No",
        "Student Name",
        "Branch",
        "Year",
        "Course",
        "Company",
        "Role",
        "Duration",
        "Stipend",
        "Start Date",
        "Status",
        "Offer Letter",
        "NOC by HOD",
        "Student Letter to HOD",
      ].filter((header) => columnVisibility[header.toLowerCase().replace(/ /g, "")]);

      data = [
        headers,
        ...filteredData.map((app) => {
          const row = [
            app.studentInfo.rollNumber,
            app.studentInfo.fullName,
            app.studentInfo.branch,
            app.studentInfo.year,
            app.studentInfo.course,
            app.companyInfo.companyName,
            app.companyInfo.roleOffered,
            `${app.companyInfo.duration} months`,
            `₹${app.companyInfo.stipend}`,
            format(new Date(app.internshipDuration.startDate!), "yyyy-MM-dd"),
            app.status,
            app.documents.offerLetter ? "Uploaded" : "Not uploaded",
            app.documents.nocByHod ? "Uploaded" : "Not uploaded",
            app.documents.studentLetterToHod ? "Uploaded" : "Not uploaded",
          ];
          return row.filter((_, index) => columnVisibility[headers[index].toLowerCase().replace(/ /g, "")]);
        }),
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
                <Select
                  value={filters.branch}
                  onValueChange={(value) => setFilters({ ...filters, branch: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Branch" />
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

                <Select
                  value={filters.year}
                  onValueChange={(value) => setFilters({ ...filters, year: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Year" />
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

                <Select
                  value={filters.course}
                  onValueChange={(value) => setFilters({ ...filters, course: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Courses">All Courses</SelectItem>
                    {courses.map((course) => (
                      <SelectItem key={course} value={course}>
                        {course}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filters.company}
                  onValueChange={(value) => setFilters({ ...filters, company: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Company" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Companies">All Companies</SelectItem>
                    {companies.map((company) => (
                      <SelectItem key={company} value={company}>
                        {company}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex justify-between items-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        Display Columns
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      {Object.keys(columnVisibility).map((column) => (
                        <DropdownMenuCheckboxItem
                          key={column}
                          checked={columnVisibility[column]}
                          onCheckedChange={(checked) => {
                            setColumnVisibility({
                              ...columnVisibility,
                              [column]: checked,
                            });
                          }}
                        >
                          {column
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (str) => str.toUpperCase())
                            .trim()}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
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
                      {columnVisibility.rollNumber && <TableHead>Roll No</TableHead>}
                      {columnVisibility.studentName && <TableHead>Student Name</TableHead>}
                      {columnVisibility.branch && <TableHead>Branch</TableHead>}
                      {columnVisibility.year && <TableHead>Year</TableHead>}
                      {columnVisibility.course && <TableHead>Course</TableHead>}
                      {columnVisibility.company && <TableHead>Company</TableHead>}
                      {columnVisibility.role && <TableHead>Role</TableHead>}
                      {columnVisibility.duration && <TableHead>Duration</TableHead>}
                      {columnVisibility.stipend && <TableHead>Stipend</TableHead>}
                      {columnVisibility.startDate && <TableHead>Start Date</TableHead>}
                      {columnVisibility.status && <TableHead>Status</TableHead>}
                      {columnVisibility.offerLetter && <TableHead>Offer Letter</TableHead>}
                      {columnVisibility.nocByHod && <TableHead>NOC by HOD</TableHead>}
                      {columnVisibility.studentLetterToHod && <TableHead>Student Letter to HOD</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filterApplications().map((application) => (
                      <TableRow key={application.id}>
                        {columnVisibility.rollNumber && (
                          <TableCell>{application.studentInfo.rollNumber}</TableCell>
                        )}
                        {columnVisibility.studentName && (
                          <TableCell>{application.studentInfo.fullName}</TableCell>
                        )}
                        {columnVisibility.branch && (
                          <TableCell>{application.studentInfo.branch}</TableCell>
                        )}
                        {columnVisibility.year && (
                          <TableCell>{application.studentInfo.year}</TableCell>
                        )}
                        {columnVisibility.course && (
                          <TableCell>{application.studentInfo.course}</TableCell>
                        )}
                        {columnVisibility.company && (
                          <TableCell>{application.companyInfo.companyName}</TableCell>
                        )}
                        {columnVisibility.role && (
                          <TableCell>{application.companyInfo.roleOffered}</TableCell>
                        )}
                        {columnVisibility.duration && (
                          <TableCell>{application.companyInfo.duration} months</TableCell>
                        )}
                        {columnVisibility.stipend && (
                          <TableCell>₹{application.companyInfo.stipend}</TableCell>
                        )}
                        {columnVisibility.startDate && (
                          <TableCell>
                            {format(new Date(application.internshipDuration.startDate!), "MMM dd, yyyy")}
                          </TableCell>
                        )}
                        {columnVisibility.status && (
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
                        )}
                        {columnVisibility.offerLetter && (
                          <TableCell>
                            {application.documents.offerLetter ? "Uploaded" : "Not uploaded"}
                          </TableCell>
                        )}
                        {columnVisibility.nocByHod && (
                          <TableCell>
                            {application.documents.nocByHod ? "Uploaded" : "Not uploaded"}
                          </TableCell>
                        )}
                        {columnVisibility.studentLetterToHod && (
                          <TableCell>
                            {application.documents.studentLetterToHod ? "Uploaded" : "Not uploaded"}
                          </TableCell>
                        )}
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
