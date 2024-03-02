export interface TokenModel {
    accessToken: string; // 访问token
    refreshToken: string; // 刷新token
    userId: string; // 用户Id
    username: string; // 用户名
}

export interface ArticleCreateReq {
    articleId: string; // 文章Id
    category: CategoryModel; // 分类
    title: string;
}

export interface ArticleModel {
    articleId: string; // 文章Id
    category: CategoryModel; // 分类
    title: string;
}

export interface CategoryModel {
    categoryId: string; // 分类Id
    name: string; // 分类名称
}

export interface TagModel {
    tagId: string; // 标签Id
    name: string; // 标签名称
    color: string; // 标签颜色
}

export interface FriendModel {
    friendId: string; // 友链Id
    name: string; // 友链名称
}

export interface AccessLogModel {
    logId: string; //
    visitor: string; //
}

export interface SystemLogModel {
    logId: string; //
}
