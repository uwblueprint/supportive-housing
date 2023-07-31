import axios, { AxiosError } from "axios";
import AUTHENTICATED_USER_KEY from "../constants/AuthConstants";
import {
  Resident,
  GetResidentsReponse,
  CountResidentsResponse,
  CreateResidentParams,
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
  building,
}: CreateResidentParams): Promise<boolean> => {
  try {
    const bearerToken = `Bearer ${getLocalStorageObjProperty(
      AUTHENTICATED_USER_KEY,
      "accessToken",
    )}`;
    await baseAPIClient.post(
      "/residents",
      { initial, roomNum, dateJoined, building },
      { headers: { Authorization: bearerToken } },
    );
    return true;
  } catch (error) {
    return false;
  }
};

const deleteResident = async (residentId: number): Promise<{statusCode: number, message: string}> => {
  try {
    const bearerToken = `Bearer ${getLocalStorageObjProperty(
      AUTHENTICATED_USER_KEY,
      "accessToken",
    )}`;
    await baseAPIClient.delete(`/residents/${residentId}`, {
      headers: { Authorization: bearerToken },
    });
    return {
      statusCode: 200,
      message: "Success"
    };
  } catch (error: any) {
    const axiosErr = error as any as AxiosError
    if (axiosErr.response) {
      return {
        statusCode: axiosErr.response.status,
        message: error.message
      }
    }
    return {
      statusCode: 404,
      message: "Error deleting resident"
    }
  }
};

const editResident = async ({
  id,
  initial,
  roomNum,
  dateJoined,
  building,
  dateLeft,
}: Resident): Promise<boolean> => {
  try {
    const bearerToken = `Bearer ${getLocalStorageObjProperty(
      AUTHENTICATED_USER_KEY,
      "accessToken",
    )}`;
    await baseAPIClient.put(
      `/residents/${id}`,
      { initial, roomNum, dateJoined, building, dateLeft},
      { headers: { Authorization: bearerToken } },
    );
    return true;
  } catch (error) {
    return false;
  }
};


export default {
  getResidents,
  countResidents,
  createResident,
  editResident,
  deleteResident
};
