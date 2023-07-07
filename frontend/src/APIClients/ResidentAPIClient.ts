import AUTHENTICATED_USER_KEY from "../constants/AuthConstants";
import { GetResidentResponse } from "../types/ResidentTypes";
import { getLocalStorageObjProperty } from "../utils/LocalStorageUtils";
import baseAPIClient from "./BaseAPIClient";

const getResidents = async (): Promise<GetResidentResponse> => {
  let residentData = [];
  try {
    const bearerToken = `Bearer ${getLocalStorageObjProperty(
      AUTHENTICATED_USER_KEY,
      "accessToken",
    )}`;
    const { data } = await baseAPIClient.get("/residents/", {
      headers: { Authorization: bearerToken },
    });
    residentData = data;
    return residentData;
  } catch (error) {
    return residentData;
  }
};

export default {
  getResidents,
};
