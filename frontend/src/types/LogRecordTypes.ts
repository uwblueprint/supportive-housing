type NameRecord = {
  id: number;
  firstName: string;
  lastName: string;
};

type BuildingRecord = {
  id: number;
  name: string;
};

export type LogRecord = {
  logId: number;
  attnTo: NameRecord | null;
  employee: NameRecord;
  building: BuildingRecord;
  datetime: string;
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
  | "employee"
  | "flagged"
  | "note"
  | "residents"
> | null;

export type CountLogRecordFilters = {
  buildings?: number[];
  employees?: number[];
  attnTos?: number[];
  dateRange?: string[];
  residents?: number[];
  tags?: number[];
  flagged?: boolean;
};

export type CreateLogRecordParams = {
  employeeId: number;
  residents: number[];
  datetime: Date;
  flagged: boolean;
  note: string;
  tags: number[];
  buildingId: number;
  attnTo?: number;
};

export type EditLogRecordParams = {
  logId: number;
  employeeId: number;
  residents: number[];
  datetime: Date;
  flagged: boolean;
  note: string;
  tags: number[];
  buildingId: number;
  attnTo?: number;
};

export type LogRecordFilters = CountLogRecordFilters & {
  returnAll?: boolean;
  pageNumber?: number;
  resultsPerPage?: number;
};
