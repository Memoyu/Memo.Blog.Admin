import React, { Suspense } from 'react';
import { Layout } from '@douyinfe/semi-ui';
import Sider from './components/sider';
import Footer from './components/footer';
import { Outlet } from 'react-router-dom';

import './index.scss';

const { Content } = Layout;

const Index: React.FC = () => {
    return (
        <Layout className="layout-page">
            <Layout>
                <Sider />
                <Content className="layout-content">
                    <Suspense>
                        <Outlet />
                    </Suspense>
                </Content>
                <Footer />
            </Layout>
        </Layout>
    );
};

export default Index;
