import { Modal, Tooltip, Toast, Button, Dropdown, Avatar } from '@douyinfe/semi-ui';

import { useDispatch } from 'react-redux';
import { toggleUserModal } from '@redux/slices/userSlice';
import { useTypedSelector } from '@src/hooks/useTypedSelector';
import { userGet } from '@src/utils/request';
import { UserModel } from '@src/common/model';

import './index.scss';

const Index = () => {
    const dispatch = useDispatch();
    const user = useTypedSelector((state) => state.userInfo);

    const handleCancel = () => {
        dispatch(toggleUserModal(false));
    };

    return (
        <>
            <Modal
                header={null}
                footer={null}
                maskClosable={true}
                visible={user.showModal}
                onCancel={handleCancel}
                centered
            >
                <p>This is a modal with customized button texts.</p>
                <p>More content...</p>
            </Modal>
        </>
    );
};

export default Index;
