// TODO: Change this type to the values of the tags we want to get from the DB
export type Tag = {
  tagId: number;
  name: string;
  status: TagStatus
};

export type TagLabel = {
  label: string;
  value: number;
};

export type GetTagsResponse = {
  tags: Tag[];
} | null;

export enum TagStatus {
  ACTIVE = "Active",
  DELETED = "Deleted",
}
