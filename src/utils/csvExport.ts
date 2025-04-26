
/**
 * Utility functions for CSV export functionality
 */

/**
 * Exports data to CSV format and triggers a download
 * @param data Array of arrays containing the data rows
 * @param filename Name of the file to download
 */
export const exportToCSV = (data: (string | number)[][], filename: string) => {
  const csvContent =
    "data:text/csv;charset=utf-8," + data.map((row) => row.join(",")).join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
