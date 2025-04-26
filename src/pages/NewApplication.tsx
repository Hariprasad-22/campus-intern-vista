
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import Header from "@/components/Header";
import InternshipFormContainer from "@/components/internship-form/InternshipFormContainer";

// Custom error boundary component to catch select item errors
class SelectErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Select component error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="p-6 bg-red-50 border border-red-200 rounded-md">
          <h3 className="text-red-600 font-medium text-lg">Error in form components</h3>
          <p className="text-red-500 mt-2">
            There was an issue with one of the dropdown selects. Please try refreshing the page.
          </p>
          <p className="text-sm text-red-400 mt-4">
            Common issue: Make sure all SelectItem components have a non-empty value.
          </p>
          <button 
            onClick={() => this.setState({ hasError: false })}
            className="mt-4 px-4 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const NewApplication: React.FC = () => {
  const { user } = useAuth();
  
  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  // Redirect if not a student
  if (user.role !== "student") {
    return <Navigate to="/admin" />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto py-8">
        <SelectErrorBoundary>
          <InternshipFormContainer />
        </SelectErrorBoundary>
      </div>
    </div>
  );
};

export default NewApplication;
