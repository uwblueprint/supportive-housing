import AUTHENTICATED_USER_KEY from "../constants/AuthConstants";
import baseAPIClient from "./BaseAPIClient";
import { GetBuildingsResponse } from "../types/BuildingTypes";
import { getLocalStorageObjProperty } from "../helper/localStorageHelpers";

const getBuildings = async (): Promise<GetBuildingsResponse> => {
  try {
    const bearerToken = `Bearer ${getLocalStorageObjProperty(
      AUTHENTICATED_USER_KEY,
      "accessToken",
    )}`;
    const { data } = await baseAPIClient.get<GetBuildingsResponse>(
      `/buildings`,
      {
        headers: { Authorization: bearerToken },
      },
    );
    return data;
  } catch (error) {
    return null;
  }
};

export default {
  getBuildings,
};
