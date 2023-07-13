import AUTHENTICATED_USER_KEY from "../constants/AuthConstants";
import { getLocalStorageObjProperty } from "../utils/LocalStorageUtils";
import baseAPIClient from "./BaseAPIClient";
import { GetUsersResponse } from "../types/UserTypes"

const getUsers = async (): Promise<GetUsersResponse> => {
  try {
    const bearerToken = `Bearer ${getLocalStorageObjProperty(
      AUTHENTICATED_USER_KEY,
      "accessToken",
    )}`;
    const { data } = await baseAPIClient.get("/users/", {
      headers: { Authorization: bearerToken },
    });
    return data;
  } catch (error) {
    return null
  }
};

export default {
  getUsers,
};
