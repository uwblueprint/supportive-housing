export type LogRecord = {
  attnTo: number;
  attnToFirstName: string;
  attnToLastName: string;
  building: string;
  datetime: string;
  employeeId: number;
  employeeFirstName: string;
  employeeLastName: string;
  flagged: boolean;
  logId: number;
  note: string;
  residentId: string;
  tags: string[];
};

export type GetLogRecordsReponse = {
  logRecords: LogRecord[];
  numResults: number;
} | null;
