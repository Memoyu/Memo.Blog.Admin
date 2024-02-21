export type ArticleItem = {
  id: number;
  title: string;
  category: Category;
  tags: ArticleTag[];
  status: number;
  updatedAt: Date;
  createdAt: Date;
};

export type ArticleDetail = {
  id: number;
  title: string;
  category: Category;
  tags: ArticleTag[];
  content: string;
  status: number;
  updatedAt: Date;
  createdAt: Date;
};

export type Category = {
  id: number;
  name: string;
};

export type ArticleTag = {
  id: number;
  name: string;
};

export type ArticleListParams = {
  title?: string;
  category?: number;
  tags?: number[];
  status?: string;
  current?: number;
  pageIndex?: number;
};
