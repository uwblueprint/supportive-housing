export type LogRecord = {
  logId: number;
  attnTo?: number;
  attnToFirstName?: string;
  attnToLastName?: string;
  building: string;
  datetime: string;
  employeeId: number;
  employeeFirstName: string;
  employeeLastName: string;
  flagged: boolean;
  note: string;
  residentId: string;
  tags: string[];
};

export type GetLogRecordsReponse = {
  logRecords: LogRecord[];
} | null;

export type GetLogRecordCountResponse = {
  numResults: number;
} | null;

export type PostLogRecordsResponse = Omit<
LogRecord, 
'logId' | 'attnToFirstName' | 'attnToLastName' | 'employeeFirstName' | 'employeeLastName' | 'tags'
> | null;
