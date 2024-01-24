import { AxiosError } from "axios";
import { AuthTokenResponse, AuthFlow } from "../types/AuthTypes";
import { AuthErrorResponse, ErrorResponse } from "../types/ErrorTypes";

export const getAuthErrMessage = (
  axiosErrRes: AxiosError["response"],
  flow: AuthFlow,
): string => {
  if (axiosErrRes && axiosErrRes.data && axiosErrRes.data.error) {
    return axiosErrRes.data.error;
  }
  return `Unable to ${
    flow === "LOGIN" ? "login" : "sign up"
  }. Please try again.`;
};

export const isAuthErrorResponse = (
  res: string | AuthTokenResponse | AuthErrorResponse,
): res is AuthErrorResponse => {
  return res !== null && typeof res !== "string" && "errCode" in res;
};

export const isErrorResponse = (
  res: boolean | string | ErrorResponse,
): res is ErrorResponse => {
  return (
    typeof res !== "boolean" && typeof res !== "string" && "errMessage" in res
  );
};
