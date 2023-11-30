// TODO: Change this type to the values of the tags we want to get from the DB
export type BuildingLabel = {
  label: string;
  value: number;
};

export type Building = {
  id: number;
  address: string;
  name: string;
};

export type GetBuildingsResponse = {
  buildings: Building[];
} | null;
