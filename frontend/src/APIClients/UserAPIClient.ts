import { AxiosError } from "axios";
import AUTHENTICATED_USER_KEY from "../constants/AuthConstants";
import { getLocalStorageObjProperty } from "../utils/LocalStorageUtils";
import baseAPIClient from "./BaseAPIClient";
import {
  GetUsersResponse,
  CountUsersResponse,
  UpdateUserParams,
  UserStatus,
  GetUsersParams,
} from "../types/UserTypes";

const getUsers = async ({
  returnAll,
  resultsPerPage,
  nextCursor,
  prevCursor,
  direction,
}: GetUsersParams): Promise<GetUsersResponse> => {
  try {
    const bearerToken = `Bearer ${getLocalStorageObjProperty(
      AUTHENTICATED_USER_KEY,
      "accessToken",
    )}`;
    const { data } = await baseAPIClient.get<GetUsersResponse>(`/users`, {
      params: {
        returnAll,
        resultsPerPage,
        nextCursor,
        prevCursor,
        direction,
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
  firstName,
  lastName,
  role,
}: UpdateUserParams): Promise<number> => {
  try {
    const bearerToken = `Bearer ${getLocalStorageObjProperty(
      AUTHENTICATED_USER_KEY,
      "accessToken",
    )}`;
    const res = await baseAPIClient.put(
      `/users/${id}`,
      { firstName, lastName, role },
      {
        headers: { Authorization: bearerToken },
      },
    );
    return res.status;
  } catch (error: any) {
    const axiosErr = (error as any) as AxiosError;
    if (axiosErr.response) {
      return axiosErr.response.status;
    }
    return 500;
  }
};

const updateUserStatus = async (
  userId: number,
  userStatus: UserStatus,
): Promise<number> => {
  try {
    const bearerToken = `Bearer ${getLocalStorageObjProperty(
      AUTHENTICATED_USER_KEY,
      "accessToken",
    )}`;
    const res = await baseAPIClient.patch(
      `/users/user-status/${userId}`,
      { userStatus },
      {
        headers: { Authorization: bearerToken },
      },
    );
    return res.status;
  } catch (error: any) {
    const axiosErr = (error as any) as AxiosError;
    if (axiosErr.response) {
      return axiosErr.response.status;
    }
    return 500;
  }
};

const deleteUser = async (userId: number): Promise<number> => {
  try {
    const bearerToken = `Bearer ${getLocalStorageObjProperty(
      AUTHENTICATED_USER_KEY,
      "accessToken",
    )}`;
    const res = await baseAPIClient.delete(`/users/${userId}`, {
      headers: { Authorization: bearerToken },
    });
    return res.status;
  } catch (error: any) {
    const axiosErr = (error as any) as AxiosError;
    if (axiosErr.response) {
      return axiosErr.response.status;
    }
    return 500;
  }
};

export default {
  getUsers,
  countUsers,
  updateUser,
  updateUserStatus,
  deleteUser,
};
