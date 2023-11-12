import axios, { AxiosError } from "axios";
import AUTHENTICATED_USER_KEY from "../constants/AuthConstants";
import {
  Resident,
  GetResidentsReponse,
  CountResidentsResponse,
  CreateResidentParams,
  EditResidentParams,
  ErrorResponse,
} from "../types/ResidentTypes";
import { getLocalStorageObjProperty } from "../utils/LocalStorageUtils";
import baseAPIClient from "./BaseAPIClient";

const getResidents = async ({
  returnAll = false,
  pageNumber = 1,
  resultsPerPage = 10,
}): Promise<GetResidentsReponse> => {
  try {
    const bearerToken = `Bearer ${getLocalStorageObjProperty(
      AUTHENTICATED_USER_KEY,
      "accessToken",
    )}`;
    const { data } = await baseAPIClient.get<GetResidentsReponse>(
      `/residents/`,
      {
        params: {
          returnAll,
          pageNumber,
          resultsPerPage,
        },
        headers: { Authorization: bearerToken },
      },
    );
    return data;
  } catch (error) {
    return null;
  }
};

const countResidents = async (): Promise<CountResidentsResponse> => {
  try {
    const bearerToken = `Bearer ${getLocalStorageObjProperty(
      AUTHENTICATED_USER_KEY,
      "accessToken",
    )}`;
    const { data } = await baseAPIClient.get<CountResidentsResponse>(
      `/residents/count`,
      {
        headers: { Authorization: bearerToken },
      },
    );
    return data;
  } catch (error) {
    return null;
  }
};

const createResident = async ({
  initial,
  roomNum,
  dateJoined,
  buildingId,
}: CreateResidentParams): Promise<boolean | ErrorResponse> => {
  try {
    const bearerToken = `Bearer ${getLocalStorageObjProperty(
      AUTHENTICATED_USER_KEY,
      "accessToken",
    )}`;
    await baseAPIClient.post(
      "/residents",
      { initial, roomNum, dateJoined, buildingId },
      { headers: { Authorization: bearerToken } },
    );
    return true;
  } catch (error) {
    const axiosErr = (error as any) as AxiosError;

    if (axiosErr.response && axiosErr.response.status === 409) {
      return {
        errMessage: "Resident with the specified user ID already exists."
      };
    }
    return false;
  }
};

const deleteResident = async (residentId: number): Promise<number> => {
  try {
    const bearerToken = `Bearer ${getLocalStorageObjProperty(
      AUTHENTICATED_USER_KEY,
      "accessToken",
    )}`;
    await baseAPIClient.delete(`/residents/${residentId}`, {
      headers: { Authorization: bearerToken },
    });
    return 200;
  } catch (error: any) {
    const axiosErr = (error as any) as AxiosError;
    if (axiosErr.response) {
      return axiosErr.response.status;
    }
    return 404;
  }
};

const editResident = async ({
  id,
  initial,
  roomNum,
  dateJoined,
  buildingId,
  dateLeft,
}: EditResidentParams): Promise<boolean | ErrorResponse> => {
  try {
    const bearerToken = `Bearer ${getLocalStorageObjProperty(
      AUTHENTICATED_USER_KEY,
      "accessToken",
    )}`;
    await baseAPIClient.put(
      `/residents/${id}`,
      { initial, roomNum, dateJoined, buildingId, dateLeft },
      { headers: { Authorization: bearerToken } },
    );
    return true;
  } catch (error) {
    const axiosErr = (error as any) as AxiosError;

    if (axiosErr.response && axiosErr.response.status === 409) {
      return {
        errMessage: "Resident with the specified user ID already exists."
      };
    }
    return false;
  }
};

export default {
  getResidents,
  countResidents,
  createResident,
  editResident,
  deleteResident,
};
