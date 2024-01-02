import AUTHENTICATED_USER_KEY from "../constants/AuthConstants";
import { CountSignInLogsParams, CountSignInLogsResponse, GetSignInLogsParams, GetSignInLogsResponse } from "../types/SignInLogsTypes";
import { getLocalStorageObjProperty } from "../utils/LocalStorageUtils";
import baseAPIClient from "./BaseAPIClient";

const getSignInLogs = async ({
  pageNumber = 1,
  resultsPerPage = 10,
  startDate,
  endDate,
}: GetSignInLogsParams): Promise<GetSignInLogsResponse> => {
  try {
    const bearerToken = `Bearer ${getLocalStorageObjProperty(
      AUTHENTICATED_USER_KEY,
      "accessToken",
    )}`;
    const { data } = await baseAPIClient.get<GetSignInLogsResponse>(
      `/sign-in-logs/`,
      {
        params: {
          pageNumber,
          resultsPerPage,
          startDate,
          endDate
        },
        headers: { Authorization: bearerToken },
      },
    );
    return data;
  } catch (error) {
    return null;
  }
};

const countSignInLogs = async ({
  startDate,
  endDate
}: CountSignInLogsParams): Promise<CountSignInLogsResponse> => {
  try {
    const bearerToken = `Bearer ${getLocalStorageObjProperty(
      AUTHENTICATED_USER_KEY,
      "accessToken",
    )}`;
    const { data } = await baseAPIClient.get<CountSignInLogsResponse>(
      `/sign-in-logs/count`,
      {
        params: {
          startDate,
          endDate
        },
        headers: { Authorization: bearerToken },
      },
    );
    return data;
  } catch (error) {
    return null;
  }
};

export default {
  getSignInLogs,
  countSignInLogs
};