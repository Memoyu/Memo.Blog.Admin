import Request from './request';
import {
    TokenModel,
    ArticleModel,
    CategoryModel,
    TagModel,
    FriendModel,
    AccessLogModel,
    SystemLogModel,
} from '@common/model';

export const loginApi = (username: string, password: string) => {
    return Request.post<TokenModel>('/tokens/generate', {
        username: username,
        password: password,
    });
};

//#region 文章管理

export const articleList = () => {
    return Request.get<Array<ArticleModel>>('/article/list');
};

export const articleGet = () => {
    return Request.get<ArticleModel>('/article/get');
};

export const articleCreate = (name: string) => {
    return Request.post<ArticleModel>('/article/create', { name });
};

export const articleUpdate = (articleId: string, name: string) => {
    return Request.put<ArticleModel>('/article/update', { articleId, name });
};

export const articleDelete = (id: string) => {
    return Request.delete('/article/delete', { params: { articleId: id } });
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
