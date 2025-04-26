import { InternshipApplication, User, FeedbackForm } from "../types";

export const users: User[] = [
  {
    id: "1",
    email: "student@college.edu",
    role: "student",
    name: "John Student",
  },
  {
    id: "2",
    email: "admin@college.edu",
    role: "admin",
    name: "Admin User",
  },
];

export const companies = [
  "",
  "Google",
  "Microsoft",
  "Amazon",
  "Apple",
  "Meta",
  "Netflix",
  "Tesla",
  "IBM",
  "Oracle",
  "Intel",
  "Adobe",
  "Cisco",
  "Salesforce",
  "Twitter",
  "Uber",
  "Airbnb",
  "LinkedIn",
  "PayPal",
  "eBay",
  "Spotify",
];

export const branches = [
  "Computer Science",
  "Information Technology",
  "Electronics and Communication",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Chemical Engineering",
  "Biotechnology",
];

export const courses = [
  "B.Tech",
  "M.Tech"
];

const mockApplications: InternshipApplication[] = [
  {
    id: "app1",
    studentId: "1",
    studentInfo: {
      fullName: "John Student",
      rollNumber: "CS20B1001",
      course: "B.Tech",
      branch: "Computer Science",
      year: "3",
      semester: "5",
      email: "student@college.edu",
      mobileNumber: "9876543210",
      academicYear: "2023-24",
    },
    companyInfo: {
      companyName: "Google",
      roleOffered: "Software Engineer Intern",
      stipend: "50000",
      duration: "3",
      hrName: "Jane Doe",
      hrMobile: "9876543211",
      hrEmail: "jane@google.com",
    },
    internshipDuration: {
      startDate: new Date("2023-05-15"),
      endDate: new Date("2023-08-15"),
    },
    documents: {
      offerLetter: null,
      nocByHod: null,
      studentLetterToHod: null
    },
    createdAt: new Date("2023-04-10"),
    status: "completed",
  },
];

export const applications: InternshipApplication[] = [
  {
    id: "app-1",
    studentId: "student-1",
    studentInfo: {
      fullName: "John Doe",
      rollNumber: "2022CS001",
      course: "B.Tech",
      branch: "Computer Science",
      year: "3",
      semester: "5",
      email: "john.doe@example.com",
      mobileNumber: "9876543210",
      academicYear: "2023-24",
    },
    companyInfo: {
      companyName: "Google",
      roleOffered: "Software Engineer Intern",
      stipend: "50000",
      duration: "3",
      internshipYear: "2024",
      hrName: "Jane Smith",
      hrMobile: "9876543210",
      hrEmail: "hr@google.com",
    },
    internshipDuration: {
      startDate: new Date("2024-05-15"),
      endDate: new Date("2024-08-15"),
    },
    documents: {
      offerLetter: null,
      nocByHod: null,
      studentLetterToHod: null,
    },
    createdAt: new Date("2024-03-10"),
    status: "pending",
  },
  {
    id: "app-2",
    studentId: "student-2",
    studentInfo: {
      fullName: "Alice Johnson",
      rollNumber: "2021EC045",
      course: "B.Tech",
      branch: "Electronics",
      year: "4",
      semester: "7",
      email: "alice.johnson@example.com",
      mobileNumber: "9876543211",
      academicYear: "2023-24",
    },
    companyInfo: {
      companyName: "Microsoft",
      roleOffered: "Frontend Developer Intern",
      stipend: "45000",
      duration: "2",
      internshipYear: "2024",
      hrName: "Robert Brown",
      hrMobile: "9876543212",
      hrEmail: "hr@microsoft.com",
    },
    internshipDuration: {
      startDate: new Date("2024-06-01"),
      endDate: new Date("2024-07-31"),
    },
    documents: {
      offerLetter: null,
      nocByHod: null,
      studentLetterToHod: null,
    },
    createdAt: new Date("2024-03-15"),
    status: "approved",
  },
];

export const feedbacks: FeedbackForm[] = [
  {
    id: "feed1",
    applicationId: "app1",
    studentId: "1",
    studentName: "John Student",
    mobileNumber: "9876543210",
    rollNumber: "CS20B1001",
    academicYear: "2023-24",
    companyName: "Google",
    role: "Software Engineer Intern",
    rating: 0,
    feedback: "The internship was very educational and helped me grow professionally.",
    experience: "It was a great learning experience working with professionals.",
    skills: "React, TypeScript, Node.js",
    suggestions: "More focus on real-world projects would be helpful.",
    createdAt: new Date("2023-08-20"),
  },
];

// Helper function to simulate user authentication
export const authenticate = (email: string, password: string): User | null => {
  if (password !== "password123") return null;
  return users.find(user => user.email === email) || null;
};
