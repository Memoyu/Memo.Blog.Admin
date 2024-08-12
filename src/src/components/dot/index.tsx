import { FC } from 'react';
import { Avatar } from '@douyinfe/semi-ui';

interface ComProps {
    tag: boolean;
}

const Index: FC<ComProps> = ({ tag }) => {
    return tag ? (
        <Avatar
            color="green"
            size="extra-extra-small"
            contentMotion={true}
            style={{ width: 9, height: 9 }}
        />
    ) : (
        <Avatar
            color="red"
            size="extra-extra-small"
            contentMotion={true}
            style={{ width: 9, height: 9 }}
        />
    );
};

export default Index;
