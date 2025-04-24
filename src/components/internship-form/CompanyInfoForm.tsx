
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CompanyInfo } from "@/types";
import { companies } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";

const companyInfoSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  roleOffered: z.string().min(1, "Role is required"),
  stipend: z.string().min(1, "Stipend is required"),
  duration: z.string().min(1, "Duration is required"),
  hrName: z.string().min(1, "HR name is required"),
  hrMobile: z.string().min(10, "HR mobile number must be at least 10 digits"),
  hrEmail: z.string().email("Invalid email format"),
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
  const [open, setOpen] = useState(false);
  const [customCompany, setCustomCompany] = useState(false);
  
  const form = useForm<CompanyInfo>({
    resolver: zodResolver(companyInfoSchema),
    defaultValues: {
      companyName: defaultValues?.companyName || "",
      roleOffered: defaultValues?.roleOffered || "",
      stipend: defaultValues?.stipend || "",
      duration: defaultValues?.duration || "",
      hrName: defaultValues?.hrName || "",
      hrMobile: defaultValues?.hrMobile || "",
      hrEmail: defaultValues?.hrEmail || "",
    },
  });

  const handleSubmit = (data: CompanyInfo) => {
    onSubmit(data);
  };

  const handleCustomCompany = (value: string) => {
    form.setValue("companyName", value);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6 max-w-2xl mx-auto"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Full Name of the Company</FormLabel>
                <div className="flex flex-col space-y-2">
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? customCompany
                              ? field.value
                              : field.value
                            : "Select company"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search company..." />
                        <CommandEmpty>
                          <div className="p-2">
                            <p>No company found.</p>
                            <Button
                              variant="outline"
                              className="mt-2 w-full"
                              onClick={() => {
                                setCustomCompany(true);
                                setOpen(false);
                              }}
                            >
                              Add custom company
                            </Button>
                          </div>
                        </CommandEmpty>
                        <CommandGroup>
                          {companies.map((company) => (
                            <CommandItem
                              key={company}
                              value={company}
                              onSelect={() => {
                                form.setValue("companyName", company);
                                setCustomCompany(false);
                                setOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  company === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {company}
                            </CommandItem>
                          ))}
                          <CommandItem
                            onSelect={() => {
                              setCustomCompany(true);
                              setOpen(false);
                            }}
                          >
                            <span>Other (specify)</span>
                          </CommandItem>
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  
                  {customCompany && (
                    <Input
                      placeholder="Enter company name"
                      value={field.value}
                      onChange={(e) => handleCustomCompany(e.target.value)}
                    />
                  )}
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
                  <Input placeholder="e.g. Software Engineer Intern" {...field} />
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
                <FormLabel>Stipend (₹)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 20000" {...field} />
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
                <FormLabel>Duration (months)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 3" {...field} />
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
                  <Input placeholder="e.g. John Doe" {...field} />
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
                  <Input placeholder="e.g. 9876543210" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hrEmail"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>HR Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="hr.email@company.com"
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
            Previous
          </Button>
          <Button type="submit">Continue</Button>
        </div>
      </form>
    </Form>
  );
};

export default CompanyInfoForm;
