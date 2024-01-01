export type Building = {
  id: number;
  address: string;
  name: string;
};

export type GetBuildingsResponse = {
  buildings: Building[];
} | null;
