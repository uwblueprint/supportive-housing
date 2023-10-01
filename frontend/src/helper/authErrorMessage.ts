import { AxiosError } from "axios"

// Helper to get login error message
const getLoginErrMessage = (axiosErrRes: AxiosError['response']): string => {
  if (axiosErrRes && axiosErrRes.data && axiosErrRes.data.error) {
    if (axiosErrRes.data.error === "INVALID_PASSWORD") {
      return "Incorrect password. Please try again."
    }
    if (axiosErrRes.data.error === "TOO_MANY_ATTEMPTS_TRY_LATER") {
      return "Too many failed login attempts. Please try again later."
    }
  }
  return "Error logging in. Please try again later."
}

export default getLoginErrMessage
