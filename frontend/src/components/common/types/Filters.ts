export type LogRecordFilters = {
  building?: string;
  employeeId?: string[];
  attnTo?: string[];
  dateRange?: string[];
  tags?: string[];
  flagged?: boolean;
  returnAll?: boolean;
  pageNumber?: number;
  resultsPerPage?: number;
};
