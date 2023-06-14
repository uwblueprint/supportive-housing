export type LogRecordFilters = {
    building?: string,
    employeeId?: string[],
    attnTo?: string[],
    dateRange?: string[],
    tags?: string[],
    flagged?: boolean,
    return_all?: boolean,
};