
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { FeedbackForm as FeedbackFormType } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { feedbacks } from "@/data/mockData";
import { v4 as uuidv4 } from "uuid";

const feedbackSchema = z.object({
  studentName: z.string().min(1, "Name is required"),
  mobileNumber: z.string().min(10, "Enter a valid mobile number"),
  rollNumber: z.string().min(1, "Roll number is required"),
  academicYear: z.string().min(1, "Academic year is required"),
  rating: z.number().min(1).max(5),
  feedback: z.string()
    .min(10, "Please provide more details about your experience")
    .max(200, "Feedback should not exceed 200 words"),
  experience: z.string()
    .min(10, "Please provide details about your experience")
    .default(""),
  skills: z.string().min(1, "Please list skills you gained").default(""),
});

type FeedbackFormProps = {
  applicationId: string;
  companyName: string;
  role: string;
};

const FeedbackForm: React.FC<FeedbackFormProps> = ({ applicationId, companyName, role }) => {
  const [rating, setRating] = useState(3);
  const { user } = useAuth();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof feedbackSchema>>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      studentName: "",
      mobileNumber: "",
      rollNumber: "",
      academicYear: "",
      rating: 3,
      feedback: "",
      experience: "",
      skills: "",
    },
  });

  const onSubmit = (data: z.infer<typeof feedbackSchema>) => {
    if (!user) return;

    const newFeedback: FeedbackFormType = {
      id: uuidv4(),
      applicationId,
      studentId: user.id,
      studentName: data.studentName,
      mobileNumber: data.mobileNumber,
      rollNumber: data.rollNumber,
      academicYear: data.academicYear,
      companyName,
      role,
      rating: data.rating,
      feedback: data.feedback,
      experience: data.experience,
      skills: data.skills,
      createdAt: new Date(),
    };

    // In a real app, we'd send this to an API
    feedbacks.push(newFeedback);
    
    toast.success("Feedback submitted successfully!");
    navigate("/dashboard");
  };

  return (
    <div className="p-6 bg-white rounded-md shadow-sm max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Internship Feedback</h1>
        <p className="text-gray-600 mt-2">
          Your feedback is valuable for future interns at {companyName}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="studentName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mobileNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your mobile number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rollNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Roll Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your roll number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="academicYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Academic Year</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 2023-24" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="col-span-2">
              <p className="text-sm font-medium mb-1">Company Details</p>
              <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-md">
                <div>
                  <p className="text-sm font-medium">Company</p>
                  <p className="text-sm text-gray-600">{companyName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Role</p>
                  <p className="text-sm text-gray-600">{role}</p>
                </div>
              </div>
            </div>

            <div className="col-span-2">
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Overall Rating</FormLabel>
                    <div className="flex items-center space-x-2">
                      <span className="w-8 text-center">1</span>
                      <FormControl>
                        <Slider
                          defaultValue={[rating]}
                          min={1}
                          max={5}
                          step={1}
                          onValueChange={(value) => {
                            setRating(value[0]);
                            field.onChange(value[0]);
                          }}
                          className="max-w-sm"
                        />
                      </FormControl>
                      <span className="w-8 text-center">5</span>
                    </div>
                    <FormDescription>Rate your internship experience (1-5)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-2">
              <FormField
                control={form.control}
                name="feedback"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Feedback</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Share your internship experience (maximum 200 words)..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide detailed feedback about your internship experience
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-2">
              <FormField
                control={form.control}
                name="skills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skills Gained</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. React, TypeScript, Project Management"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      List the skills you gained during your internship
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-2">
              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Learning Experience</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe what you learned during your internship..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Share your learning experience and key takeaways
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            Submit Feedback
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default FeedbackForm;
