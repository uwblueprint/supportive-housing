import baseAPIClient from "./BaseAPIClient";

const filterLogRecords = async (
  building: string,
  employeeId: string,
  attentionTo: string,
  dateRange: string[],
  tags: string,
  flagged: boolean,
): Promise<any> => {
  try {
    const { data } = await baseAPIClient.get("/log_records", {
      params: {
        filters: {
          building,
          employeeId,
          attentionTo,
          dateRange,
          tags,
          flagged,
        },
      },
    });
    return data;
  } catch (error) {
    return null;
  }
};

export default {
  filterLogRecords,
};
