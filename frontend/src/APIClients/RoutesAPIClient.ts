import AUTHENTICATED_USER_KEY from "../constants/AuthConstants";
import { getLocalStorageObjProperty } from "../utils/LocalStorageUtils";
import baseAPIClient from "./BaseAPIClient";

const inviteUser = async (email: string, role = "Admin"): Promise<boolean> => {
  try {
    if (email === "") {
      return false;
    }
    const bearerToken = `Bearer ${getLocalStorageObjProperty(
      AUTHENTICATED_USER_KEY,
      "accessToken",
    )}`;
    await baseAPIClient.post(
      "/invite-users",
      { email, role },
      { headers: { Authorization: bearerToken } },
    );
    return true;
  } catch (error) {
    return false;
  }
};

const isUserInvited = async (email: string): Promise<boolean> => {
  try {
    if (email === "") {
      return false;
    }
    const { data } = await baseAPIClient.get("/invite-users", {
      params: {
        email,
      },
    });
    if (data?.email === email) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

export default {
  isUserInvited,
  inviteUser,
};
