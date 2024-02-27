import { FC } from 'react';
import { Typography } from '@douyinfe/semi-ui';
const { Title } = Typography;

interface HeaderProps {
    title: string;
}

const Index: FC<HeaderProps> = ({ title }) => {
    return (
        <div style={{ marginBottom: '25px' }}>
            <Title heading={2} style={{ marginBottom: '10px' }}>
                {title}
            </Title>
        </div>
    );
};

export default Index;
