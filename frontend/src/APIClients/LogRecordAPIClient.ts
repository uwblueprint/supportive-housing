import AUTHENTICATED_USER_KEY from "../constants/AuthConstants";
import { getLocalStorageObjProperty } from "../utils/LocalStorageUtils";
import baseAPIClient from "./BaseAPIClient";

const createLog = async(
    userId: number,
    residentId: number,
    flagged: boolean,
    note: string,
    attentionTo: number,
) : Promise<any> => {
    try {
        const bearerToken = `Bearer ${getLocalStorageObjProperty(
          AUTHENTICATED_USER_KEY,
          "accessToken",
        )}`;

        const { data } = await baseAPIClient.post(
            "/log_records/",
            { userId, residentId, flagged, note, attentionTo },
            { headers: { Authorization: bearerToken } },
        );
        console.log(data)
        return data;
      } catch (error) {
        console.log(error);
        return false;
      }
}

export default {
  createLog,
};
