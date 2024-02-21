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
