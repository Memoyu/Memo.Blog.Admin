import { AxiosResponse } from 'axios';
import { get, post, put, del } from './request';
import { Token } from '@model/token';
type AxiosResponseType<T> = Promise<AxiosResponse<Result<T>>>;

type Result<T> = {
    isSuccess: boolean; // 是否成功
    code: number; // 响应编码
    data?: T; // 响应数据
    message: string; // 响应消息
};

export const loginApi = async (username: string, password: string): AxiosResponseType<Token> => {
    return await post('/tokens/generate', {
        username: username,
        password: password,
    });
};
