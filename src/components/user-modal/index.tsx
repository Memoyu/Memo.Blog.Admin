import { IconMail, IconPhone } from '@douyinfe/semi-icons';
import { Modal, Space, Tag, Typography, Avatar } from '@douyinfe/semi-ui';

import { useDispatch } from 'react-redux';
import { toggleUserShow } from '@redux/slices/userSlice';
import { useTypedSelector } from '@src/hooks/useTypedSelector';

import './index.scss';

const { Title, Text } = Typography;

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
                className="user-info-modal"
                header={null}
                footer={null}
                maskClosable={true}
                visible={userShow}
                onCancel={handleCancel}
                centered
            >
                <div>
                    <Avatar
                        className="user-info-avatar"
                        alt="Card meta img"
                        size="large"
                        src={user.avatar}
                    />
                    <div
                        style={{
                            marginTop: 10,
                            marginBottom: 30,
                            justifyContent: 'center',
                            textAlign: 'center',
                        }}
                    >
                        <Title heading={3}>{user.nickname}</Title>
                        <Title heading={6}>{user.username}</Title>
                        <Space style={{ marginTop: 30 }}>
                            <Tag
                                color="light-blue"
                                prefixIcon={<IconMail />}
                                size="large"
                                shape="circle"
                            >
                                {user.email}
                            </Tag>
                            <Tag
                                color="cyan"
                                size="large"
                                shape="circle"
                                prefixIcon={<IconPhone />}
                            >
                                {user.phoneNumber}
                            </Tag>
                        </Space>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default Index;
