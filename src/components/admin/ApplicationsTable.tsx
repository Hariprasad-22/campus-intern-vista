
import React from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileText, Link2 } from "lucide-react";
import { InternshipApplication } from "@/types";

type ApplicationsTableProps = {
  filteredApplications: InternshipApplication[];
  columnVisibility: Record<string, boolean>;
};

const ApplicationsTable: React.FC<ApplicationsTableProps> = ({
  filteredApplications,
  columnVisibility,
}) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {columnVisibility.rollNumber && <TableHead>Roll No</TableHead>}
            {columnVisibility.studentName && <TableHead>Student Name</TableHead>}
            {columnVisibility.branch && <TableHead>Branch</TableHead>}
            {columnVisibility.year && <TableHead>Year</TableHead>}
            {columnVisibility.course && <TableHead>Course</TableHead>}
            {columnVisibility.academicYear && <TableHead>Academic Year</TableHead>}
            {columnVisibility.company && <TableHead>Company</TableHead>}
            {columnVisibility.role && <TableHead>Role</TableHead>}
            {columnVisibility.duration && <TableHead>Duration</TableHead>}
            {columnVisibility.stipend && <TableHead>Stipend</TableHead>}
            {columnVisibility.internshipYear && <TableHead>Internship Year</TableHead>}
            {columnVisibility.startDate && <TableHead>Start Date</TableHead>}
            {columnVisibility.status && <TableHead>Status</TableHead>}
            {columnVisibility.offerLetter && <TableHead>Offer Letter</TableHead>}
            {columnVisibility.nocByHod && <TableHead>NOC by HOD</TableHead>}
            {columnVisibility.studentLetterToHod && <TableHead>Student Letter to HOD</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredApplications.length === 0 ? (
            <TableRow>
              <TableCell colSpan={Object.keys(columnVisibility).length} className="text-center py-4">
                No applications found matching the current filters.
              </TableCell>
            </TableRow>
          ) : (
            filteredApplications.map((application) => (
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
                {columnVisibility.academicYear && (
                  <TableCell>{application.studentInfo.academicYear}</TableCell>
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
                {columnVisibility.internshipYear && (
                  <TableCell>{application.companyInfo.internshipYear}</TableCell>
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
                    {application.documents.offerLetter ? (
                      <Link to={`/document/view/${application.id}/offerLetter`} className="flex items-center text-blue-600 hover:underline">
                        <FileText className="h-4 w-4 mr-1" />
                        View
                      </Link>
                    ) : (
                      <span className="text-gray-500">Not uploaded</span>
                    )}
                  </TableCell>
                )}
                {columnVisibility.nocByHod && (
                  <TableCell>
                    {application.documents.nocByHod ? (
                      <Link to={`/document/view/${application.id}/nocByHod`} className="flex items-center text-blue-600 hover:underline">
                        <FileText className="h-4 w-4 mr-1" />
                        View
                      </Link>
                    ) : (
                      <span className="text-gray-500">Not uploaded</span>
                    )}
                  </TableCell>
                )}
                {columnVisibility.studentLetterToHod && (
                  <TableCell>
                    {application.documents.studentLetterToHod ? (
                      <Link to={`/document/view/${application.id}/studentLetterToHod`} className="flex items-center text-blue-600 hover:underline">
                        <FileText className="h-4 w-4 mr-1" />
                        View
                      </Link>
                    ) : (
                      <span className="text-gray-500">Not uploaded</span>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ApplicationsTable;
