import { AxiosError } from "axios";
import AUTHENTICATED_USER_KEY from "../constants/AuthConstants";
import { getLocalStorageObjProperty } from "../utils/LocalStorageUtils";
import baseAPIClient from "./BaseAPIClient";
import {
  GetUsersResponse,
  CountUsersResponse,
  UpdateUserParams,
} from "../types/UserTypes";

const getUsers = async ({
  returnAll = false,
  pageNumber = 1,
  resultsPerPage = 10,
}): Promise<GetUsersResponse> => {
  try {
    const bearerToken = `Bearer ${getLocalStorageObjProperty(
      AUTHENTICATED_USER_KEY,
      "accessToken",
    )}`;
    const { data } = await baseAPIClient.get<GetUsersResponse>(`/users`, {
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

const countUsers = async (): Promise<CountUsersResponse> => {
  try {
    const bearerToken = `Bearer ${getLocalStorageObjProperty(
      AUTHENTICATED_USER_KEY,
      "accessToken",
    )}`;
    const { data } = await baseAPIClient.get<CountUsersResponse>(
      `/users/count`,
      {
        headers: { Authorization: bearerToken },
      },
    );
    return data;
  } catch (error) {
    return null;
  }
};

const updateUser = async ({
  id,
  email,
  firstName,
  lastName,
  role,
}: UpdateUserParams): Promise<{ statusCode: number; message: string }> => {
  try {
    const bearerToken = `Bearer ${getLocalStorageObjProperty(
      AUTHENTICATED_USER_KEY,
      "accessToken",
    )}`;
    const res = await baseAPIClient.put(
      `/users/${id}`,
      { email, firstName, lastName, role },
      {
        headers: { Authorization: bearerToken },
      },
    );
    return {
      statusCode: res.status,
      message: "Success",
    };
  } catch (error: any) {
    const axiosErr = (error as any) as AxiosError;
    if (axiosErr.response) {
      return {
        statusCode: axiosErr.response.status,
        message: error.message,
      };
    }
    return {
      statusCode: 500,
      message: "Error updating user",
    };
  }
};

export default {
  getUsers,
  countUsers,
  updateUser,
};
