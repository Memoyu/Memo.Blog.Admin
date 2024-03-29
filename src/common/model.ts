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

//#region 文章

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
    createTime: Date;
    isTop: boolean;
    commentable: boolean;
    publicable: boolean;
}

export interface ArticleEditRequest {
    articleId?: string; // 文章Id
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
    createTime: Date;
}

export enum ArticleStatus {
    Draft = 0,
    Published = 1,
    Offline = 2,
}

//#endregion

//#region 分类

export interface CategoryModel {
    categoryId: string; // 分类Id
    name: string; // 分类名称
}

//#endregion

//#region 标签

export interface TagModel {
    tagId: string; // 标签Id
    name: string; // 标签名称
    color: string; // 标签颜色
}

//#endregion

//#region 评论

export enum CommentType {
    Article = 0,
    Moment = 1,
    About = 2,
}

export interface CommentPageRequest extends PaginationRequest {
    commentType: CommentType;
    nickname?: string;
    ip?: string;
    commentTimeBegin?: Date;
    commentTimeEnd?: Date;
}

export interface CommentPageModel {
    commentId: string;
    belong: CommentBelongModel;
    commentType: number;
    nickname: string;
    email: string;
    content: string;
    avatar: string;
    avatarOriginType: number;
    avatarOrigin: string;
    ip: string;
    region: string;
    showable: boolean;
    createTime: Date;
}

export interface CommentModel {
    commentId: string;
    belong: CommentBelongModel;
    commentType: number;
    nickname: string;
    email: string;
    content: string;
    avatar: string;
    avatarOriginType: number;
    avatarOrigin: string;
    ip: string;
    region: string;
    showable: boolean;
    createTime: Date;
}

export interface CommentUpdateRequest {
    commentId: string;
    nickname: string;
    email?: string;
    content: string;
    avatar?: string;
    showable: boolean;
}

export interface CommentBelongModel {
    belongId: string;
    title: string;
    link: string;
}

//#endregion

//#region 友链

export interface FriendPageRequest extends PaginationRequest {
    nickname: string; // 友链名称
    description: string;
    site: string;
}

export interface FriendEditRequest {
    friendId?: string; // 友链Id
    nickname: string; // 友链名称
    description: string;
    site: string;
    avatar?: string;
    showable: boolean;
}

export interface FriendModel {
    friendId: string; // 友链Id
    nickname: string; // 友链名称
    description: string;
    site: string;
    avatar: string;
    showable: boolean;
    views: number;
    createTime: Date;
}

//#endregion

//#region 关于信息

export interface AboutModel {
    title: string;
    banner: string;
    tags: Array<string>;
    content: string;
    commentable: boolean;
}

//#endregion

//#region 访问日志

export interface AccessLogModel {
    logId: string; //
    visitor: string; //
}

//#endregion

//#region 系统日志

export enum SystemLogLevel {
    Verbose = 0,
    Debug = 1,
    Info = 2,
    Warning = 3,
    Error = 4,
    Fatal = 5,
}

export interface SystemLogPageRequest extends PaginationRequest {
    level?: SystemLogLevel;
    message?: string;
    source?: string;
    requestParamterName?: string;
    requestParamterValue?: string;
    requestId?: string;
    requestPath?: string;
    timeBegin?: Date;
    timeEnd?: Date;
}

export interface SystemLogModel {
    id: string;
    level: SystemLogLevel;
    message: string;
    source: string;
    request: string;
    requestId: string;
    requestPath: string;
    exMessage: string;
    time: Date;
}

//#endregion

//#region 用户管理

export interface UserModel {
    userId: string; // 用户Id
}

//#endregion

//#region 角色管理

export enum RoleType {
    Create = 0,
    Init = 1,
}

export interface RoleEditRequest {
    name: string;
    description: string;
    roles: Array<string>;
}

export interface RoleModel {
    roleId: string; // 角色Id
    name: string;
    type: RoleType;
    description: string;
}

//#endregion

//#region 权限管理

export interface PermissionGroupModel {
    module: string;
    moduleName: string;
    permissions: Array<PermissionModel>;
}

export interface PermissionModel {
    permissionId: string; // 权限Id
    module: string;
    moduleName: string;
    name: string;
    signature: string;
    roles: Array<RoleModel>;
}

//#endregion
