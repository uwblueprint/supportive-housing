import { AxiosError } from "axios";
import AUTHENTICATED_USER_KEY from "../constants/AuthConstants";
import { getLocalStorageObjProperty } from "../utils/LocalStorageUtils";
import baseAPIClient from "./BaseAPIClient";
import {
  CountTagsResponse,
  CreateTagParams,
  GetTagsParams,
  GetTagsResponse,
} from "../types/TagTypes";
import { ErrorResponse } from "../types/ErrorTypes";

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
        resultsPerPage,
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
    const { data } = await baseAPIClient.get<CountTagsResponse>(`/tags/count`, {
      headers: { Authorization: bearerToken },
    });
    return data;
  } catch (error) {
    return null;
  }
};

const createTag = async ({
  name,
}: CreateTagParams): Promise<boolean | ErrorResponse> => {
  try {
    const bearerToken = `Bearer ${getLocalStorageObjProperty(
      AUTHENTICATED_USER_KEY,
      "accessToken",
    )}`;
    await baseAPIClient.post(
      "/tags",
      { name },
      { headers: { Authorization: bearerToken } },
    );
    return true;
  } catch (error) {
    const axiosErr = (error as any) as AxiosError;

    if (axiosErr.response && axiosErr.response.status === 409) {
      return {
        errMessage:
          axiosErr.response.data.error ??
          "Tag with the specified name already exists.",
      };
    }
    return false;
  }
};

export default {
  countTags,
  getTags,
  createTag,
};
