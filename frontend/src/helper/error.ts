import { AxiosError } from "axios";
import { AuthTokenResponse, AuthFlow } from "../types/AuthTypes";
import { AuthErrorResponse, ResidentErrorResponse } from '../types/ErrorTypes'

export const getAuthErrMessage = (axiosErrRes: AxiosError["response"], flow: AuthFlow): string => {
  if (axiosErrRes && axiosErrRes.data && axiosErrRes.data.error) {
    return axiosErrRes.data.error;
  }
  return `Error ${flow === 'LOGIN' ? "logging in" : "signing up"}. Please try again later.`;
}

export const isAuthErrorResponse = (
  res: string | AuthTokenResponse | AuthErrorResponse,
): res is AuthErrorResponse => {
  return res !== null && typeof res !== 'string' && "errCode" in res;
};

export const isResidentErrorResponse = (res: boolean | ResidentErrorResponse) : res is ResidentErrorResponse => {
  return (typeof res !== 'boolean' && 'errMessage' in res);
}
