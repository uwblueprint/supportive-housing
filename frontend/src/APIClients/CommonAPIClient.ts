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
): Promise<any> => {
  try {
    const bearerToken = `Bearer ${getLocalStorageObjProperty(
      AUTHENTICATED_USER_KEY,
      "accessToken",
    )}`;
    const { data } = await baseAPIClient.get("/log_records", {
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
<<<<<<< HEAD
=======
    // TODO: more descriptive error / throw an exception potentially?
>>>>>>> 4fc85fa95d005c9266052e8752df6480ea05509a
    return null;
  }
};

export default {
  filterLogRecords,
};
