import AUTHENTICATED_USER_KEY from "../constants/AuthConstants";
import { getLocalStorageObjProperty } from "../utils/LocalStorageUtils";
import baseAPIClient from "./BaseAPIClient";

const createLog = async(
    userId: number,
    residentId: number,
    flagged: boolean,
    note: string,
    attentionTo: number,
    building: string,
) : Promise<any> => {
    try {
        const bearerToken = `Bearer ${getLocalStorageObjProperty(
          AUTHENTICATED_USER_KEY,
          "accessToken",
        )}`;

        const { data } = await baseAPIClient.post(
            "/log_records/",
            { 
                employee_id: userId, 
                resident_id: residentId,
                flagged,
                note,
                attn_to: attentionTo,
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
