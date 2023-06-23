import { LogRecord } from "../types/LogRecordTypes";

const CSVConverter = (data: LogRecord[]): boolean => {
  // Convert JSON to CSV
  try {
    const csvRows = [];

    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(","));
    data.forEach((log: LogRecord) => {
      const tags = log.tags.join("; ");
      const CSVLog = { ...log, tags };
      const values = Object.values(CSVLog).join(",");
      csvRows.push(values);
    });
    const csvContent = csvRows.join("\n");

    // Download CSV file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "log_records.csv");
    document.body.appendChild(link);
    link.click();

    // Cleanup created object
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return true;
  } catch {
    return false;
  }
};

export default CSVConverter;
