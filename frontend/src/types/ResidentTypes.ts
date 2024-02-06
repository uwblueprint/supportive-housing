type BuildingRecord = {
  id: number;
  name: string;
};

export type Resident = {
  id: number;
  residentId: string;
  initial: string;
  roomNum: string;
  dateJoined: string;
  dateLeft?: string;
  building: BuildingRecord;
  status: ResidentStatus;
};

export type StatusLabel = {
  label: string;
  value: string;
};

export type GetResidentsParams = {
  returnAll?: boolean;
  pageNumber?: number;
  resultsPerPage?: number;
  residents?: number[];
  buildings?: number[];
  statuses?: string[];
  dateRange?: (string | null)[];
};

export type GetResidentsReponse = {
  residents: Resident[];
} | null;

export type CountResidentsParams = {
  residents?: number[];
  buildings?: number[];
  statuses?: string[];
  dateRange?: (string | null)[];
};

export type CountResidentsResponse = {
  numResults: number;
} | null;

export type CreateResidentParams = Omit<
  Resident,
  "id" | "residentId" | "building" | "status"
> & { buildingId: number };

export type EditResidentParams = Omit<
  Resident,
  "residentId" | "building" | "status"
> & {
  buildingId: number;
};

export enum ResidentStatus {
  FUTURE = "Future",
  PAST = "Past",
  CURRENT = "Current",
}
