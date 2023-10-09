import AUTHENTICATED_USER_KEY from "../constants/AuthConstants";
import { getLocalStorageObjProperty } from "../utils/LocalStorageUtils";
import baseAPIClient from "./BaseAPIClient";
import {
  CountLogRecordFilters,
  GetLogRecordCountResponse,
  GetLogRecordsReponse,
  LogRecordFilters,
  PostLogRecordsResponse,
  EditLogRecordParams,
  CreateLogRecordParams,
} from "../types/LogRecordTypes";

const countLogRecords = async ({
  buildingId,
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
          buildingId,
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
  buildingId,
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
          buildingId,
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

const createLog = async ({
  employeeId,
  residentId,
  datetime,
  flagged,
  note,
  tags,
  buildingId,
  attnTo,
}: CreateLogRecordParams): Promise<PostLogRecordsResponse> => {
  try {
    const bearerToken = `Bearer ${getLocalStorageObjProperty(
      AUTHENTICATED_USER_KEY,
      "accessToken",
    )}`;
    const { data } = await baseAPIClient.post<PostLogRecordsResponse>(
      "/log_records/",
      {
        employeeId,
        residentId,
        datetime,
        flagged,
        note,
        tags,
        buildingId,
        attnTo,
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

const editLogRecord = async ({
  logId,
  employeeId,
  residentId,
  datetime,
  flagged,
  note,
  tags,
  buildingId,
  attnTo,
}: EditLogRecordParams): Promise<boolean> => {
  try {
    const bearerToken = `Bearer ${getLocalStorageObjProperty(
      AUTHENTICATED_USER_KEY,
      "accessToken",
    )}`;
    await baseAPIClient.put(
      `/log_records/${logId}`,
      {
        employeeId,
        residentId,
        datetime,
        flagged,
        note,
        attnTo,
        tags,
        buildingId,
      },
      { headers: { Authorization: bearerToken } },
    );
    return true;
  } catch (error) {
    return false;
  }
};

export default {
  createLog,
  countLogRecords,
  filterLogRecords,
  deleteLogRecord,
  editLogRecord,
};
