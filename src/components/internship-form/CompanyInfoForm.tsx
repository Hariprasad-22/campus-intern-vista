import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CompanyInfo } from "@/types";
import { companies } from "@/data/mockData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

const companyInfoSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  roleOffered: z.string().min(1, "Role is required"),
  stipend: z.string().min(1, "Stipend is required"),
  duration: z.string().min(1, "Duration is required"),
  internshipYear: z.string().min(1, "Internship year is required"),
  hrName: z.string().min(1, "HR name is required"),
  hrMobile: z.string().regex(/^\d{10}$/, "HR mobile number must be exactly 10 digits"),
  hrEmail: z.string().email("Invalid HR email format"),
});

type CompanyInfoFormProps = {
  defaultValues?: Partial<CompanyInfo>;
  onSubmit: (data: CompanyInfo) => void;
  onBack: () => void;
};

const CompanyInfoForm: React.FC<CompanyInfoFormProps> = ({
  defaultValues,
  onSubmit,
  onBack,
}) => {
  const form = useForm<CompanyInfo>({
    resolver: zodResolver(companyInfoSchema),
    defaultValues: defaultValues || {
      companyName: "",
      roleOffered: "",
      stipend: "",
      duration: "",
      internshipYear: "",
      hrName: "",
      hrMobile: "",
      hrEmail: "",
    },
  });

  const [open, setOpen] = React.useState(false);
  const [customCompany, setCustomCompany] = React.useState("");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Company Name</FormLabel>
                <div className="flex flex-col gap-2">
                  <Input
                    placeholder="Enter company name"
                    value={customCompany}
                    onChange={(e) => {
                      setCustomCompany(e.target.value);
                      form.setValue("companyName", e.target.value);
                    }}
                  />
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="justify-between"
                      >
                        Or select from list
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search company..." />
                        <CommandList>
                          <CommandEmpty>No company found.</CommandEmpty>
                          <CommandGroup>
                            {companies.map((company) => (
                              <CommandItem
                                key={company}
                                value={company}
                                onSelect={(value) => {
                                  setCustomCompany(value);
                                  form.setValue("companyName", value);
                                  setOpen(false);
                                }}
                              >
                                {company}
                                <Check
                                  className={cn(
                                    "ml-auto h-4 w-4",
                                    customCompany === company
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="roleOffered"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role Offered</FormLabel>
                <FormControl>
                  <Input placeholder="Software Engineer Intern" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stipend"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stipend (Monthly in ₹)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="15000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (Months)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="3" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="internshipYear"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Internship Year</FormLabel>
                <FormControl>
                  <Input 
                    type="text" 
                    placeholder="2024" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hrName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>HR Name</FormLabel>
                <FormControl>
                  <Input placeholder="Jane Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hrMobile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>HR Mobile Number</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="9876543210" 
                    maxLength={10}
                    pattern="\d{10}"
                    inputMode="numeric"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hrEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>HR Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="hr@company.com"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button type="submit">Continue</Button>
        </div>
      </form>
    </Form>
  );
};

export default CompanyInfoForm;
