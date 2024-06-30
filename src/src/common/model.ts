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

export interface QiniuUploadTokenModel {
    token: string;
    host: string;
}

export interface QiniuUploadModel {
    hash: string;
    key: string;
}

export interface UploadResultModel {
    file: File;
    url: string;
}

export interface QiniuUploadRequest {
    file: File;
    key: string;
}

//#region 概览

export interface MetricItemModel {
    name: string;
    value?: number;
}

export interface SummaryAnlyanisModel {
    weekArticles: number;
    articles: number;
    moments: number;
    friends: number;
}

export interface UniqueVisitorAnlyanisModel {
    todayUniqueVisitors: number;
    weekUniqueVisitors: Array<MetricItemModel>;
    uniqueVisitors: number;
}

export interface PageVisitorAnlyanisModel {
    todayPageVisitors: number;
    weekPageVisitors: Array<MetricItemModel>;
    pageVisitors: number;
}

export interface CommentAnlyanisModel {
    todayComments: number;
    weekComments: Array<MetricItemModel>;
    comments: number;
}

export interface AnlyanisDashboardModel {
    summary: SummaryAnlyanisModel;
    uniqueVisitor: UniqueVisitorAnlyanisModel;
    pageVisitor: PageVisitorAnlyanisModel;
    comment: CommentAnlyanisModel;
}

//#endregion

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

export interface ArticleSummaryModel {
    articles: number;
    comments: number;
    views: number;
    weekArticles: Array<MetricItemModel>;
    weekComments: Array<MetricItemModel>;
    weekViews: Array<MetricItemModel>;
}

export interface ArticleRankingModel {
    articleId: string; // 文章Id
    title: string;
    views: number;
    comments: number;
    likes: number;
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
    comments: number;
    views: number;
    likes: number;
    isTop: boolean;
    commentable: boolean;
    publicable: boolean;
    createTime: Date;
    updateTime?: Date;
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
    views: number;
    likes: number;
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
    articles: number;
}

//#endregion

//#region 标签

export interface TagModel {
    tagId: string; // 标签Id
    name: string; // 标签名称
    color: string; // 标签颜色
    articles: number;
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
    content?: string;
    ip?: string;
    dateBegin?: string;
    dateEnd?: string;
}

export interface CommentPageModel {
    commentId: string;
    belong: CommentBelongModel;
    commentType: number;
    content: string;
    visitor: CommentVisitorModel;
    reply?: CommentReplyModel;
    children?: Array<CommentPageModel>;
    floor: number;
    floorString: string;
    ip: string;
    region: string;
    showable: boolean;
    createTime: Date;
}

export interface CommentReplyModel {
    commentId: string;
    nickname: string;
    content: string;
    createTime: Date;
    floor: number;
    floorString: string;
}

export interface CommentModel {
    commentId: string;
    belong: CommentBelongModel;
    commentType: number;
    content: string;
    visitor: CommentVisitorModel;
    reply?: CommentReplyModel;
    children?: Array<CommentModel>;
    floor: number;
    floorString: string;
    ip: string;
    region: string;
    showable: boolean;
    createTime: Date;
}

export interface CommentEditRequest {
    commentId: string;
    content: string;
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

//#region 开源项目

export interface OpenSourceEditRequest {
    projectId: string;
    repoId?: number;
    title: string;
    description: string;
    imageUrl: string;
    readmeUrl: string;
}

export interface OpenSourceListRequest {
    title: string;
    description: string;
    dateBegin?: string;
    dateEnd?: string;
}

export interface OpenSourceModel {
    projectId: string;
    repoId?: number;
    repoFullName: string;
    title: string;
    description: string;
    imageUrl: string;
    readmeUrl: string;
    htmlUrl: string;
    star: number;
    fork: number;
    createTime: Date;
}

export interface GitHubRepoPageRequest extends PaginationRequest {
    keyword?: string; // 关键字
}

export interface GitHubRepoPageModel {
    id: number;
    private: boolean;
    name: string;
    fullName: string;
    description: string;
    readmeUrl: string;
    htmlUrl: string;
    topics: Array<string>;
    defaultBranch: string;
    star: number;
    fork: number;
    createdAt: Date;
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

//#region 动态

export interface MomentPageRequest extends PaginationRequest {
    tags: Array<string>;
    content: string;
    dateBegin: string;
    dateEnd: string;
}

export interface MomentEditRequest {
    momentId?: string;
    tags?: Array<string>;
    content: string;
    showable: boolean;
    commentable: boolean;
}

export interface MomentModel {
    momentId: string;
    tags: Array<string>;
    content: string;
    likes: number;
    showable: boolean;
    commentable: boolean;
    createTime: Date;
}

//#endregion

//#region 访问日志

export enum VisitLogBehavior {
    Unknown = -1,
    Home = 0,
    Article = 1,
    ArticleDetail = 11,
    Labs = 2,
    Moment = 3,
    About = 4,
}

export interface LoggerVisitedModel {
    Id: string;
    title: string;
    link: string;
}

export interface VisitLogPageRequest extends PaginationRequest {
    visitId?: string; // 访问日志Id
    visitorId?: string; // 访客Id
    behavior?: VisitLogBehavior;
    behaviorName?: string;
    visitedId: number; // 被访问信息Id（文章Id、动态Id等）
    path?: string;
    ip?: string;
    country?: string;
    region?: string;
    province?: string;
    city?: string;
    isp?: string;
    os?: string;
    browser?: string;
    dateBegin?: string;
    dateEnd?: string;
}

export interface VisitLogModel {
    visitId: string; // 访问日志Id
    visitorId: string; // 访客Id
    behavior: VisitLogBehavior;
    path: string;
    visited: LoggerVisitedModel; // 被访问信息Id（文章Id、动态Id等）
    ip: string;
    country: string;
    region: string;
    province: string;
    city: string;
    isp: string;
    os: string;
    browser: string;
    visitDate: Date;
}

//#endregion

//#region 系统日志

export enum SystemLogLevel {
    Debug = 1,
    Info = 2,
    Warning = 3,
    Error = 4,
    Fatal = 5,
}

export interface SystemLogPageRequest extends PaginationRequest {
    id?: string;
    level?: SystemLogLevel;
    message?: string;
    source?: string;
    requestParamterName?: string;
    requestParamterValue?: string;
    requestId?: string;
    requestPath?: string;
    dateBegin?: string;
    dateEnd?: string;
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

export interface UserPageRequest extends PaginationRequest {
    userId?: string;
    username?: string;
    nickname?: string;
    email?: string;
    phoneNumber?: string;
    userIdentityType?: UserIdentityType;
    roles?: Array<string>;
}

export interface UserPageModel {
    userId: string;
    username: string;
    nickname: string;
    avatar: string;
    email: string;
    phoneNumber: string;
    userIdentityType: UserIdentityType;
    roles: Array<RoleListModel>;
    lastLoginTime: Date;
    createTime: Date;
}

export interface UserModel {
    userId: string;
    username: string;
    nickname: string;
    avatar: string;
    email: string;
    phoneNumber: string;
    roles: Array<RoleListModel>;
    userIdentity: UserIdentityModel;
    lastLoginTime: Date;
    createTime: Date;
}

export interface UserIdentityModel {
    identityType: UserIdentityType;
    identifier: string;
    credential: string;
}

export enum UserIdentityType {
    Password = 0,
    WeiXin = 1,
    Qq = 2,
    GitHub = 3,
    Gitee = 4,
}

export interface UserEditRequest {
    userId?: string;
    username: string;
    nickname: string;
    userIdentityType: UserIdentityType;
    identifier: string;
    credential: string;
    avatar?: string;
    phoneNumber?: string;
    email?: string;
    roles: Array<string>;
}

//#endregion

//#region 访客管理

export enum AvatarOriginType {
    Unknown = 0,
    Qq = 1,
    Github = 2,
    Upload = 3,
}

export interface CommentVisitorModel {
    visitorId: string;
    nickname: string;
    email?: string;
    avatar?: string;
    avatarOriginType?: AvatarOriginType;
    avatarOrigin?: string;
}

export interface VisitorPageRequest extends PaginationRequest {
    nickname?: string;
    region?: string;
    dateBegin?: string;
    dateEnd?: string;
}

export interface VisitorModel {
    visitorId: string;
    nickname: string;
    email?: string;
    avatar?: string;
    avatarOriginType?: AvatarOriginType;
    avatarOrigin?: string;
    region: string;
    createTime: Date;
}

export interface VisitorEditRequest {
    visitorId: string;
    nickname: string;
    email?: string;
    avatar?: string;
    avatarOriginType?: AvatarOriginType;
    avatarOrigin?: string;
}

//#endregion

//#region 角色管理

export enum RoleType {
    Create = 0,
    Init = 1,
}

export interface RoleEditRequest {
    roleId?: string;
    name: string;
    description: string;
    permissions: Array<string>;
}

export interface RoleListModel {
    roleId: string; // 角色Id
    name: string;
    type: RoleType;
    description: string;
}

export interface RoleModel {
    roleId: string; // 角色Id
    name: string;
    type: RoleType;
    description: string;
    permissions: Array<PermissionModel>;
}

//#endregion

//#region 权限管理

export interface PermissionWithCheckModel extends PermissionModel {
    checked: boolean;
}

export interface PermissionGroupModel {
    module: string;
    moduleName: string;
    permissions: Array<PermissionWithCheckModel>;
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

//#region  消息通知

export enum BelongType {
    Article = 0,
    Moment = 1,
    About = 2,
}

export enum MessageType {
    User = 0,
    Comment = 1,
    Like = 2,
}

export interface UserMessageResult {
    userNickname: string;
    userAvatar: string;
    content: string;
}

export interface CommentMessageResult {
    visitorNickname: string;
    visitorAvatar: string;
    title: string;
    belongId: number;
    commentType: BelongType;
    content: string;
}

export interface LikeMessageResult {
    visitorNickname: string;
    visitorAvatar: string;
    title: string;
    belongId: number;
    likeType: BelongType;
}

//#endregion

//#region  Redux Model

export interface UserNotifyModel {
    avatar?: string;
    title: string;
    content: string;
    to: string;
    date: Date;
    isRead: boolean;
}

export interface MessageReadRequest {
    type?: MessageType;
    messagesIds?: Array<string>;
}

export interface MessagePageRequest extends PaginationRequest {
    type: MessageType;
}

export interface MessagePageModel {
    messageId: string;
    isRead: boolean;
    messageType: MessageType;
    content: string;
    createTime: Date;
}

export interface UnreadMessageNum {
    total: number;
    user: number;
    comment: number;
    like: number;
}

//#endregion
