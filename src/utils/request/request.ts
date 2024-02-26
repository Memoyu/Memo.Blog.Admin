import axios, { AxiosRequestConfig } from 'axios';
import { Toast } from '@douyinfe/semi-ui';
import { getLocalStorage, removeLocalStorage } from '@utils/storage';
import { TOKEN, USER } from '@common/constant';
import { resultCode } from './resultCode';

// 创建实例时配置默认值
const instance = axios.create({
    baseURL: '/api',
});

const getToken = () => {
    return getLocalStorage(TOKEN);
};

// 重写库的超时默认值
// 现在，所有使用此实例的请求都将等待2.5秒，然后才会超时
instance.defaults.timeout = 10_000;
instance.defaults.withCredentials = false;

// 添加请求拦截器
instance.interceptors.request.use(
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

// 添加响应拦截器
instance.interceptors.response.use(
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
            Toast.error(message);

            // 需要登录
            if (
                code === resultCode.TOKEN_EXPIRED ||
                code === resultCode.TOKEN_INVALIDATION ||
                code === resultCode.AUTHENTICATION_FAILURE
            ) {
                removeLocalStorage(TOKEN);
                removeLocalStorage(USER);
                window.location.href = `/login${'?from=' + encodeURIComponent(location.pathname)}`;
            }
        }

        return Promise.reject(error);
    }
);

// GET 请求
export const get = async (url: string, config?: AxiosRequestConfig<any>) => {
    return instance.get(url, {
        headers: {
            ...config?.headers,
        },
        // `params` 是与请求一起发送的 URL 参数
        // 必须是一个简单对象或 URLSearchParams 对象
        params: config?.params,
    });
};

// POST 请求
export const post = async (url: string, data?: any, config?: AxiosRequestConfig<any>) => {
    return instance.post(url, data, {
        headers: {
            ...config?.headers,
        },
        // `params` 是与请求一起发送的 URL 参数
        // 必须是一个简单对象或 URLSearchParams 对象
        params: config?.params,
    });
};

// PUT 请求
export const put = async (url: string, data?: any, config?: AxiosRequestConfig<any>) => {
    return instance.put(url, data, {
        headers: {
            ...config?.headers,
        },
        // `params` 是与请求一起发送的 URL 参数
        // 必须是一个简单对象或 URLSearchParams 对象
        params: config?.params,
    });
};

// DELETE 请求
export const del = async (url: string, config?: AxiosRequestConfig<any>) => {
    return instance.delete(url, {
        headers: {
            ...config?.headers,
        },
        // `params` 是与请求一起发送的 URL 参数
        // 必须是一个简单对象或 URLSearchParams 对象
        params: config?.params,
    });
};
