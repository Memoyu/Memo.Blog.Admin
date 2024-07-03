import { IconMail, IconPhone } from '@douyinfe/semi-icons';
import { Modal, Space, Tag, Typography, Avatar } from '@douyinfe/semi-ui';

import useUserStore from '@stores/useUserStore';
import { shallow } from 'zustand/shallow';

import './index.scss';

const { Title } = Typography;

const Index = () => {
    const { userInfo, toggleUserShow } = useUserStore.getState();
    const showUserModal = useUserStore((state) => state.showUserModal, shallow);

    const handleCancel = () => {
        toggleUserShow(false);
    };

    return (
        <>
            <Modal
                className="user-info-modal"
                header={null}
                footer={null}
                maskClosable={true}
                visible={showUserModal}
                onCancel={handleCancel}
                centered
            >
                <div>
                    <Avatar className="user-info-avatar" size="large" src={userInfo?.avatar} />
                    <div
                        style={{
                            marginTop: 10,
                            marginBottom: 30,
                            justifyContent: 'center',
                            textAlign: 'center',
                        }}
                    >
                        <Title heading={3}>{userInfo?.nickname}</Title>
                        <Title heading={6}>{userInfo?.username}</Title>
                        <Space style={{ marginTop: 30 }}>
                            <Tag
                                color="light-blue"
                                prefixIcon={<IconMail />}
                                size="large"
                                shape="circle"
                            >
                                {userInfo?.email}
                            </Tag>
                            <Tag
                                color="cyan"
                                size="large"
                                shape="circle"
                                prefixIcon={<IconPhone />}
                            >
                                {userInfo?.phoneNumber}
                            </Tag>
                        </Space>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default Index;
