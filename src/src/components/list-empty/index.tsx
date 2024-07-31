import { FC } from 'react';
import { Empty } from '@douyinfe/semi-ui';
import { IllustrationIdle, IllustrationIdleDark } from '@douyinfe/semi-illustrations';

import './index.scss';

interface EmptyProps {
    description?: string;
}

const Index: FC<EmptyProps> = ({ description = '空空如也！' }) => {
    return (
        <Empty
            image={<IllustrationIdle />}
            darkModeImage={<IllustrationIdleDark />}
            description={description}
        />
    );
};

export default Index;
