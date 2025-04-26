
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { applications } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Eye } from "lucide-react";
import Header from "@/components/Header";

const DocumentView: React.FC = () => {
  const { id, docType } = useParams<{ id: string; docType: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showPreview, setShowPreview] = useState(true);

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
  let documentObj = null;
  
  switch (docType) {
    case "offerLetter":
      documentName = "Offer Letter";
      documentObj = application.documents.offerLetter;
      break;
    case "nocByHod":
      documentName = "NOC by HOD";
      documentObj = application.documents.nocByHod;
      break;
    case "studentLetterToHod":
      documentName = "Student Letter to HOD";
      documentObj = application.documents.studentLetterToHod;
      break;
    default:
      documentName = "Document";
  }

  const handleDownload = () => {
    // In a real application, this would trigger the actual file download
    alert("Document download started. In a real application, this would download the actual file.");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto py-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">{documentName}</h1>
            <div className="flex gap-2">
              <Button 
                onClick={handleDownload}
                variant="secondary"
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-medium mb-2">Document Details:</h2>
            <p><strong>Student:</strong> {application.studentInfo.fullName}</p>
            <p><strong>Roll Number:</strong> {application.studentInfo.rollNumber}</p>
            <p><strong>Company:</strong> {application.companyInfo.companyName}</p>
            <p><strong>Document Type:</strong> {documentName}</p>
          </div>

          <div className="border border-gray-200 rounded-md">
            <div className="bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center">
              <div className="text-sm font-medium">Document Preview</div>
              <div>
                <Button variant="ghost" size="sm" onClick={() => setShowPreview(!showPreview)}>
                  <Eye className="h-4 w-4 mr-2" />
                  {showPreview ? "Hide Preview" : "Show Preview"}
                </Button>
              </div>
            </div>
            
            {showPreview ? (
              <div className="p-8 min-h-[500px] flex items-center justify-center">
                {documentObj ? (
                  <iframe
                    className="w-full h-[500px]"
                    src={documentObj instanceof File ? URL.createObjectURL(documentObj) : "/placeholder.svg"}
                    title={documentName}
                  />
                ) : (
                  <div className="text-center text-gray-500">
                    <p className="mb-4">This is a placeholder for the {documentName.toLowerCase()}.</p>
                    <p>In a real application, the actual document would be displayed here.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <p>Document preview is hidden.</p>
                <p>Click "Show Preview" to view the document.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentView;
