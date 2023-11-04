import { AxiosError } from "axios";

// Helper to get login error message
const getLoginErrMessage = (axiosErrRes: AxiosError["response"]): string => {
  if (axiosErrRes && axiosErrRes.data && axiosErrRes.data.error) {
    return axiosErrRes.data.error;
  }
  return "Error logging in. Please try again later.";
};

export default getLoginErrMessage;
