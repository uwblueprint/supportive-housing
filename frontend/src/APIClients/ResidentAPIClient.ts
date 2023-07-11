import AUTHENTICATED_USER_KEY from "../constants/AuthConstants";
import { GetResidentsReponse } from "../types/ResidentTypes";
import { getLocalStorageObjProperty } from "../utils/LocalStorageUtils";
import baseAPIClient from "./BaseAPIClient";

const getResidents = async (): Promise<GetResidentsReponse> => {
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

const paginatedGetResidents = async (
  returnAll: boolean,
  pageNumber: number,
  resultsPerPage: number,
): Promise<any> => {
  try {
    const bearerToken = `Bearer ${getLocalStorageObjProperty(
      AUTHENTICATED_USER_KEY,
      "accessToken",
    )}`;
    const { data } = await baseAPIClient.get(`/residents/`, {
      params: {
        returnAll,
        pageNumber,
        resultsPerPage,
      },
      headers: { Authorization: bearerToken },
    });
    return data;
  } catch (error) {
    return null;
  }
};

export default {
  getResidents,
  paginatedGetResidents
};