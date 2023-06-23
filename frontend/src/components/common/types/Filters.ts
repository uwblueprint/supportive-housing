export type CountLogRecordFilters = {
  building?: string;
  employeeId?: string[];
  attnTo?: string[];
  dateRange?: string[];
  tags?: string[];
  flagged?: boolean;
}

export type LogRecordFilters = CountLogRecordFilters & {
  returnAll?: boolean;
  pageNumber?: number;
  resultsPerPage?: number;
};
