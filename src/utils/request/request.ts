import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Toast } from '@douyinfe/semi-ui';
import { getLocalStorage, removeLocalStorage } from '@utils/storage';
import { TOKEN, USER } from '@common/constant';
import { resultCode } from './resultCode';

type Result<T> = {
    isSuccess: boolean; // 是否成功
    code: number; // 响应编码
    data?: T; // 响应数据
    message: string; // 响应消息
};

const getToken = () => {
    return getLocalStorage(TOKEN);
};

// 导出Request类，可以用来自定义传递配置来创建实例
export class Request {
    // axios 实例
    instance: AxiosInstance;
    // 基础配置，url和超时时间
    baseConfig: AxiosRequestConfig = { baseURL: '/api', timeout: 10_000 };

    constructor(config: AxiosRequestConfig) {
        // 使用axios.create创建axios实例
        this.instance = axios.create(Object.assign(this.baseConfig, config));

        this.instance.interceptors.request.use(
            function (config) {
                const token = getToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`; //携带权限参数
                }
                // 在发送请求之前做些什么
                return config;
            },
            function (error) {
                // 对请求错误做些什么
                return Promise.reject(error);
            }
        );

        this.instance.interceptors.response.use(
            (response) => {
                // 2xx 范围内的状态码都会触发该函数。
                // 对响应数据做点什么
                // console.log(response.data);
                return response.data;
            },
            (error) => {
                // 超出 2xx 范围的状态码都会触发该函数。
                // 对响应错误做点什么
                const { response } = error;
                if (response && response.data) {
                    const { code, message } = response.data;
                    // 需要登录
                    if (
                        code === resultCode.TOKEN_EXPIRED ||
                        code === resultCode.TOKEN_INVALIDATION ||
                        code === resultCode.AUTHENTICATION_FAILURE
                    ) {
                        removeLocalStorage(TOKEN);
                        removeLocalStorage(USER);
                        window.location.href = `/login${'?from=' + encodeURIComponent(location.pathname)}`;
                        return Promise.reject(error);
                    }

                    Toast.error(message);
                }

                return Promise.reject(error);
            }
        );
    }

    // 定义请求方法
    public request(config: AxiosRequestConfig): Promise<AxiosResponse> {
        return this.instance.request(config);
    }

    public get<T = any>(url: string, config?: AxiosRequestConfig) {
        return this.instance.get<T, Result<T>>(url, config);
    }

    public post<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
        return this.instance.post<T, Result<T>>(url, data, config);
    }

    public put<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
        return this.instance.put<T, Result<T>>(url, data, config);
    }

    public delete<T = any>(url: string, config?: AxiosRequestConfig) {
        return this.instance.delete<T, Result<T>>(url, config);
    }
}

// 默认导出Request实例
export default new Request({});
