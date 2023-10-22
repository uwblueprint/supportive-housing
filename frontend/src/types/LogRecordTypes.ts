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
  residents: string[];
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
  | "residents"
> | null;

export type CountLogRecordFilters = {
  building?: string;
  employeeId?: number[];
  attnTo?: number[];
  dateRange?: string[];
  residents?: number[];
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
