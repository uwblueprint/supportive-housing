import AUTHENTICATED_USER_KEY from "../constants/AuthConstants";
import { GetLogRecordsReponse } from "../types/LogRecordTypes";
import { getLocalStorageObjProperty } from "../utils/LocalStorageUtils";
import baseAPIClient from "./BaseAPIClient";

import { LogRecordFilters } from "../components/common/types/Filters";
import { Resident } from "../types/ResidentTypes";

const filterLogRecords = async ({
  building = "",
  employeeId = [],
  attnTo = [],
  dateRange = [],
  tags = [],
  flagged = false,
  returnAll = false,
  pageNumber,
  resultsPerPage,
}: LogRecordFilters): Promise<any> => {
  try {
    const bearerToken = `Bearer ${getLocalStorageObjProperty(
      AUTHENTICATED_USER_KEY,
      "accessToken",
    )}`;
    const { data } = await baseAPIClient.get(`/log_records`, {
      params: {
        filters: {
          building,
          employeeId,
          attnTo,
          dateRange,
          tags,
          flagged,
        },
        returnAll,
        pageNumber,
        resultsPerPage,
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

const createResident = async ({
  initial,
  roomNum,
  dateJoined,
  building,
}: Resident): Promise<boolean> => {
  try {
    const bearerToken = `Bearer ${getLocalStorageObjProperty(
      AUTHENTICATED_USER_KEY,
      "accessToken",
    )}`;
    await baseAPIClient.post(
      "/residents",
      { initial, roomNum, dateJoined, building },
      { headers: { Authorization: bearerToken } },
    );
    return true;
  } catch (error) {
    return false;
  }
};

const deleteLogRecord = async (logId: number): Promise<boolean> => {
  try {
    const bearerToken = `Bearer ${getLocalStorageObjProperty(
      AUTHENTICATED_USER_KEY,
      "accessToken"
    )}`;
    await baseAPIClient.delete(`/log_records/${logId}`, {
      headers: { Authorization: bearerToken },
    });
    return true;
  } catch (error) {
    return false;
  }
};

export default {
  filterLogRecords,
  inviteUser,
  isUserInvited: getUserStatus,
  createResident,
  deleteLogRecord,
};
