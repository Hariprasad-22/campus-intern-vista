
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import {
  StudentInfo,
  CompanyInfo,
  InternshipDuration,
  Documents,
  InternshipApplication,
} from "@/types";
import { Progress } from "@/components/ui/progress";
import StudentInfoForm from "./StudentInfoForm";
import CompanyInfoForm from "./CompanyInfoForm";
import InternshipDurationForm from "./InternshipDurationForm";
import DocumentsUploadForm from "./DocumentsUploadForm";
import { applications } from "@/data/mockData";
import { v4 as uuidv4 } from "uuid";

const InternshipFormContainer: React.FC = () => {
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(25);
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [internshipDuration, setInternshipDuration] = useState<InternshipDuration | null>(null);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleStudentInfoSubmit = (data: StudentInfo) => {
    setStudentInfo(data);
    setStep(2);
    setProgress(50);
  };

  const handleCompanyInfoSubmit = (data: CompanyInfo) => {
    setCompanyInfo(data);
    setStep(3);
    setProgress(75);
  };

  const handleDurationSubmit = (data: InternshipDuration) => {
    setInternshipDuration(data);
    setStep(4);
    setProgress(100);
  };

  const handleDocumentsSubmit = (data: Documents) => {
    // Here we would normally submit to the backend
    if (user && studentInfo && companyInfo && internshipDuration) {
      const newApplication: InternshipApplication = {
        id: uuidv4(),
        studentId: user.id,
        studentInfo,
        companyInfo,
        internshipDuration,
        documents: data,
        createdAt: new Date(),
        status: "pending",
      };

      // In a real app, we'd send this to an API
      applications.push(newApplication);
      
      toast.success("Application submitted successfully!");
      navigate("/dashboard");
    } else {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "Student Information";
      case 2:
        return "Company & Role Details";
      case 3:
        return "Internship Duration";
      case 4:
        return "Required Documents";
      default:
        return "Internship Application";
    }
  };

  if (!user) return null;

  return (
    <div className="p-6 bg-white rounded-md shadow-sm max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <div className="bg-gray-100 rounded-full py-1 px-4 inline-block mb-4">
          Internship Record Form
        </div>
        <h1 className="text-3xl font-bold mb-2">Internship Application</h1>
        <p className="text-gray-600">
          Please fill in the details of your internship for our records
        </p>
      </div>

      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span>Step {step} of 4</span>
          <span>{progress}% completed</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-6">{getStepTitle()}</h2>

        {step === 1 && (
          <StudentInfoForm
            onSubmit={handleStudentInfoSubmit}
            studentEmail={user.email}
          />
        )}

        {step === 2 && (
          <CompanyInfoForm
            onSubmit={handleCompanyInfoSubmit}
            onBack={() => {
              setStep(1);
              setProgress(25);
            }}
          />
        )}

        {step === 3 && (
          <InternshipDurationForm
            onSubmit={handleDurationSubmit}
            onBack={() => {
              setStep(2);
              setProgress(50);
            }}
          />
        )}

        {step === 4 && (
          <DocumentsUploadForm
            onSubmit={handleDocumentsSubmit}
            onBack={() => {
              setStep(3);
              setProgress(75);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default InternshipFormContainer;
