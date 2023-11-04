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
  "id" | "residentId" | "dateLeft" | "building"
> & { buildingId: number };

export type EditResidentParams = Omit<Resident, "residentId" | "building"> & {
  buildingId: number;
};
