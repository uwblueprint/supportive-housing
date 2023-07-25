import AUTHENTICATED_USER_KEY from "../constants/AuthConstants";
import { getLocalStorageObjProperty } from "../utils/LocalStorageUtils";
import baseAPIClient from "./BaseAPIClient";
import {
  CountLogRecordFilters,
  GetLogRecordCountResponse,
  GetLogRecordsReponse,
  LogRecordFilters,
  PostLogRecordsResponse,
} from "../types/LogRecordTypes";

const countLogRecords = async ({
  building = "",
  employeeId = [],
  attnTo = [],
  dateRange = [],
  residentId = [],
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
          residentId,
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

const filterLogRecords = async ({
  building = "",
  employeeId = [],
  attnTo = [],
  dateRange = [],
  residentId = [],
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
          residentId,
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

const createLog = async (
  userId: number,
  residentId: number,
  flagged: boolean,
  note: string,
  building: string,
  attentionTo?: number,
): Promise<PostLogRecordsResponse> => {
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
};

const deleteLogRecord = async (logId: number): Promise<boolean> => {
  try {
    const bearerToken = `Bearer ${getLocalStorageObjProperty(
      AUTHENTICATED_USER_KEY,
      "accessToken",
    )}`;
    await baseAPIClient.delete(`/log_records/${logId}`, {
      headers: { Authorization: bearerToken },
    });
    return true;
  } catch (error) {
    return false;
  }
};

const editLogRecord = async (
  logId: number,
  userId: number,
  residentId: number,
  flagged: boolean,
  note: string,
  tags: string[],
  building: string,
  attentionTo?: number,
): Promise<any> => {
  try {
    const bearerToken = `Bearer ${getLocalStorageObjProperty(
      AUTHENTICATED_USER_KEY,
      "accessToken",
    )}`;

    const { data } = await baseAPIClient.put<any>(
      `/log_records/${logId}`,
      {
        employeeId: userId,
        residentId,
        flagged,
        note,
        attnTo: attentionTo,
        tags,
        building,
      },
      { headers: { Authorization: bearerToken } },
    );
    return data;
  } catch (error) {
    return null;
  }
};

export default {
  createLog,
  countLogRecords,
  filterLogRecords,
  deleteLogRecord,
  editLogRecord,
};
