
export type UserRole = "student" | "admin";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
}

export interface StudentInfo {
  rollNumber: string;
  course: string;
  branch: string;
  year: string;
  semester: string;
  email: string;
  mobileNumber: string;
  academicYear: string;
}

export interface CompanyInfo {
  companyName: string;
  roleOffered: string;
  stipend: string;
  duration: string;
  hrName: string;
  hrMobile: string;
  hrEmail: string;
}

export interface InternshipDuration {
  startDate: Date | null;
  endDate: Date | null;
}

export interface Documents {
  offerLetter?: File | null;
  nocByHod?: File | null;
  studentLetterToHod?: File | null;
}

export interface InternshipApplication {
  id: string;
  studentId: string;
  studentInfo: StudentInfo;
  companyInfo: CompanyInfo;
  internshipDuration: InternshipDuration;
  documents: Documents;
  createdAt: Date;
  status: "pending" | "approved" | "rejected" | "completed";
}

export interface FeedbackForm {
  id: string;
  applicationId: string;
  studentId: string;
  rating: number;
  experience: string;
  skills: string;
  suggestions: string;
  createdAt: Date;
}
