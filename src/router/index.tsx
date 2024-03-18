import React, { lazy, FC } from 'react';
import { RouteObject } from 'react-router';
import { useRoutes } from 'react-router-dom';
import { WrapperRouteComponent, WrapperRouteWithOutLayoutComponent } from './config';
import Login from '@pages/login';
import Layout from '@pages/layout';
import Empty from '@components/empty';

const Dashboard = lazy(() => import('@src/pages/dashboard'));

const Article = lazy(() => import('@src/pages/article'));
const ArticleComment = lazy(() => import('@src/pages/comment/article'));
const ArticleEdit = lazy(() => import('@src/pages/article/edit'));
const ArticleCategory = lazy(() => import('@src/pages/article/category'));
const ArticleTag = lazy(() => import('@src/pages/article/tag'));

const Friend = lazy(() => import('@src/pages/page/friend'));
const About = lazy(() => import('@src/pages/page/about'));

const AccessLog = lazy(() => import('@src/pages/logger/access'));
const SystemLog = lazy(() => import('@src/pages/logger/system'));

const Account = lazy(() => import('@src/pages/system/account'));
const Role = lazy(() => import('@src/pages/system/role'));
const Permission = lazy(() => import('@src/pages/system/permission'));

const routeList: RouteObject[] = [
    {
        path: '/',
        element: <WrapperRouteComponent element={<Layout />} titleId="" auth />,
        children: [
            {
                path: 'dashboard',
                element: <WrapperRouteComponent element={<Dashboard />} titleId="概览" auth />,
            },
            {
                path: 'article',
                element: <WrapperRouteComponent element={<Article />} titleId="文章管理" auth />,
            },
            {
                path: 'article/comment',
                element: (
                    <WrapperRouteComponent element={<ArticleComment />} titleId="文章评论" auth />
                ),
            },
            {
                path: 'article/edit/:id?',
                element: (
                    <WrapperRouteComponent element={<ArticleEdit />} titleId="文章编辑" auth />
                ),
            },
            {
                path: 'article/category',
                element: (
                    <WrapperRouteComponent element={<ArticleCategory />} titleId="文章分类" auth />
                ),
            },
            {
                path: 'article/tag',
                element: <WrapperRouteComponent element={<ArticleTag />} titleId="文章标签" auth />,
            },
            {
                path: 'page/friend',
                element: <WrapperRouteComponent element={<Friend />} titleId="友链管理" auth />,
            },
            {
                path: 'page/about',
                element: <WrapperRouteComponent element={<About />} titleId="关于信息" auth />,
            },
            {
                path: 'logger/system',
                element: <WrapperRouteComponent element={<SystemLog />} titleId="系统日志" auth />,
            },
            {
                path: 'logger/access',
                element: <WrapperRouteComponent element={<AccessLog />} titleId="访问日志" auth />,
            },
            {
                path: 'system/account',
                element: <WrapperRouteComponent element={<Account />} titleId="账户管理" auth />,
            },
            {
                path: 'system/role',
                element: <WrapperRouteComponent element={<Role />} titleId="角色管理" auth />,
            },
            {
                path: 'system/permission',
                element: <WrapperRouteComponent element={<Permission />} titleId="权限管理" auth />,
            },
        ],
    },
    {
        path: 'login',
        element: <WrapperRouteWithOutLayoutComponent element={<Login />} titleId="登录" />,
    },
    {
        path: '*',
        element: (
            <WrapperRouteWithOutLayoutComponent
                element={<Empty title="找不到咯" description="这里什么也没有~" type="404" />}
                titleId="404"
            />
        ),
    },
];

const RenderRouter: FC = () => {
    const element = useRoutes(routeList);
    return element;
};

export default RenderRouter;
