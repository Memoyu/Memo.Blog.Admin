import React, { FC, ReactNode, ReactElement } from 'react';
import { Layout, Typography } from '@douyinfe/semi-ui';
import UserModal from '../user-modal';

import './index.scss';

const { Title } = Typography;

interface HeaderProps {
    icon?: ReactElement;
    title?: string;
    children: ReactNode;
}

const Index: FC<HeaderProps> = ({ icon, title, children }) => {
    return (
        <Layout className="page-content-container">
            <div className="page-header">
                {icon && React.cloneElement(icon, { size: 'extra-large', key: 'extra-large' })}
                {title && (
                    <Title style={{ marginLeft: 10 }} heading={2}>
                        {title}
                    </Title>
                )}
            </div>
            <div className="page-content">{children}</div>
            <UserModal />
        </Layout>
    );
};

export default Index;
