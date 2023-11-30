// TODO: Change this type to the values of the tags we want to get from the DB
export type Tag = {
  tagId: number;
  name: string;
};

export type TagLabel = {
  label: string;
  value: number;
};

export type GetTagsResponse = {
  tags: Tag[];
} | null;
