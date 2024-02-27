import { FC } from 'react';
import { Typography } from '@douyinfe/semi-ui';
const { Title } = Typography;

interface HeaderProps {
    title: string;
}

const Index: FC<HeaderProps> = ({ title }) => {
    return (
        <Title heading={2} style={{ marginBottom: '10px' }}>
            {title}
        </Title>
    );
};

export default Index;
