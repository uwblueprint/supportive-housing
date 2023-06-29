export type Resident = {
    id?: number;
    initial: string;
    roomNum: number;
    dateJoined: Date;
    dateLeft?: Date;
    building: string;
};

export type GetResidentsReponse = {
    residents: Resident[];
    numResults: number;
} | null;
