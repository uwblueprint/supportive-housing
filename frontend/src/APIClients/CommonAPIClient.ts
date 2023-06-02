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
    // TODO: more descriptive error / throw an exception potentially?
    return null;
  }
};

const inviteUser = async (
  email: string,
  role: string,
  firstName: string,
  lastName: string,
): Promise<boolean> => {
  try {
    if (email === "") {
      return false;
    }
    const bearerToken = `Bearer ${getLocalStorageObjProperty(
      AUTHENTICATED_USER_KEY,
      "accessToken",
    )}`;
    await baseAPIClient.post(
      "/users/invite-user",
      { email, role, firstName, lastName },
      { headers: { Authorization: bearerToken } },
    );
    return true;
  } catch (error) {
    return false;
  }
};

const getUserStatus = async (email: string): Promise<string> => {
  try {
    if (email === "") {
      return "";
    }
    const bearerToken = `Bearer ${getLocalStorageObjProperty(
      AUTHENTICATED_USER_KEY,
      "accessToken",
    )}`;
    const { data } = await baseAPIClient.get("/users/user-status", {
      params: {
        email,
      },
      headers: { Authorization: bearerToken },
    });
    if (data?.email === email) {
      return data.userStatus;
    }
    return "Not invited";
  } catch (error) {
    return "Not invited";
  }
};

export default {
  filterLogRecords,
  inviteUser,
  isUserInvited: getUserStatus,
};
