
import React, { useState } from "react";
import { Documents } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

type DocumentsUploadFormProps = {
  onSubmit: (data: Documents) => void;
  onBack: () => void;
  isSubmitting?: boolean;
};

const DocumentsUploadForm: React.FC<DocumentsUploadFormProps> = ({
  onSubmit,
  onBack,
  isSubmitting = false,
}) => {
  const [documents, setDocuments] = useState<Documents>({
    offerLetter: null,
    nocByHod: null,
    studentLetterToHod: null,
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, docType: keyof Documents) => {
    if (event.target.files && event.target.files[0]) {
      setDocuments((prev) => ({
        ...prev,
        [docType]: event.target.files![0],
      }));
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(documents);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Offer Letter from Company
          </label>
          <Input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => handleFileChange(e, "offerLetter")}
            disabled={isSubmitting}
          />
          <p className="text-xs text-gray-500">
            Upload PDF or Word document (Max 2MB)
          </p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">
            NOC by HOD
          </label>
          <Input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => handleFileChange(e, "nocByHod")}
            disabled={isSubmitting}
          />
          <p className="text-xs text-gray-500">
            Upload PDF or Word document (Max 2MB)
          </p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Student Letter to HOD
          </label>
          <Input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => handleFileChange(e, "studentLetterToHod")}
            disabled={isSubmitting}
          />
          <p className="text-xs text-gray-500">
            Upload PDF or Word document (Max 2MB)
          </p>
        </div>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack} disabled={isSubmitting}>
          Previous
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Application"
          )}
        </Button>
      </div>
    </form>
  );
};

export default DocumentsUploadForm;
