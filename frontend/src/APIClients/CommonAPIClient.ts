import AUTHENTICATED_USER_KEY from "../constants/AuthConstants";
import { getLocalStorageObjProperty } from "../utils/LocalStorageUtils";
import baseAPIClient from "./BaseAPIClient";

const filterLogRecords = async (
  building: string,
  employeeId: string[],
  attnTo: string[],
  dateRange: string[],
  tags: string[],
  flagged: boolean,
  return_all: boolean,
): Promise<any> => {
  try {
    const bearerToken = `Bearer ${getLocalStorageObjProperty(
      AUTHENTICATED_USER_KEY,
      "accessToken",
    )}`;
    const { data } = await baseAPIClient.get(
      `/log_records?return_all=${return_all}`,
      {
        params: {
          filters: {
            building,
            employeeId,
            attnTo,
            dateRange,
            tags,
            flagged,
          },
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
