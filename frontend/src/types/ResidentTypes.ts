export type Resident = {
  id: string;
  initial: string;
  roomNum: number;
  dateJoined: Date | null;
  dateLeft: Date | null;
  building: number;
  residentId: string;
};

export type JSONResident = {
  id: string;
  initial: string;
  room_num: string;
  date_joined: string;
  date_left: string;
  building: number;
  resident_id: string;
};

export type ResidentResponse = {
  residents: Resident[];
};
