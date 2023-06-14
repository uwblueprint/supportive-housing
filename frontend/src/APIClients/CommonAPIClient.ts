import AUTHENTICATED_USER_KEY from "../constants/AuthConstants";
import { getLocalStorageObjProperty } from "../utils/LocalStorageUtils";
import baseAPIClient from "./BaseAPIClient";

import { LogRecordFilters } from "../components/common/types/Filters";

const filterLogRecords = async ({
  building = "",
  employeeId = [],
  attnTo = [],
  dateRange = [],
  tags = [],
  flagged = false,
  return_all = false,
  }: LogRecordFilters
): Promise<any> => {
  try {
    const bearerToken = `Bearer ${getLocalStorageObjProperty(
      AUTHENTICATED_USER_KEY,
      "accessToken",
    )}`;
    const { data } = await baseAPIClient.get(
      `/log_records`,
      {
        params: {
          filters: {
            building,
            employeeId,
            attnTo,
            dateRange,
            tags,
            flagged,
          }, return_all 
        },
        headers: { Authorization: bearerToken },
      });
    return data;
  } catch (error) {
    // TODO: more descriptive error / throw an exception potentially?
    return null;
  }
};

export default {
  filterLogRecords,
};
