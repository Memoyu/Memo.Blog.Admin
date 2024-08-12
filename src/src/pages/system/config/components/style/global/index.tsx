import { FC } from 'react';

import './index.scss';

interface ComProps {}

const Index: FC<ComProps> = ({}) => {
    return (
        <div>
            组件 - 全局样式配置
            <div>content</div>
        </div>
    );
};

export default Index;
