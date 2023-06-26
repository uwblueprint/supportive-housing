import AUTHENTICATED_USER_KEY from "../constants/AuthConstants";
import { getLocalStorageObjProperty } from "../utils/LocalStorageUtils";
import baseAPIClient from "./BaseAPIClient";

const getUsers = async (): Promise<any> => {
  let userData = [];
  try {
    const bearerToken = `Bearer ${getLocalStorageObjProperty(
      AUTHENTICATED_USER_KEY,
      "accessToken",
    )}`;
    const { data } = await baseAPIClient.get("/users/", {
      headers: { Authorization: bearerToken },
    });
    if (data) {
      userData = data;
    }
    return userData;
  } catch (error) {
    console.log(error);
    return userData;
  }
};

export default {
  getUsers,
};
