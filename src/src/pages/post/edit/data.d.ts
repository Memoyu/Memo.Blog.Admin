export type PostDetail = {
  id: number;
  title: string;
  category: Category;
  tags: PostTag[];
  content: string;
  status: number;
  updatedAt: Date;
  createdAt: Date;
};

export type Category = {
  id: number;
  name: string;
};

export type PostTag = {
  id: number;
  name: string;
};
