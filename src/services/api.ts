
import axios from 'axios';
import { InternshipApplication, StudentInfo, CompanyInfo, InternshipDuration, Documents } from '@/types';

// This should be configured from environment variables in a production app
const API_URL = 'http://localhost:5000/api';

// Define the API response types
interface ApiResponse<T> {
  data: T;
  message?: string;
}

// Fetch all internship applications
export const fetchInternships = async (): Promise<InternshipApplication[]> => {
  try {
    const response = await axios.get<InternshipApplication[]>(`${API_URL}/internships`);
    return response.data;
  } catch (error) {
    console.error('Error fetching internships:', error);
    throw error;
  }
};

// Create a new internship application
export const createInternship = async (
  studentInfo: StudentInfo,
  companyInfo: CompanyInfo,
  internshipDuration: InternshipDuration,
  documents: Documents
): Promise<ApiResponse<InternshipApplication>> => {
  try {
    // Transform the data to match the MongoDB schema
    const internshipData = {
      // Student info
      fullName: studentInfo.fullName,
      rollNumber: studentInfo.rollNumber,
      course: studentInfo.course,
      branch: studentInfo.branch,
      year: studentInfo.year,
      semester: studentInfo.semester,
      email: studentInfo.email,
      mobileNumber: studentInfo.mobileNumber,
      academicYear: studentInfo.academicYear,
      
      // Company info
      companyName: companyInfo.companyName,
      roleOffered: companyInfo.roleOffered,
      stipend: companyInfo.stipend,
      durationMonths: companyInfo.duration,
      
      // HR details
      hrDetails: {
        name: companyInfo.hrName,
        mobileNumber: companyInfo.hrMobile,
        email: companyInfo.hrEmail
      },
      
      // Internship duration
      internshipDuration: {
        startDate: internshipDuration.startDate,
        endDate: internshipDuration.endDate
      },
      
      // Document paths would be handled by file uploads
      offerLetter: documents.offerLetter ? documents.offerLetter.name : null,
      nocByHOD: documents.nocByHod ? documents.nocByHod.name : null,
      studentLetterToHOD: documents.studentLetterToHod ? documents.studentLetterToHod.name : null
    };

    const response = await axios.post<ApiResponse<InternshipApplication>>(
      `${API_URL}/internships`, 
      internshipData
    );
    return response.data;
  } catch (error) {
    console.error('Error creating internship:', error);
    throw error;
  }
};

// Get a single internship application by ID
export const getInternshipById = async (id: string): Promise<InternshipApplication> => {
  try {
    const response = await axios.get<InternshipApplication>(`${API_URL}/internships/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching internship with ID ${id}:`, error);
    throw error;
  }
};

// Update a feedback for an internship
export const updateFeedback = async (
  id: string, 
  feedback: {
    company: string;
    role: string;
    feedbackText: string;
    skillsUsed: string;
    learningExperience: string;
  }
): Promise<ApiResponse<InternshipApplication>> => {
  try {
    const response = await axios.patch<ApiResponse<InternshipApplication>>(
      `${API_URL}/internships/${id}/feedback`,
      feedback
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating feedback for internship with ID ${id}:`, error);
    throw error;
  }
};

// File upload function
export const uploadFile = async (
  id: string,
  fileType: 'offerLetter' | 'nocByHod' | 'studentLetterToHod',
  file: File
): Promise<ApiResponse<{fileUrl: string}>> => {
  try {
    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileType', fileType);

    const response = await axios.post<ApiResponse<{fileUrl: string}>>(
      `${API_URL}/internships/${id}/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error uploading ${fileType} for internship with ID ${id}:`, error);
    throw error;
  }
};
