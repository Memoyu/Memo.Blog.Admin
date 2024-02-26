import React, { lazy, FC } from 'react';
import { RouteObject } from 'react-router';
import { useRoutes } from 'react-router-dom';
import { WrapperRouteComponent, WrapperRouteWithOutLayoutComponent } from './config';
import Login from '@pages/login';
import Layout from '@pages/layout';
import Empty from '@components/empty';

const Dashboard = lazy(() => import('@src/pages/dashboard'));

const Account = lazy(() => import('@src/pages/system/account'));

const Article = lazy(() => import('@src/pages/article'));

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
                path: 'account',
                element: <WrapperRouteComponent element={<Account />} titleId="账户管理" auth />,
            },

            {
                path: 'article/list',
                element: <WrapperRouteComponent element={<Article />} titleId="博客管理" auth />,
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
