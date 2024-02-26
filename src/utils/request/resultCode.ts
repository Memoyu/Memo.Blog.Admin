// 请求 状态code
export enum resultCode {
    FAILURE = 0, // 处理请求失败
    SUCCESS = 1, // 处理请求成功
    TOKEN_EXPIRED = 4010, // 令牌过期
    TOKEN_INVALIDATION = 4011, // 无效令牌
    AUTHENTICATION_FAILURE = 4012, // 认证失败
}
