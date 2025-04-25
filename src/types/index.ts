
export interface FeedbackForm {
  id: string;
  applicationId: string;
  studentId: string;
  studentName: string;
  mobileNumber: string;
  rollNumber: string;
  academicYear: string;
  companyName: string;
  role: string;
  rating: number; // Keeping this for backwards compatibility
  feedback: string;
  experience: string;
  skills: string;
  suggestions?: string;
  createdAt: Date;
}
