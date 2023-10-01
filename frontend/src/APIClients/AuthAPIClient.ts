import {
  FetchResult,
  MutationFunctionOptions,
  OperationVariables,
} from "@apollo/client";
import { AxiosError } from "axios";
import getLoginErrMessage from '../helper/authErrorMessage'
import AUTHENTICATED_USER_KEY from "../constants/AuthConstants";
import { AuthenticatedUser, LoginResponse } from "../types/AuthTypes";
import baseAPIClient from "./BaseAPIClient";
import {
  getLocalStorageObjProperty,
  setLocalStorageObjProperty,
} from "../utils/LocalStorageUtils";

const login = async (
  email: string,
  password: string,
): Promise<LoginResponse> => {
  try {
    const { data } = await baseAPIClient.post(
      "/auth/login",
      { email, password },
      { withCredentials: true },
    );
    return data;
  } catch (error) {
    const axiosErr = (error as any) as AxiosError;
    if (axiosErr.response && axiosErr.response.status === 401) {
      return {
        errCode: axiosErr.response.status,
        errMessage: getLoginErrMessage(axiosErr.response)
      }
    }
    return {
      errCode: 500,
      errMessage: getLoginErrMessage(axiosErr.response)
    }
  }
};

const twoFa = async (
  passcode: string,
  email: string,
  password: string,
): Promise<AuthenticatedUser | null> => {
  try {
    const { data } = await baseAPIClient.post(
      `/auth/twoFa?passcode=${passcode}`,
      { email, password },
      { withCredentials: true },
    );
    return data;
  } catch (error) {
    return null;
  }
};

const twoFaWithGoogle = async (
  passcode: string,
  idToken: string,
): Promise<AuthenticatedUser | null> => {
  try {
    const { data } = await baseAPIClient.post(
      `/auth/twoFa?passcode=${passcode}`,
      { idToken },
      { withCredentials: true },
    );
    return data;
  } catch (error) {
    return null;
  }
};

const logout = async (userId: number | undefined): Promise<boolean> => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  try {
    await baseAPIClient.post(
      `/auth/logout/${userId}`,
      {},
      { headers: { Authorization: bearerToken } },
    );
    localStorage.removeItem(AUTHENTICATED_USER_KEY);
    return true;
  } catch (error) {
    return false;
  }
};

const register = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
): Promise<AuthenticatedUser | null> => {
  try {
    const { data } = await baseAPIClient.post(
      "/auth/register",
      { firstName, lastName, email, password },
      { withCredentials: true },
    );
    localStorage.setItem(AUTHENTICATED_USER_KEY, JSON.stringify(data));
    return data;
  } catch (error) {
    return null;
  }
};

const resetPassword = async (email: string | undefined): Promise<boolean> => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  try {
    await baseAPIClient.post(
      `/auth/resetPassword/${email}`,
      {},
      { headers: { Authorization: bearerToken } },
    );
    return true;
  } catch (error) {
    return false;
  }
};

// for testing only, refresh does not need to be exposed in the client
const refresh = async (): Promise<boolean> => {
  try {
    const { data } = await baseAPIClient.post(
      "/auth/refresh",
      {},
      { withCredentials: true },
    );
    setLocalStorageObjProperty(
      AUTHENTICATED_USER_KEY,
      "accessToken",
      data.accessToken,
    );
    return true;
  } catch (error) {
    return false;
  }
};

export default {
  login,
  logout,
  twoFa,
  twoFaWithGoogle,
  register,
  resetPassword,
  refresh,
};
