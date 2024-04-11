import axios from 'axios';
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
    CommentEditRequest,
    FriendEditRequest,
    ArticleEditRequest,
    FriendPageRequest,
    CommentModel,
    AboutModel,
    SystemLogPageRequest,
    PermissionGroupModel,
    MomentPageRequest,
    MomentModel,
    MomentEditRequest,
    RoleEditRequest,
    UserPageModel,
    UserPageRequest,
    UserEditRequest,
    QiniuUploadTokenModel,
    QiniuUploadRequest,
    QiniuUploadModel,
    UploadResultModel,
} from '@common/model';

export const login = (username: string, password: string) => {
    return Request.post<TokenModel>('tokens/generate', {
        username: username,
        password: password,
    });
};

//#region 七牛云文件存储

export const qiniuTokenGet = (path: string) => {
    return Request.get<QiniuUploadTokenModel>('file-storage/qiniu/generate', { params: { path } });
};

export const qiniuUpload = (data: QiniuUploadRequest) => {
    return new Promise<UploadResultModel>(async (rev, rej) => {
        let fd = new FormData();
        fd.append('key', data.key);
        fd.append('file', data.file, data.file.name); //file是文件对象

        let tokenRes = await qiniuTokenGet(data.key);
        if (!tokenRes.isSuccess || !tokenRes.data) return;
        let token = tokenRes.data.token;
        let host = tokenRes.data.host;
        fd.append('token', token); //从后端获取到的token'

        let instance = axios.create({ withCredentials: false });
        instance
            .post<QiniuUploadModel>('https://up-z2.qiniup.com', fd, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then((resp) => {
                let res = resp?.data;
                if (res && res.key?.length > 0) rev({ url: host + res.key, file: data.file });
                else rej('上传七牛云失败' + resp);
            })
            .catch((error) => {
                rej(error);
            });
    });
};

//#endregion

//#region 文章管理

export const articlePage = (request: ArticlePageRequest) => {
    return Request.get<PaginationResult<ArticlePageModel>>('article/page', { params: request });
};

export const articlePageSummary = (request: ArticlePageRequest) => {
    return Request.get<ArticlePageSummaryModel>('article/page/summary', { params: request });
};

export const articleGet = (id: string) => {
    return Request.get<ArticleModel>('article/get', { params: { articleId: id } });
};

export const articleCreate = (article: ArticleEditRequest) => {
    return Request.post<string>('article/create', article);
};

export const articleUpdate = (article: ArticleEditRequest) => {
    return Request.put<string>('article/update', article);
};

export const articleDelete = (id: string) => {
    return Request.delete('article/delete', { params: { articleId: id } });
};

//#endregion

//#region 文章分类

export const articleCategoryList = (name?: string) => {
    return Request.get<Array<CategoryModel>>('category/list', { params: { name: name } });
};

export const articleCategoryGet = (id: string) => {
    return Request.get<CategoryModel>('category/get', { params: { categoryId: id } });
};

export const articleCategoryCreate = (name: string) => {
    return Request.post<string>('category/create', { name });
};

export const articleCategoryUpdate = (categoryId: string, name: string) => {
    return Request.put<string>('category/update', { categoryId, name });
};

export const articleCategoryDelete = (id: string) => {
    return Request.delete('category/delete', { params: { categoryId: id } });
};

//#endregion

//#region 文章标签

export const articleTagList = (name?: string) => {
    return Request.get<Array<TagModel>>('tag/list', { params: { name: name } });
};

export const articleTagGet = (id: string) => {
    return Request.get<TagModel>('tag/get', { params: { tagId: id } });
};

export const articleTagCreate = (name: string, color: string) => {
    return Request.post<string>('tag/create', { name, color });
};

export const articleTagUpdate = (tagId: string, name: string) => {
    return Request.put<string>('tag/update', { tagId, name });
};

export const articleTagDelete = (id: string) => {
    return Request.delete('tag/delete', { params: { tagId: id } });
};

//#endregion

//#region 评论

export const commentPage = (request: CommentPageRequest) => {
    return Request.get<PaginationResult<CommentPageModel>>('comment/page', { params: request });
};

export const commentGet = (id: string) => {
    return Request.get<CommentModel>('comment/get', { params: { commentId: id } });
};

export const commentUpdate = (comment: CommentEditRequest) => {
    return Request.put<string>('comment/update', comment);
};

export const commentDelete = (id: string) => {
    return Request.delete('comment/delete', { params: { commentId: id } });
};

//#endregion

//#region 友链管理

export const friendPage = (request: FriendPageRequest) => {
    return Request.get<PaginationResult<FriendModel>>('friend/page', { params: request });
};

export const friendGet = (id: string) => {
    return Request.get<FriendModel>('friend/get', { params: { friendId: id } });
};

export const friendCreate = (friend: FriendEditRequest) => {
    return Request.post<string>('friend/create', friend);
};

export const friendUpdate = (friend: FriendEditRequest) => {
    return Request.put<string>('friend/update', friend);
};

export const friendDelete = (id: string) => {
    return Request.delete('friend/delete', { params: { friendId: id } });
};

//#endregion

//#region 关于信息

export const aboutGet = () => {
    return Request.get<AboutModel>('about/get');
};

export const aboutUpdate = (about: AboutModel) => {
    return Request.put<string>('about/update', about);
};

//#endregion

//#region 动态

export const momentPage = (request: MomentPageRequest) => {
    return Request.get<PaginationResult<MomentModel>>('moment/page', { params: request });
};

export const momentGet = (id: string) => {
    return Request.get<MomentModel>('moment/get', { params: { momentId: id } });
};

export const momentCreate = (moment: MomentEditRequest) => {
    return Request.post<string>('moment/create', moment);
};

export const momentUpdate = (moment: MomentEditRequest) => {
    return Request.put<string>('moment/update', moment);
};

export const momentDelete = (id: string) => {
    return Request.delete('moment/delete', { params: { momentId: id } });
};

//#endregion

//#region 日志

// TODO： 待完善模型链接
export const visitLogPage = () => {
    return Request.get<Array<AccessLogModel>>('looger/visit/page');
};

export const systemLogPage = (request: SystemLogPageRequest) => {
    return Request.get<PaginationResult<SystemLogModel>>('looger/system/page', {
        params: request,
    });
};

//#endregion

//#region 用户

export const userPage = (request: UserPageRequest) => {
    return Request.get<PaginationResult<UserPageModel>>('user/page', {
        params: request,
    });
};

export const userGet = (id?: string) => {
    return Request.get<UserModel>('user/get', { params: { userId: id } });
};

export const userCreate = (user: UserEditRequest) => {
    return Request.post<string>('user/create', user);
};

export const userUpdate = (user: UserEditRequest) => {
    return Request.put<string>('user/update', user);
};

export const userDelete = (id: string) => {
    return Request.delete('user/delete', { params: { userId: id } });
};

//#endregion

//#region 用户角色

export const roleList = (name?: string) => {
    return Request.get<Array<RoleModel>>('role/list', { params: { name } });
};

export const roleGet = (id: string) => {
    return Request.get<RoleModel>('role/get', { params: { roleId: id } });
};

export const roleCreate = (role: RoleEditRequest) => {
    return Request.post<string>('role/create', role);
};

export const roleUpdate = (role: RoleEditRequest) => {
    return Request.put<string>('role/update', role);
};

export const roleDelete = (id: string) => {
    return Request.delete('role/delete', { params: { roleId: id } });
};

//#endregion

//#region 用户权限

export const permissionList = (name?: string, signature?: string) => {
    return Request.get<Array<PermissionModel>>('permission/list', { params: { name, signature } });
};

export const permissionGroup = (name?: string) => {
    return Request.get<Array<PermissionGroupModel>>('permission/group', { params: { name } });
};

//#endregion
