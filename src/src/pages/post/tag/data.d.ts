export type TagGroupItem = {
  id: number;
  name: string;
  tags: TagItem[];
  status: number;
  updatedAt: Date;
  createdAt: Date;
};

export type TagItem = {
  id: number;
  name: string;
};

export type TagGroupListParams = {
  name?: string;
  status?: string;
  current?: number;
  pageIndex?: number;
};
