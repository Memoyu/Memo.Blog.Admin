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

//#endregion
