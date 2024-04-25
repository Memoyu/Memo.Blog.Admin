import { lazy, FC } from 'react';
import { RouteObject } from 'react-router';
import { useRoutes } from 'react-router-dom';
import { WrapperRouteComponent, WrapperRouteWithOutLayoutComponent } from './config';
import Login from '@pages/login';
import Layout from '@components/layout';
import Empty from '@components/empty';

const Dashboard = lazy(() => import('@src/pages/dashboard'));

const Article = lazy(() => import('@src/pages/article'));
const ArticleEdit = lazy(() => import('@src/pages/article/edit'));
const ArticleCategory = lazy(() => import('@src/pages/article/category'));
const ArticleTag = lazy(() => import('@src/pages/article/tag'));

const Comment = lazy(() => import('@src/pages/page/comment'));
const Friend = lazy(() => import('@src/pages/page/friend'));
const Moment = lazy(() => import('@src/pages/page/moment'));
const About = lazy(() => import('@src/pages/page/about'));
const OpenSource = lazy(() => import('@src/pages/page/open-source'));

const AccessLog = lazy(() => import('@src/pages/logger/visit'));
const SystemLog = lazy(() => import('@src/pages/logger/system'));

const Account = lazy(() => import('@src/pages/system/account'));
const Role = lazy(() => import('@src/pages/system/role'));
const RoleEdit = lazy(() => import('@src/pages/system/role/edit'));
const Permission = lazy(() => import('@src/pages/system/permission'));

const routeList: RouteObject[] = [
    {
        path: '/',
        element: <WrapperRouteComponent element={<Layout />} title="" auth />,
        children: [
            {
                path: 'dashboard',
                element: <WrapperRouteComponent element={<Dashboard />} title="概览" auth />,
            },
            {
                path: 'article',
                element: <WrapperRouteComponent element={<Article />} title="文章管理" auth />,
            },
            {
                path: 'article/edit/:id?',
                element: <WrapperRouteComponent element={<ArticleEdit />} title="文章编辑" auth />,
            },
            {
                path: 'article/category',
                element: (
                    <WrapperRouteComponent element={<ArticleCategory />} title="文章分类" auth />
                ),
            },
            {
                path: 'article/tag',
                element: <WrapperRouteComponent element={<ArticleTag />} title="文章标签" auth />,
            },
            {
                path: 'page/comment',
                element: <WrapperRouteComponent element={<Comment />} title="评论管理" auth />,
            },
            {
                path: 'page/open-source',
                element: <WrapperRouteComponent element={<OpenSource />} title="开源管理" auth />,
            },
            {
                path: 'page/friend',
                element: <WrapperRouteComponent element={<Friend />} title="友链管理" auth />,
            },
            {
                path: 'page/moment',
                element: <WrapperRouteComponent element={<Moment />} title="动态管理" auth />,
            },
            {
                path: 'page/about',
                element: <WrapperRouteComponent element={<About />} title="关于信息" auth />,
            },
            {
                path: 'logger/system',
                element: <WrapperRouteComponent element={<SystemLog />} title="系统日志" auth />,
            },
            {
                path: 'logger/visit',
                element: <WrapperRouteComponent element={<AccessLog />} title="访问日志" auth />,
            },
            {
                path: 'system/account',
                element: <WrapperRouteComponent element={<Account />} title="账户管理" auth />,
            },
            {
                path: 'system/role',
                element: <WrapperRouteComponent element={<Role />} title="角色管理" auth />,
            },
            {
                path: 'system/role/edit/:id?',
                element: <WrapperRouteComponent element={<RoleEdit />} title="角色编辑" auth />,
            },
            {
                path: 'system/permission',
                element: <WrapperRouteComponent element={<Permission />} title="权限管理" auth />,
            },
        ],
    },
    {
        path: 'login',
        element: <WrapperRouteWithOutLayoutComponent element={<Login />} title="登录" />,
    },
    {
        path: '*',
        element: (
            <WrapperRouteWithOutLayoutComponent
                element={<Empty title="找不到咯" description="这里什么也没有~" type="404" />}
                title="404"
            />
        ),
    },
];

const RenderRouter: FC = () => {
    const element = useRoutes(routeList);
    return element;
};

export default RenderRouter;
