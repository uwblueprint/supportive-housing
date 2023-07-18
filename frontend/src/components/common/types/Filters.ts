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
