import { LogRecord } from "../types/LogRecordTypes";
import { CSVLog } from "../types/CSVLog";

const convertToCSVLog = (logRecord: LogRecord): CSVLog => {
  return {
    attnTo:
      logRecord.attnTo != null
        ? `${logRecord.attnTo.firstName} ${logRecord.attnTo.lastName}`
        : "",
    building: `"${logRecord.building.name}"`,
    datetime: `"${logRecord.datetime}"`,
    employee: `"${logRecord.employee.firstName} ${logRecord.employee.lastName}"`,
    flagged: logRecord.flagged,
    note: `"${logRecord.note}"`,
    residentId: `"${logRecord.residentId}"`,
    tags: logRecord.tags != null ? logRecord.tags.join("; ") : "",
  };
};

const CSVConverter = (data: LogRecord[]): boolean => {
  // Convert JSON to CSV
  try {
    const csvRows = [];

    const headers = [
      "attnTo",
      "building",
      "datetime",
      "employee",
      "flagged",
      "note",
      "residentId",
      "tags",
    ];
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

    // Get date for file name
    // "fr-CA" formats the date into YYYY-MM-DD
    const dateToday = new Date();
    const dateTodayString = dateToday
      .toLocaleString("fr-CA", { timeZone: "America/Toronto" })
      .substring(0, 10);

    link.setAttribute("download", `log_records ${dateTodayString}.csv`);
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
