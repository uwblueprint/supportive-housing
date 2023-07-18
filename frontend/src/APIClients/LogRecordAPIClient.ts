import AUTHENTICATED_USER_KEY from "../constants/AuthConstants";
import { getLocalStorageObjProperty } from "../utils/LocalStorageUtils";
import baseAPIClient from "./BaseAPIClient";
import {
  GetLogRecordCountResponse,
  GetLogRecordsReponse,
  PostLogRecordsResponse,
} from "../types/LogRecordTypes";
import {
  CountLogRecordFilters,
  LogRecordFilters,
} from "../components/common/types/Filters";

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
  attentionTo: number,
  building: string,
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

export default {
  createLog,
  countLogRecords,
  filterLogRecords,
};
