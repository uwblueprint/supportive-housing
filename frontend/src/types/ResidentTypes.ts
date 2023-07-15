export type Resident = {
  id?: number;
  residentId?: string;
  initial: string;
  roomNum: number;
  dateJoined: Date;
  dateLeft?: Date;
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
