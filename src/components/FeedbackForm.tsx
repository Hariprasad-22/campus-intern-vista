
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
  rating: z.number().min(1).max(5),
  experience: z.string().min(10, "Please provide more details about your experience"),
  skills: z.string().min(3, "Please list at least one skill learned"),
  suggestions: z.string().optional(),
});

type FeedbackFormProps = {
  applicationId: string;
};

const FeedbackForm: React.FC<FeedbackFormProps> = ({ applicationId }) => {
  const [rating, setRating] = useState(3);
  const { user } = useAuth();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof feedbackSchema>>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      rating: 3,
      experience: "",
      skills: "",
      suggestions: "",
    },
  });

  const onSubmit = (data: z.infer<typeof feedbackSchema>) => {
    if (!user) return;

    const newFeedback: FeedbackFormType = {
      id: uuidv4(),
      applicationId,
      studentId: user.id,
      rating: data.rating,
      experience: data.experience,
      skills: data.skills,
      suggestions: data.suggestions || "",
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
        <h1 className="text-3xl font-bold">Feedback Form</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                <FormDescription>
                  Rate your internship experience (1-5)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="experience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Describe your experience</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Please share your internship experience..."
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="skills"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Skills Learned</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. React, TypeScript, Node.js"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  List the key skills you gained during the internship
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="suggestions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Suggestions for Improvement</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Any suggestions to improve the internship program..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Optional</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Submit Feedback
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default FeedbackForm;
