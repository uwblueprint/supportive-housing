import { AxiosError } from "axios";
import { AuthTokenResponse, ErrorResponse } from "../types/AuthTypes";

// Helper to get login error message
export const getLoginErrMessage = (axiosErrRes: AxiosError["response"]): string => {
  if (axiosErrRes && axiosErrRes.data && axiosErrRes.data.error) {
    return axiosErrRes.data.error;
  }
  return "Error logging in. Please try again later.";
};

export const getRegisterErrMessage = (axiosErrRes: AxiosError["response"]): string => {
  if (axiosErrRes && axiosErrRes.data && axiosErrRes.data.error) {
    return axiosErrRes.data.error;
  }
  return "Error signing up. Please try again later.";
};

export const isAuthErrorResponse = (
  res: AuthTokenResponse | ErrorResponse,
): res is ErrorResponse => {
  return res !== null && "errCode" in res;
};
