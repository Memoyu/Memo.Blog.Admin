import Request from './request';
import { TokenModel, CategoryModel, TagModel } from '@common/model';

export const loginApi = (username: string, password: string) => {
    return Request.post<TokenModel>('/tokens/generate', {
        username: username,
        password: password,
    });
};

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
    return Request.delete<CategoryModel>('/category/delete', { params: { categoryId: id } });
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
    return Request.delete<TagModel>('/tag/delete', { params: { tagId: id } });
};

//#endregion
