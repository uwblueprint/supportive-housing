export type LogRecord = {
  logId: number;
  attnTo?: number;
  attnToFirstName?: string;
  attnToLastName?: string;
  buildingId: number;
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
  | "buildingId"
  | "datetime"
  | "employeeId"
  | "flagged"
  | "note"
  | "residentId"
> | null;

export type CountLogRecordFilters = {
  buildingId?: number[];
  employeeId?: number[];
  attnTo?: number[];
  dateRange?: string[];
  residentId?: number[];
  tags?: string[];
  flagged?: boolean;
};

export type CreateLogRecordParams = {
  employeeId: number;
  residentId: number;
  datetime: Date;
  flagged: boolean;
  note: string;
  tags: string[];
  buildingId: number;
  attnTo?: number;
};

export type EditLogRecordParams = {
  logId: number;
  employeeId: number;
  residentId: number;
  datetime: Date;
  flagged: boolean;
  note: string;
  tags: string[];
  buildingId: number;
  attnTo?: number;
};

export type LogRecordFilters = CountLogRecordFilters & {
  returnAll?: boolean;
  pageNumber?: number;
  resultsPerPage?: number;
};
