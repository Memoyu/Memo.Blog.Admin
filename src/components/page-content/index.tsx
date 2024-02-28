import { FC, ReactNode } from 'react';
import { Layout, Typography } from '@douyinfe/semi-ui';
import './index.scss';

const { Title } = Typography;

interface HeaderProps {
    title: string;
    children: ReactNode;
}

const Index: FC<HeaderProps> = ({ title, children }) => {
    return (
        <Layout className="page-content-container">
            <div className="page-header">
                <Title heading={2}>{title}</Title>
            </div>
            <div className="page-content">{children}</div>
        </Layout>
    );
};

export default Index;
