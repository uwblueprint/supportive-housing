import { AxiosError } from "axios";
import AUTHENTICATED_USER_KEY from "../constants/AuthConstants";
import { getLocalStorageObjProperty } from "../utils/LocalStorageUtils";
import baseAPIClient from "./BaseAPIClient";
import {
  GetUsersResponse,
  CountUsersResponse,
  UpdateUserParams,
  UserStatus,
  GetUserStatusResponse,
  GetUserParams,
} from "../types/UserTypes";
import { ErrorResponse } from "../types/ErrorTypes";

const getUsers = async ({
  returnAll = false,
  pageNumber = 1,
  resultsPerPage = 10,
}: GetUserParams): Promise<GetUsersResponse> => {
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
  } catch (error) {
    const axiosErr = error as AxiosError;
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
  } catch (error) {
    const axiosErr = error as AxiosError;
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
  } catch (error) {
    const axiosErr = error as AxiosError;
    if (axiosErr.response) {
      return axiosErr.response.status;
    }
    return 500;
  }
};

const inviteUser = async (
  email: string,
  role: string,
  firstName: string,
  lastName: string,
): Promise<boolean | ErrorResponse> => {
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
    return true;
  } catch (error) {
    const axiosErr = error as AxiosError;

    if (axiosErr.response && axiosErr.response.status === 409) {
      return {
        errMessage:
          axiosErr.response.data.error ??
          "User with the specified email already exists.",
      };
    }
    return false;
  }
};

const getUserStatus = async (
  email: string,
): Promise<UserStatus | ErrorResponse> => {
  try {
    const bearerToken = `Bearer ${getLocalStorageObjProperty(
      AUTHENTICATED_USER_KEY,
      "accessToken",
    )}`;
    const { data } = await baseAPIClient.get<GetUserStatusResponse>(
      "/users/user-status",
      {
        params: {
          email,
        },
        headers: { Authorization: bearerToken },
      },
    );
    if (data.email === email) {
      return data.userStatus;
    }
    return {
      errMessage:
        "This email address has not been invited. Please try again with a different email.",
    };
  } catch (error) {
    const axiosErr = error as AxiosError;

    if (axiosErr.response && axiosErr.response.status === 403) {
      return {
        errMessage:
          axiosErr.response.data.error ??
          "This email address has not been invited. Please try again with a different email.",
      };
    }

    return {
      errMessage: "Unable to get status of this user.",
    };
  }
};

export default {
  getUsers,
  countUsers,
  updateUser,
  updateUserStatus,
  deleteUser,
  inviteUser,
  getUserStatus,
};
