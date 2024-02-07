import AUTHENTICATED_USER_KEY from "../constants/AuthConstants";
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
import { getLocalStorageObjProperty } from "../helper/localStorageHelpers";

const countLogRecords = async ({
  buildings = [],
  employees = [],
  attnTos = [],
  dateRange = [],
  residents = [],
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
          buildings,
          employees,
          attnTos,
          dateRange,
          residents,
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
  buildings = [],
  employees = [],
  attnTos = [],
  dateRange = [],
  residents = [],
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
          buildings,
          employees,
          attnTos,
          dateRange,
          residents,
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
  residents,
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
        residents,
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
  residents,
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
        residents,
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
