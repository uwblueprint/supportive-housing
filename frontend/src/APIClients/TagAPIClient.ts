import { AxiosError } from "axios";
import AUTHENTICATED_USER_KEY from "../constants/AuthConstants";
import { getLocalStorageObjProperty } from "../utils/LocalStorageUtils";
import baseAPIClient from "./BaseAPIClient";
import { CountTagsResponse, GetTagsParams, GetTagsResponse } from "../types/TagTypes";

const getTags = async ({
  returnAll = false,
  pageNumber = 1,
  resultsPerPage = 10,
}: GetTagsParams): Promise<GetTagsResponse> => {
  try {
    const bearerToken = `Bearer ${getLocalStorageObjProperty(
      AUTHENTICATED_USER_KEY,
      "accessToken",
    )}`;
    const { data } = await baseAPIClient.get<GetTagsResponse>(`/tags`, {
      params: {
        returnAll,
        pageNumber,
        resultsPerPage
      },
      headers: { Authorization: bearerToken },
    });
    return data;
  } catch (error) {
    return null;
  }
};

const countTags = async (): Promise<CountTagsResponse> => {
  try {
    const bearerToken = `Bearer ${getLocalStorageObjProperty(
      AUTHENTICATED_USER_KEY,
      "accessToken",
    )}`;
    const { data } = await baseAPIClient.get<CountTagsResponse>(
      `/tags/count`,
      {
        headers: { Authorization: bearerToken },
      },
    );
    return data;
  } catch (error) {
    return null;
  }
};

export default {
  countTags,
  getTags,
};
