const clientBaseURL = import.meta.env.VITE_CLIENT_SITE;

// 授权用户 token
const TOKEN: string = 'token';
// const REFRESH_TOKEN: string = 'refresh-token';
const USER: string = 'user';

const THEME_MODE: string = 'theme-mode';

const NOTIFICATION_HUB_ENDPOINT = 'hubs/management/notification';
const NOTIFICATION_METHOD_NAME = 'ReceivedNotification';

const CLIENT_ARTICLE_DETAIL_URL = `${clientBaseURL}article/detail/`;

export {
    TOKEN,
    USER,
    THEME_MODE,
    NOTIFICATION_HUB_ENDPOINT,
    NOTIFICATION_METHOD_NAME,
    CLIENT_ARTICLE_DETAIL_URL,
};
