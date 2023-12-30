type BuildingRecord = {
  id: number;
  name: string;
};

export type Resident = {
  id: number;
  residentId: string;
  initial: string;
  roomNum: number;
  dateJoined: string;
  dateLeft?: string;
  building: BuildingRecord;
  status: ResidentStatus;
};

export type ResidentLabel = {
  label: string;
  value: number;
};

export type GetResidentsReponse = {
  residents: Resident[];
} | null;

export type CountResidentsResponse = {
  numResults: number;
} | null;

export type CreateResidentParams = Omit<
  Resident,
  "id" | "residentId" | "dateLeft" | "building" | "status"
> & { buildingId: number };

export type EditResidentParams = Omit<Resident, "residentId" | "building" | "status"> & {
  buildingId: number;
};

export enum ResidentStatus {
  FUTURE = "Future",
  PAST = "Past",
  CURRENT = "Current",
}
