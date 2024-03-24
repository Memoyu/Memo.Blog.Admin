import {
    IconBanner,
    IconBadge,
    IconChangelog,
    IconBadgeStar,
    IconTabs,
    IconToken,
    IconTag,
    IconAvatar,
    IconButton,
    IconSpin,
    IconToast,
    IconRating,
    IconProgress,
    IconRadio,
} from '@douyinfe/semi-icons-lab';

import { IconProps } from '@douyinfe/semi-ui/lib/es/icons';

export interface MenuItem {
    itemKey: string;
    text: string;
    icon?: React.ForwardRefExoticComponent<
        Omit<IconProps, 'ref'> & React.RefAttributes<HTMLSpanElement>
    >;
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
                text: '友链管理',
                path: '/page/friend',
                icon: IconSpin,
            },
            {
                itemKey: '3-3',
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
                path: '/logger/access',
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
                text: '用户管理',
                path: '/system/account',
                icon: IconAvatar,
            },
            {
                itemKey: '5-2',
                text: '角色管理',
                path: '/system/role',
                icon: IconToast,
            },
            {
                itemKey: '5-3',
                text: '权限管理',
                path: '/system/permission',
                icon: IconButton,
            },
        ],
    },
];

export default Menus;
