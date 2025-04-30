
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import {
  StudentInfo,
  CompanyInfo,
  InternshipDuration,
  Documents,
} from "@/types";
import { Progress } from "@/components/ui/progress";
import StudentInfoForm from "./StudentInfoForm";
import CompanyInfoForm from "./CompanyInfoForm";
import InternshipDurationForm from "./InternshipDurationForm";
import DocumentsUploadForm from "./DocumentsUploadForm";
import { supabase } from "@/integrations/supabase/client";

const InternshipFormContainer: React.FC = () => {
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(25);
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [internshipDuration, setInternshipDuration] = useState<InternshipDuration | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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

  const uploadDocument = async (file: File, path: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${path}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${user?.id}/${fileName}`;

    const { data, error } = await supabase.storage
      .from('internship-documents')
      .upload(filePath, file);

    if (error) {
      console.error(`Error uploading ${path}:`, error);
      throw error;
    }
    
    return filePath;
  };

  const handleDocumentsSubmit = async (documents: Documents) => {
    if (!user || !studentInfo || !companyInfo || !internshipDuration) {
      toast.error("Missing required information. Please complete all steps.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload documents to storage
      const documentPaths: Record<string, string | null> = {
        offer_letter_path: null,
        noc_by_hod_path: null,
        student_letter_to_hod_path: null
      };

      if (documents.offerLetter) {
        documentPaths.offer_letter_path = await uploadDocument(
          documents.offerLetter, 
          'offer_letter'
        );
      }

      if (documents.nocByHod) {
        documentPaths.noc_by_hod_path = await uploadDocument(
          documents.nocByHod,
          'noc_by_hod'
        );
      }

      if (documents.studentLetterToHod) {
        documentPaths.student_letter_to_hod_path = await uploadDocument(
          documents.studentLetterToHod,
          'student_letter_to_hod'
        );
      }

      // Save application data to Supabase - use the correct column names from database schema
      const { data, error } = await supabase
        .from('internship_applications')
        .insert([{  // Note: Supabase expects an array of objects here
          student_id: user.id,
          full_name: studentInfo.fullName,
          roll_number: studentInfo.rollNumber,
          course: studentInfo.course,
          branch: studentInfo.branch,
          year: studentInfo.year,
          semester: studentInfo.semester,
          email: studentInfo.email,
          mobile_number: studentInfo.mobileNumber,
          academic_year: studentInfo.academicYear,
          
          company_name: companyInfo.companyName,
          role_offered: companyInfo.roleOffered,
          stipend: companyInfo.stipend,
          duration: companyInfo.duration,
          internship_year: companyInfo.internshipYear,
          hr_name: companyInfo.hrName,
          hr_mobile: companyInfo.hrMobile,
          hr_email: companyInfo.hrEmail,
          
          start_date: internshipDuration.startDate,
          end_date: internshipDuration.endDate,
          
          offer_letter_path: documentPaths.offer_letter_path,
          noc_by_hod_path: documentPaths.noc_by_hod_path,
          student_letter_to_hod_path: documentPaths.student_letter_to_hod_path,
          
          status: 'pending'
        }])
        .select();

      if (error) {
        throw error;
      }

      toast.success("Application submitted successfully!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error submitting application:", error);
      toast.error(error.message || "Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
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
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
  );
};

export default InternshipFormContainer;
