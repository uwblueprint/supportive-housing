import AUTHENTICATED_USER_KEY from "../constants/AuthConstants";
import {
  GetLogRecordsReponse,
  GetLogRecordCountResponse,
} from "../types/LogRecordTypes";
import { getLocalStorageObjProperty } from "../utils/LocalStorageUtils";
import baseAPIClient from "./BaseAPIClient";

import {
  LogRecordFilters,
  CountLogRecordFilters,
} from "../components/common/types/Filters";
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
}: LogRecordFilters): Promise<GetLogRecordsReponse> => {
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

const countLogRecords = async ({
  building = "",
  employeeId = [],
  attnTo = [],
  dateRange = [],
  tags = [],
  flagged = false,
}: CountLogRecordFilters): Promise<GetLogRecordCountResponse> => {
  try {
    const bearerToken = `Bearer ${getLocalStorageObjProperty(
      AUTHENTICATED_USER_KEY,
      "accessToken",
    )}`;
    const { data } = await baseAPIClient.get(`/log_records/count`, {
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
): Promise<string> => {
  try {
    const bearerToken = `Bearer ${getLocalStorageObjProperty(
      AUTHENTICATED_USER_KEY,
      "accessToken",
    )}`;
    await baseAPIClient.post(
      "/users/invite-user",
      { email, role, firstName, lastName },
      { headers: { Authorization: bearerToken } },
    );
    return "Success";
  } catch (error: any) {
    console.log("error.message", error.message);
    return error.message;
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

export default {
  filterLogRecords,
  countLogRecords,
  inviteUser,
  isUserInvited: getUserStatus,
  createResident,
};
