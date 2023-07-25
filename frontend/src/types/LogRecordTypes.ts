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

export type PostLogRecordsResponse = Pick<
  LogRecord,
  | "attnTo"
  | "building"
  | "datetime"
  | "employeeId"
  | "flagged"
  | "note"
  | "residentId"
> | null;

export type CountLogRecordFilters = {
  building?: string;
  employeeId?: number[];
  attnTo?: number[];
  dateRange?: string[];
  residentId?: number[];
  tags?: string[];
  flagged?: boolean;
};

export type LogRecordFilters = CountLogRecordFilters & {
  returnAll?: boolean;
  pageNumber?: number;
  resultsPerPage?: number;
};
