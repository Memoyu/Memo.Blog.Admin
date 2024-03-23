import Request from './request';
import {
    TokenModel,
    ArticleModel,
    CategoryModel,
    TagModel,
    FriendModel,
    AccessLogModel,
    SystemLogModel,
    UserModel,
    RoleModel,
    PermissionModel,
    PaginationResult,
    ArticlePageModel,
    ArticlePageRequest,
    ArticlePageSummaryModel,
    CommentPageModel,
    CommentPageRequest,
    CommentUpdateRequest,
    FriendEditRequest,
    ArticleEditRequest,
    FriendPageRequest,
    CommentModel,
} from '@common/model';

export const loginApi = (username: string, password: string) => {
    return Request.post<TokenModel>('/tokens/generate', {
        username: username,
        password: password,
    });
};

//#region 文章管理

export const articlePage = (request: ArticlePageRequest) => {
    return Request.get<PaginationResult<ArticlePageModel>>('/article/page', { params: request });
};

export const articlePageSummary = (request: ArticlePageRequest) => {
    return Request.get<ArticlePageSummaryModel>('/article/page/summary', { params: request });
};

export const articleGet = (id: string) => {
    return Request.get<ArticleModel>('/article/get', { params: { articleId: id } });
};

export const articleCreate = (article: ArticleEditRequest) => {
    return Request.post<string>('/article/create', article);
};

export const articleUpdate = (article: ArticleEditRequest) => {
    return Request.put<string>('/article/update', article);
};

export const articleDelete = (id: string) => {
    return Request.delete('/article/delete', { params: { articleId: id } });
};

//#endregion

//#region 评论

export const commentPage = (request: CommentPageRequest) => {
    return Request.get<PaginationResult<CommentPageModel>>('/comment/page', { params: request });
};

export const commentGet = (id: string) => {
    return Request.get<CommentModel>('/comment/get', { params: { commentId: id } });
};

export const commentUpdate = (comment: CommentUpdateRequest) => {
    return Request.put<string>('/comment/update', comment);
};

export const commentDelete = (id: string) => {
    return Request.delete('/comment/delete', { params: { commentId: id } });
};

//#endregion

//#region 文章分类

export const articleCategoryList = (name?: string) => {
    return Request.get<Array<CategoryModel>>('/category/list', { params: { name: name } });
};

export const articleCategoryGet = (id: string) => {
    return Request.get<CategoryModel>('/category/get', { params: { categoryId: id } });
};

export const articleCategoryCreate = (name: string) => {
    return Request.post<CategoryModel>('/category/create', { name });
};

export const articleCategoryUpdate = (categoryId: string, name: string) => {
    return Request.put<CategoryModel>('/category/update', { categoryId, name });
};

export const articleCategoryDelete = (id: string) => {
    return Request.delete('/category/delete', { params: { categoryId: id } });
};

//#endregion

//#region 文章标签

export const articleTagList = (name?: string) => {
    return Request.get<Array<TagModel>>('/tag/list', { params: { name: name } });
};

export const articleTagGet = (id: string) => {
    return Request.get<TagModel>('/tag/get', { params: { tagId: id } });
};

export const articleTagCreate = (name: string, color: string) => {
    return Request.post<TagModel>('/tag/create', { name, color });
};

export const articleTagUpdate = (tagId: string, name: string) => {
    return Request.put<TagModel>('/tag/update', { tagId, name });
};

export const articleTagDelete = (id: string) => {
    return Request.delete('/tag/delete', { params: { tagId: id } });
};

//#endregion

//#region 友链管理

export const friendPage = (request: FriendPageRequest) => {
    return Request.get<PaginationResult<FriendModel>>('/friend/page', { params: request });
};

export const friendGet = (id: string) => {
    return Request.get<FriendModel>('/friend/get', { params: { friendId: id } });
};

export const friendCreate = (friend: FriendEditRequest) => {
    return Request.post<string>('/friend/create', friend);
};

export const friendUpdate = (friend: FriendEditRequest) => {
    return Request.put<string>('/friend/update', friend);
};

export const friendDelete = (id: string) => {
    return Request.delete('/friend/delete', { params: { friendId: id } });
};

//#endregion

//#region 日志

// TODO： 待完善模型链接
export const accessLogList = () => {
    return Request.get<Array<AccessLogModel>>('/friend/list');
};

// TODO： 待完善模型链接
export const systemLogList = () => {
    return Request.get<Array<SystemLogModel>>('/friend/list');
};

//#endregion

//#region 用户

export const userList = () => {
    return Request.get<Array<UserModel>>('/user/list');
};

export const userCreate = (name: string) => {
    return Request.post<UserModel>('/user/create', { name });
};

export const userUpdate = (userId: string, name: string) => {
    return Request.put<UserModel>('/user/update', { userId, name });
};

export const userDelete = (id: string) => {
    return Request.delete('/user/delete', { params: { userId: id } });
};

//#endregion

//#region 用户角色

export const roleList = () => {
    return Request.get<Array<RoleModel>>('/role/list');
};

export const roleCreate = (name: string) => {
    return Request.post<RoleModel>('/role/create', { name });
};

export const roleUpdate = (roleId: string, name: string) => {
    return Request.put<RoleModel>('/role/update', { roleId, name });
};

export const roleDelete = (id: string) => {
    return Request.delete('/role/delete', { params: { roleId: id } });
};

//#endregion

//#region 用户权限

export const permissionList = () => {
    return Request.get<Array<PermissionModel>>('/permission/list');
};

export const permissionCreate = (name: string) => {
    return Request.post<PermissionModel>('/permission/create', { name });
};

export const permissionUpdate = (permissionId: string, name: string) => {
    return Request.put<PermissionModel>('/permission/update', { permissionId, name });
};

export const permissionDelete = (id: string) => {
    return Request.delete('/permission/delete', { params: { permissionId: id } });
};

//#endregion
