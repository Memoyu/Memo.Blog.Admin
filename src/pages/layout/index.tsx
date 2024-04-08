import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from '@douyinfe/semi-ui';

import Sider from './components/sider';
import Footer from './components/footer';

import './index.scss';

const { Content } = Layout;

const Index: React.FC = () => {
    return (
        <Layout className="layout-page">
            <Sider />
            <Content className="layout-content">
                <Suspense>
                    <Outlet />
                </Suspense>
            </Content>
            <Footer />
        </Layout>
    );
};

export default Index;
