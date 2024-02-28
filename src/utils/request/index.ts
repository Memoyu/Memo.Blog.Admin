import Request from './request';
import { Token, Category } from '@common/model';

export const loginApi = (username: string, password: string) => {
    return Request.post<Token>('/tokens/generate', {
        username: username,
        password: password,
    });
};

//#region 文章分类

export const articleCategoryList = () => {
    return Request.get<Array<Category>>('/category/list');
};

export const articleCategoryCreate = (name: string) => {
    return Request.post<Category>('/category/create', { name });
};

export const articleCategoryUpdate = (categoryId: string, name: string) => {
    return Request.put<Category>('/category/update', { categoryId, name });
};

export const articleCategoryDelete = (id: string) => {
    return Request.delete<Category>('/category/delete', { params: { categoryId: id } });
};

//#endregion
