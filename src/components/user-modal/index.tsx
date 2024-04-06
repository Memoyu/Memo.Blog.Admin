import {
    Modal,
    Card,
    Typography,
    Tooltip,
    Toast,
    Space,
    Button,
    Dropdown,
    Avatar,
} from '@douyinfe/semi-ui';

import { useDispatch } from 'react-redux';
import { toggleUserShow } from '@redux/slices/userSlice';
import { useTypedSelector } from '@src/hooks/useTypedSelector';
import { store } from '@redux/store';

import './index.scss';

const { Meta } = Card;
const { Text } = Typography;

const Index = () => {
    const dispatch = useDispatch();
    const userShow = useTypedSelector((state) => state.userShow);
    const user = useTypedSelector((state) => state.userInfo);

    const handleCancel = () => {
        dispatch(toggleUserShow(false));
    };

    return (
        <>
            <Modal
                header={null}
                footer={null}
                maskClosable={true}
                visible={userShow}
                onCancel={handleCancel}
                centered
            >
                <div>
                    <Meta
                        title={user.nickname}
                        description={user.username}
                        avatar={<Avatar alt="Card meta img" size="default" src={user.avatar} />}
                        style={{ marginBottom: 30, justifyContent: 'center' }}
                    />
                    <Text strong>邮箱：</Text>
                    <Text>{user.email}</Text>
                    <br />
                    <Text strong>电话：</Text>
                    <Text>{user.phoneNumber}</Text>
                </div>
            </Modal>
        </>
    );
};

export default Index;
