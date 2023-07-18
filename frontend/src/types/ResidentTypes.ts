export type Resident = {
  id?: number;
  residentId?: string;
  initial: string;
  roomNum: number;
  dateJoined: string;
  dateLeft?: string;
  building: string;
  label?: string;
  value?: number;
};

export type GetResidentsReponse = {
  residents: Resident[];
} | null;

export type CountResidentsResponse = {
  numResults: number;
} | null;
