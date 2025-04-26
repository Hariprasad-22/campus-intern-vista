
import React from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FeedbackForm, InternshipApplication } from "@/types";

type FeedbackTableProps = {
  feedbacks: FeedbackForm[];
  applications: InternshipApplication[];
  handleExportToCSV: () => void;
};

const FeedbackTable: React.FC<FeedbackTableProps> = ({
  feedbacks,
  applications,
  handleExportToCSV,
}) => {
  return (
    <div className="overflow-x-auto">
      <div className="flex justify-end mb-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportToCSV}
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
  );
};

export default FeedbackTable;
