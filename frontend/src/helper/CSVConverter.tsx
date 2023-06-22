import { LogRecord } from "../types/LogRecordTypes";
import { CSVLog } from "../types/CSVLog";

const convertToCSVLog = (logRecord: LogRecord): CSVLog => {
  const attnTo = `${logRecord.attnToFirstName} ${logRecord.attnToLastName}`;
  const employee = `${logRecord.employeeFirstName} ${logRecord.employeeLastName}`;
  
  return {
    attnTo,
    building: logRecord.building,
    datetime: logRecord.datetime,
    employee,
    flagged: logRecord.flagged,
    note: logRecord.note,
    residentFirstName: logRecord.residentFirstName,
    residentLastName: logRecord.residentLastName,
    tags: logRecord.tags.join("; "),
  };
};

const CSVConverter = (data: LogRecord[]): boolean => {
  // Convert JSON to CSV
  try {
    const csvRows = [];

    const headers = ["attnTo", "building", "datetime", "employee", "flagged", "note", "residentFirstName", "residentLastName", "tags"];
    csvRows.push(headers.join(","));
    data.forEach((log: LogRecord) => {
      const logCSV = convertToCSVLog(log); 
      const values = Object.values(logCSV).join(",");
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
