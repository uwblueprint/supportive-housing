import { AxiosError } from "axios";
import AUTHENTICATED_USER_KEY from "../constants/AuthConstants";
import { getLocalStorageObjProperty } from "../utils/LocalStorageUtils";
import baseAPIClient from "./BaseAPIClient";
import { AuthErrorResponse } from "../types/ErrorTypes";

const inviteUser = async (
  email: string,
  role: string,
  firstName: string,
  lastName: string,
): Promise<string> => {
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
    return "Success";
  } catch (error: any) {
    return error.message;
  }
};

const getUserStatus = async (email: string): Promise<string | AuthErrorResponse> => {
  try {
    if (email === "") {
      return "";
    }
    const bearerToken = `Bearer ${getLocalStorageObjProperty(
      AUTHENTICATED_USER_KEY,
      "accessToken",
    )}`;
    const { data } = await baseAPIClient.get("/users/user-status", {
      params: {
        email,
      },
      headers: { Authorization: bearerToken },
    });
    if (data?.email === email) {
      return data.userStatus;
    }
    return "Not invited";
  } catch (error) {
    const axiosErr = (error as any) as AxiosError;
    if (axiosErr.response && axiosErr.response.status === 403) {
      return {
        errCode: axiosErr.response.status,
        errMessage: axiosErr.response.data.error,
      };
    }
    return "Not invited";
  }
};

export default {
  inviteUser,
  isUserInvited: getUserStatus,
};
