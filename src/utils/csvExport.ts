
/**
 * Utility functions for CSV export functionality
 */

/**
 * Exports data to CSV format and triggers a download
 * @param data Array of arrays containing the data rows
 * @param filename Name of the file to download
 */
export const exportToCSV = (data: (string | number)[][], filename: string) => {
  // Format the data for CSV
  const csvContent =
    "data:text/csv;charset=utf-8," + 
    data.map(row => 
      row.map(cell => {
        // Handle cells that might contain commas by wrapping them in quotes
        const cellStr = String(cell);
        return cellStr.includes(",") ? `"${cellStr}"` : cellStr;
      }).join(",")
    ).join("\n");
    
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Creates a document link for CSV export
 * @param applicationId Application ID
 * @param docType Document type
 * @param isUploaded Whether the document is uploaded
 * @returns Document link or status text
 */
export const getDocumentLink = (applicationId: string, docType: string, isUploaded: boolean) => {
  if (!isUploaded) return "Not uploaded";
  const baseUrl = window.location.origin;
  return `${baseUrl}/document/view/${applicationId}/${docType}`;
};

