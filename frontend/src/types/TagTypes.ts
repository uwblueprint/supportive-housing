// TODO: Change this type to the values of the tags we want to get from the DB
export type Tag = {
  tagId: number;
  name: string;
};

export type GetTagsParams = {
  returnAll?: boolean;
  pageNumber?: number;
  resultsPerPage?: number;
};

export type GetTagsResponse = {
  tags: Tag[];
} | null;

export type CountTagsResponse = {
  numResults: number;
} | null;

export type CreateTagParams = Omit<
  Tag,
  "tagId"
>
