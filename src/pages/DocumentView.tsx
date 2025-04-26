
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { applications } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";

const DocumentView: React.FC = () => {
  const { id, docType } = useParams<{ id: string; docType: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) {
    navigate("/login");
    return null;
  }

  const application = applications.find((app) => app.id === id);

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="container mx-auto py-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h1 className="text-2xl font-bold mb-4">Document Not Found</h1>
            <p>The requested document could not be found.</p>
            <Button 
              className="mt-4" 
              variant="outline" 
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Get the appropriate document name based on type
  let documentName = "";
  switch (docType) {
    case "offerLetter":
      documentName = "Offer Letter";
      break;
    case "nocByHod":
      documentName = "NOC by HOD";
      break;
    case "studentLetterToHod":
      documentName = "Student Letter to HOD";
      break;
    default:
      documentName = "Document";
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto py-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">{documentName}</h1>
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-medium mb-2">Document Details:</h2>
            <p><strong>Student:</strong> {application.studentInfo.fullName}</p>
            <p><strong>Roll Number:</strong> {application.studentInfo.rollNumber}</p>
            <p><strong>Company:</strong> {application.companyInfo.companyName}</p>
          </div>

          <div className="p-8 border border-gray-200 rounded-md flex items-center justify-center">
            <p className="text-gray-500">
              This is a placeholder for the {documentName.toLowerCase()}. 
              In a real application, the actual document would be displayed or embedded here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentView;
