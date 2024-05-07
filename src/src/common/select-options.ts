import { OptionProps } from '@douyinfe/semi-ui/lib/es/select/option';

export const articleStatusOpts: Array<OptionProps> = [
    {
        label: '草稿',
        value: 0,
    },
    {
        label: '发布',
        value: 1,
    },
    {
        label: '下线',
        value: 2,
    },
];

export const commentTypeOpts: Array<OptionProps> = [
    {
        value: 0,
        label: '文章',
    },
    {
        value: 1,
        label: '动态',
    },
    {
        value: 2,
        label: '关于',
    },
];

export const userIdentityOpts: Array<OptionProps> = [
    {
        value: 0,
        label: '密码',
    },
    {
        value: 1,
        label: '微信',
    },
    {
        value: 2,
        label: 'QQ',
    },
    {
        value: 3,
        label: 'Github',
    },
    {
        value: 4,
        label: 'Gitee',
    },
];

export const visitLogBehaviorOpts: Array<OptionProps> = [
    {
        label: '未知',
        value: -1,
    },
    {
        label: '首页',
        value: 0,
    },
    {
        label: '文章列表',
        value: 1,
    },
    {
        label: '文章详情',
        value: 11,
    },
    {
        label: '实验室',
        value: 2,
    },
    {
        label: '动态',
        value: 3,
    },
    {
        label: '关于',
        value: 4,
    },
];

export const AvatarOriginTypeOpts: Array<OptionProps> = [
    {
        value: 0,
        label: '未知',
    },
    {
        value: 1,
        label: 'QQ',
    },
    {
        value: 2,
        label: 'GitHub',
    },
    {
        value: 3,
        label: '链接',
    },
];

export const systemLogLevelOpts: Array<OptionProps> = [
    {
        label: 'Debug',
        value: 1,
    },
    {
        label: 'Info',
        value: 2,
    },
    {
        label: 'Warning',
        value: 3,
    },
    {
        label: 'Error',
        value: 4,
    },
    {
        label: 'Fatal',
        value: 5,
    },
];
