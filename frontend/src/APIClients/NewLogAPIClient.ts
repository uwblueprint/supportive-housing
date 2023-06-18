import AUTHENTICATED_USER_KEY from "../constants/AuthConstants";
import { getLocalStorageObjProperty } from "../utils/LocalStorageUtils";
import baseAPIClient from "./BaseAPIClient";

import { Resident } from "../types/ResidentTypes";

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

const getResidents = async (): Promise<any> => {
  let residentData = [];
  try {
    const bearerToken = `Bearer ${getLocalStorageObjProperty(
      AUTHENTICATED_USER_KEY,
      "accessToken",
    )}`;
    const { data } = await baseAPIClient.get("/residents/", {
      headers: { Authorization: bearerToken },
    });
    if (data) {
      residentData = data;
    }
    return residentData;
  } catch (error) {
    console.log(error);
    return residentData;
  }
};

export default {
  getUsers,
  getResidents,
};
