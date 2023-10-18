import { AxiosError } from "axios"

// Array of error messages from the BE that we want to propagate to the FE 'as-is'
const AUTH_ERR_MESSAGES = [
  "Incorrect password. Please try again.",
  "Too many failed login attempts. Please try again later."
]

// Helper to get login error message
const getLoginErrMessage = (axiosErrRes: AxiosError['response']): string => {
  if (axiosErrRes && axiosErrRes.data && axiosErrRes.data.error) {
    if (AUTH_ERR_MESSAGES.includes(axiosErrRes.data.error)) {
      return axiosErrRes.data.error;
    }
  }
  return "Error logging in. Please try again later."
}

export default getLoginErrMessage
