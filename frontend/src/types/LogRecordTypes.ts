type NameRecord = {
  id: number;
  firstName: string;
  lastName: string;
};

export type LogRecord = {
  logId: number;
  attnTo?: NameRecord;
  employee: NameRecord;
  building: string;
  datetime: string;
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
  | "employee"
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

export type CreateLogRecordParams = {
  employeeId: number;
  residentId: number;
  datetime: Date;
  flagged: boolean;
  note: string;
  tags: string[];
  building: string;
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
  building: string;
  attnTo?: number;
};

export type LogRecordFilters = CountLogRecordFilters & {
  returnAll?: boolean;
  pageNumber?: number;
  resultsPerPage?: number;
};
