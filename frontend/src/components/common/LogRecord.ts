export type LogRecord = {
  logId: number;
  attnTo: number;
  attnToFirstName: string;
  attnToLastName: string;
  building: string;
  datetime: string;
  employeeId: number;
  employeeFirstName: string;
  employeeLastName: string;
  flagged: boolean;
  note: string;
  residentFirstName: string;
  residentLastName: string;
  tags: string[];
};
