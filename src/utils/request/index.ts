import Request from './request';
import { Token } from '@model/token';

export const loginApi = (username: string, password: string) => {
    return Request.post<Token>('/tokens/generate', {
        username: username,
        password: password,
    });
};
