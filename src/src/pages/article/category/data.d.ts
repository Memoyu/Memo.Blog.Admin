export type CategoryItem = {
  id: number;
  name: string;
  status: number;
  updatedAt: Date;
  createdAt: Date;
};

export type CategoryListParams = {
  name?: string;
  status?: string;
  current?: number;
  pageIndex?: number;
};
