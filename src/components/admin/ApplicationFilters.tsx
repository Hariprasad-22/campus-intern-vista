
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download } from "lucide-react";
import { branches, courses, companies } from "@/data/mockData";

// Define all possible years for filters
const academicYears = ["2022-23", "2023-24", "2024-25"];
const internshipYears = ["2022", "2023", "2024", "2025"];
const studentYears = ["1", "2", "3", "4", "5"];
const statuses = ["pending", "approved", "rejected", "completed"];

type FilterValues = {
  rollNumber: string;
  studentName: string;
  branch: string;
  year: string;
  course: string;
  academicYear: string;
  company: string;
  role: string;
  duration: string;
  internshipYear: string;
  status: string;
};

type ColumnVisibility = Record<string, boolean>;

type ApplicationFiltersProps = {
  filters: FilterValues;
  setFilters: React.Dispatch<React.SetStateAction<FilterValues>>;
  columnVisibility: ColumnVisibility;
  setColumnVisibility: React.Dispatch<React.SetStateAction<ColumnVisibility>>;
  handleExportToCSV: () => void;
};

const ApplicationFilters: React.FC<ApplicationFiltersProps> = ({
  filters,
  setFilters,
  columnVisibility,
  setColumnVisibility,
  handleExportToCSV,
}) => {
  const resetFilters = () => {
    setFilters({
      rollNumber: "",
      studentName: "",
      branch: "All Branches",
      year: "All Years",
      course: "All Courses",
      academicYear: "All Academic Years",
      company: "All Companies",
      role: "",
      duration: "",
      internshipYear: "All Internship Years",
      status: "All Status",
    });
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select
          value={filters.branch}
          onValueChange={(value) => setFilters({ ...filters, branch: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Branch" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key="all-branches" value="All Branches">All Branches</SelectItem>
            {branches.map((branch) => (
              <SelectItem key={branch} value={branch}>
                {branch}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.year}
          onValueChange={(value) => setFilters({ ...filters, year: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key="all-years" value="All Years">All Years</SelectItem>
            {studentYears.map((year) => (
              <SelectItem key={year} value={year}>
                Year {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.course}
          onValueChange={(value) => setFilters({ ...filters, course: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Course" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key="all-courses" value="All Courses">All Courses</SelectItem>
            {courses.map((course) => (
              <SelectItem key={course} value={course}>
                {course}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.academicYear}
          onValueChange={(value) => setFilters({ ...filters, academicYear: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Academic Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key="all-academic-years" value="All Academic Years">All Academic Years</SelectItem>
            {academicYears.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.company}
          onValueChange={(value) => setFilters({ ...filters, company: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Company" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key="all-companies" value="All Companies">All Companies</SelectItem>
            {companies.filter(company => company !== "").map((company) => (
              <SelectItem key={company} value={company}>
                {company}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.internshipYear}
          onValueChange={(value) => setFilters({ ...filters, internshipYear: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Internship Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key="all-internship-years" value="All Internship Years">All Internship Years</SelectItem>
            {internshipYears.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.status}
          onValueChange={(value) => setFilters({ ...filters, status: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key="all-status" value="All Status">All Status</SelectItem>
            {statuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          placeholder="Search by Roll Number"
          value={filters.rollNumber}
          onChange={(e) => setFilters({ ...filters, rollNumber: e.target.value })}
          className="w-full"
        />

        <Input
          placeholder="Search by Student Name"
          value={filters.studentName}
          onChange={(e) => setFilters({ ...filters, studentName: e.target.value })}
          className="w-full"
        />

        <div className="flex justify-between items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Display Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {Object.keys(columnVisibility).map((column) => (
                <DropdownMenuCheckboxItem
                  key={column}
                  checked={columnVisibility[column]}
                  onCheckedChange={(checked) => {
                    setColumnVisibility({
                      ...columnVisibility,
                      [column]: checked,
                    });
                  }}
                >
                  {column
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())
                    .trim()}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4">
        <Button
          variant="outline"
          onClick={resetFilters}
        >
          Reset Filters
        </Button>
        <Button
          variant="outline"
          onClick={handleExportToCSV}
        >
          <Download className="h-4 w-4 mr-2" />
          Export to CSV
        </Button>
      </div>
    </>
  );
};

export default ApplicationFilters;
