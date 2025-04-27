
import React from "react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { InternshipApplication } from "@/types";

type ApplicationDetailsDialogProps = {
  application: InternshipApplication | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const ApplicationDetailsDialog: React.FC<ApplicationDetailsDialogProps> = ({
  application,
  open,
  onOpenChange,
}) => {
  if (!application) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Application Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Student Information */}
          <div className="border rounded p-4">
            <h3 className="text-md font-semibold mb-2">Student Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <p className="text-sm font-medium">Full Name</p>
                <p className="text-sm text-muted-foreground">{application.studentInfo.fullName}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Roll Number</p>
                <p className="text-sm text-muted-foreground">{application.studentInfo.rollNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Course</p>
                <p className="text-sm text-muted-foreground">{application.studentInfo.course}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Branch</p>
                <p className="text-sm text-muted-foreground">{application.studentInfo.branch}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Year</p>
                <p className="text-sm text-muted-foreground">{application.studentInfo.year}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Semester</p>
                <p className="text-sm text-muted-foreground">{application.studentInfo.semester}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{application.studentInfo.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Mobile Number</p>
                <p className="text-sm text-muted-foreground">{application.studentInfo.mobileNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Academic Year</p>
                <p className="text-sm text-muted-foreground">{application.studentInfo.academicYear}</p>
              </div>
            </div>
          </div>

          {/* Company Information */}
          <div className="border rounded p-4">
            <h3 className="text-md font-semibold mb-2">Company Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <p className="text-sm font-medium">Company Name</p>
                <p className="text-sm text-muted-foreground">{application.companyInfo.companyName}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Role Offered</p>
                <p className="text-sm text-muted-foreground">{application.companyInfo.roleOffered}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Stipend</p>
                <p className="text-sm text-muted-foreground">₹{application.companyInfo.stipend}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Duration</p>
                <p className="text-sm text-muted-foreground">{application.companyInfo.duration} months</p>
              </div>
              <div>
                <p className="text-sm font-medium">Internship Year</p>
                <p className="text-sm text-muted-foreground">{application.companyInfo.internshipYear}</p>
              </div>
            </div>
          </div>

          {/* HR Details */}
          <div className="border rounded p-4">
            <h3 className="text-md font-semibold mb-2">HR Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <p className="text-sm font-medium">HR Name</p>
                <p className="text-sm text-muted-foreground">{application.companyInfo.hrName}</p>
              </div>
              <div>
                <p className="text-sm font-medium">HR Mobile</p>
                <p className="text-sm text-muted-foreground">{application.companyInfo.hrMobile}</p>
              </div>
              <div>
                <p className="text-sm font-medium">HR Email</p>
                <p className="text-sm text-muted-foreground">{application.companyInfo.hrEmail}</p>
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
                  {format(new Date(application.internshipDuration.startDate), "MMM dd, yyyy")}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">End Date</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(application.internshipDuration.endDate), "MMM dd, yyyy")}
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
                {application.documents.offerLetter ? (
                  <Link 
                    to={`/document/view/${application.id}/offerLetter`}
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
                {application.documents.nocByHod ? (
                  <Link 
                    to={`/document/view/${application.id}/nocByHod`}
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
                {application.documents.studentLetterToHod ? (
                  <Link 
                    to={`/document/view/${application.id}/studentLetterToHod`}
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
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationDetailsDialog;

