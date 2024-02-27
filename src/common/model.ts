export interface Token {
    accessToken: string; // 访问token
    refreshToken: string; // 刷新token
    userId: string; // 用户Id
    username: string; // 用户名
}

export interface Category {
    categoryId: string; // 分类Id
    name: string; // 分类名称
}

export interface Tag {
    tagId: string; // 标签Id
    name: string; // 标签名称
}
