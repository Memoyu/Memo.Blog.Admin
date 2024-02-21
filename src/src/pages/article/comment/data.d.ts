export type CommentItem = {
  id: number;
  avatar: string;
  content: string;
  username: string;
  qq: string;
  github: string;
  ip: string;
  link: string;
  page: RelationPage;
  public: boolean;
  updatedAt: Date;
  createdAt: Date;
};

export type RelationPage = {
  title: string;
  url: string;
};

export type CommentListParams = {
  name?: string;
  status?: string;
  current?: number;
  pageIndex?: number;
};
