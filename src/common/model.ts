export interface PaginationRequest {
    size: number;
    page: number;
    sort?: string;
}

export interface PaginationResult<T> {
    items: Array<T>;
    total: number;
}

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

export interface ArticleCommentModel {
    commentId: string; // 评论Id
    content: string;
}

export interface ArticlePageSummaryModel {
    articleTotal: number;
    commentTotal: number;
    viewTotal: number;
}

export interface ArticlePageRequest extends PaginationRequest {
    title?: string;
    categoryId?: string;
    tagIds?: Array<string>;
    status?: ArticleStatus;
}

export interface ArticlePageModel {
    articleId: string; // 文章Id
    category: CategoryModel; // 分类
    title: string;
    description: string;
    tags: Array<TagModel>;
    status: ArticleStatus;
    isTop: boolean;
    commentable: boolean;
    publicable: boolean;
}

export interface ArticleModel {
    articleId: string; // 文章Id
    category: CategoryModel; // 分类
    title: string;
    description: string;
    tags: Array<TagModel>;
    content: string;
    banner: string;
    status: ArticleStatus;
    isTop: boolean;
    commentable: boolean;
    publicable: boolean;
}

export enum ArticleStatus {
    Draft = 0,
    Published = 1,
    Offline = 2,
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

export interface UserModel {
    userId: string; // 用户Id
}

export interface RoleModel {
    roleId: string; // 角色Id
}

export interface PermissionModel {
    permissionId: string; // 权限Id
}
