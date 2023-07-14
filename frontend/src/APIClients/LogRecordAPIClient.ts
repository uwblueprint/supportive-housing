import AUTHENTICATED_USER_KEY from "../constants/AuthConstants";
import { getLocalStorageObjProperty } from "../utils/LocalStorageUtils";
import baseAPIClient from "./BaseAPIClient";
import { PostLogRecordsResponse } from "../types/LogRecordTypes";

const createLog = async(
    userId: number,
    residentId: number,
    flagged: boolean,
    note: string,
    attentionTo: number,
    building: string,
) : Promise<PostLogRecordsResponse> => {
    try {
        const bearerToken = `Bearer ${getLocalStorageObjProperty(
          AUTHENTICATED_USER_KEY,
          "accessToken",
        )}`;

        const { data } = await baseAPIClient.post<PostLogRecordsResponse>(
            "/log_records/",
            { 
                employeeId: userId, 
                residentId,
                flagged,
                note,
                attnTo: attentionTo,
                building,
            },
            { headers: { Authorization: bearerToken } },
        );
        return data;
      } catch (error) {
        return null;
      }
}

export default {
  createLog,
};
