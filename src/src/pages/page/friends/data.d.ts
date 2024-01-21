export type FriendItem = {
  id: number;
  avatar: string;
  nickname: string;
  desc: string;
  link: string;
  public: boolean;
  views: number;
  updatedAt: Date;
  createdAt: Date;
};

export type FriendListParams = {
  name?: string;
  status?: string;
  current?: number;
  pageIndex?: number;
};
