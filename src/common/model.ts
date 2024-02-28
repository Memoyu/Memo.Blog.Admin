export interface TokenModel {
    accessToken: string; // 访问token
    refreshToken: string; // 刷新token
    userId: string; // 用户Id
    username: string; // 用户名
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
