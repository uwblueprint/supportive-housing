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
  attnTos: string[];
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
  | "attnTos"
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
  dateRange?: (string | null)[];
  residents?: number[];
  tags?: number[];
  flagged?: boolean;
};

export type CreateLogRecordParams = {
  employeeId: number;
  residents: number[];
  datetime: string;
  flagged: boolean;
  note: string;
  tags: number[];
  buildingId: number;
  attnTos: number[];
};

export type EditLogRecordParams = {
  logId: number;
  employeeId: number;
  residents: number[];
  datetime: string;
  flagged: boolean;
  note: string;
  tags: number[];
  buildingId: number;
  attnTos: number[];
};

export type LogRecordFilters = CountLogRecordFilters & {
  returnAll?: boolean;
  pageNumber?: number;
  resultsPerPage?: number;
  sortDirection?: string;
};
