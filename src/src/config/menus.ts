import {
    IconBanner,
    IconBadge,
    IconChangelog,
    IconTabs,
    IconNotification,
    IconTag,
    IconAvatar,
    IconButton,
    IconSpin,
    IconToast,
    IconRating,
    IconProgress,
    IconRadio,
    IconToken,
    IconAccessibility,
    IconConfig,
} from '@douyinfe/semi-icons-lab';

export interface MenuItem {
    itemKey: string;
    text: string;
    icon?: any;
    path?: string;
    items?: MenuItem[];
    component?: React.ComponentType<any>;
}

const Menus: MenuItem[] = [
    {
        itemKey: '1',
        text: '概览',
        icon: IconBanner,
        path: '/dashboard',
    },
    {
        itemKey: '2',
        text: '博客管理',
        items: [
            {
                itemKey: '2-1',
                text: '文章管理',
                path: '/article',
                icon: IconChangelog,
            },
            {
                itemKey: '2-2',
                text: '文章分类',
                path: '/article/category',
                icon: IconTabs,
            },
            {
                itemKey: '2-3',
                text: '文章标签',
                path: '/article/tag',
                icon: IconTag,
            },
        ],
    },
    {
        itemKey: '3',
        text: '页面管理',
        items: [
            {
                itemKey: '3-1',
                text: '评论管理',
                path: '/page/comment',
                icon: IconBadge,
            },
            {
                itemKey: '3-2',
                text: '开源管理',
                path: '/page/open-source',
                icon: IconToken,
            },
            {
                itemKey: '3-3',
                text: '友链管理',
                path: '/page/friend',
                icon: IconSpin,
            },
            {
                itemKey: '3-4',
                text: '动态管理',
                path: '/page/moment',
                icon: IconNotification,
            },
            {
                itemKey: '3-5',
                text: '关于信息',
                path: '/page/about',
                icon: IconRating,
            },
        ],
    },

    {
        itemKey: '4',
        text: '日志管理',
        items: [
            {
                itemKey: '4-1',
                text: '系统日志',
                path: '/logger/system',
                icon: IconRadio,
            },
            {
                itemKey: '4-2',
                text: '访问日志',
                path: '/logger/visit',
                icon: IconProgress,
            },
        ],
    },
    {
        itemKey: '5',
        text: '系统管理',
        items: [
            {
                itemKey: '5-1',
                text: '访客管理',
                path: '/system/visitor',
                icon: IconAccessibility,
            },
            {
                itemKey: '5-2',
                text: '用户管理',
                path: '/system/account',
                icon: IconAvatar,
            },
            {
                itemKey: '5-3',
                text: '角色管理',
                path: '/system/role',
                icon: IconToast,
            },
            {
                itemKey: '5-4',
                text: '权限管理',
                path: '/system/permission',
                icon: IconButton,
            },
            {
                itemKey: '5-1',
                text: '系统配置',
                path: '/system/config',
                icon: IconConfig,
            },
        ],
    },
];

export default Menus;
