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
    ArticleCommentModel,
} from '@common/model';

export const loginApi = (username: string, password: string) => {
    return Request.post<TokenModel>('/tokens/generate', {
        username: username,
        password: password,
    });
};

//#region 文章管理

export const articleList = () => {
    return Request.get<Array<ArticleModel>>('/article/page');
};

export const articleGet = (id: string) => {
    return Request.get<ArticleModel>('/article/get', { params: { articleId: id } });
};

export const articleCreate = (article: ArticleModel) => {
    return Request.post<ArticleModel>('/article/create', article);
};

export const articleUpdate = (article: ArticleModel) => {
    return Request.put<ArticleModel>('/article/update', article);
};

export const articleDelete = (id: string) => {
    return Request.delete('/article/delete', { params: { articleId: id } });
};

//#endregion

//#region 文章评论

export const articleCommentList = () => {
    return Request.get<Array<ArticleCommentModel>>('/comment/list');
};

export const articleCommentCreate = (name: string) => {
    return Request.post<ArticleCommentModel>('/comment/create', { name });
};

export const articleCommentUpdate = (commentId: string, name: string) => {
    return Request.put<ArticleCommentModel>('/comment/update', { commentId, name });
};

export const articleCommentDelete = (id: string) => {
    return Request.delete('/comment/delete', { params: { commentId: id } });
};

//#endregion

//#region 文章分类

export const articleCategoryList = () => {
    return Request.get<Array<CategoryModel>>('/category/list');
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

export const articleTagList = () => {
    return Request.get<Array<TagModel>>('/tag/list');
};

export const articleTagCreate = (name: string) => {
    return Request.post<TagModel>('/tag/create', { name });
};

export const articleTagUpdate = (tagId: string, name: string) => {
    return Request.put<TagModel>('/tag/update', { tagId, name });
};

export const articleTagDelete = (id: string) => {
    return Request.delete('/tag/delete', { params: { tagId: id } });
};

//#endregion

//#region 友链管理

export const friendList = () => {
    return Request.get<Array<FriendModel>>('/friend/list');
};

export const friendCreate = (name: string) => {
    return Request.post<FriendModel>('/friend/create', { name });
};

export const friendUpdate = (friendId: string, name: string) => {
    return Request.put<FriendModel>('/friend/update', { friendId, name });
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
