import { AxiosError } from "axios";
import { AuthTokenResponse, ErrorResponse, AuthFlow } from "../types/AuthTypes";

export const getAuthErrMessage = (axiosErrRes: AxiosError["response"], flow: AuthFlow): string => {
  if (axiosErrRes && axiosErrRes.data && axiosErrRes.data.error) {
    return axiosErrRes.data.error;
  }
  return `Error ${flow === 'LOGIN' ? "logging in" : "signing up"}. Please try again later.`;
}

export const isAuthErrorResponse = (
  res: string | AuthTokenResponse | ErrorResponse,
): res is ErrorResponse => {
  return res !== null && typeof res !== 'string' && "errCode" in res;
};
