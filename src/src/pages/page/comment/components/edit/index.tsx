import { FC, useEffect, useState } from 'react';
import './index.scss';
import { Avatar, Col, Form, Modal, Row, Toast } from '@douyinfe/semi-ui';
import MdEditor from '@src/components/md-editor';

import { FormApi } from '@douyinfe/semi-ui/lib/es/form';
import { CommentEditRequest, CommentModel } from '@src/common/model';
import { commentGet, commentUpdate } from '@src/utils/request';

interface ComProps {
    commentId: string;
    visible?: boolean;
    onSuccess?: () => void;
    onVisibleChange?: (visible: boolean) => void;
}

const Index: FC<ComProps> = ({ commentId, visible, onSuccess, onVisibleChange }) => {
    const [modalVisible, setModalVisible] = useState<boolean>();
    const [editForm, setEditForm] = useState<FormApi>();

    const [editComment, setEditComment] = useState<CommentModel>();
    const [commentContent, setCommentContent] = useState<string>();

    useEffect(() => {
        handleModalVisibleChange(visible == undefined ? false : visible);
        return () => handleModalVisibleChange(false);
    }, [visible]);

    useEffect(() => {
        if (!modalVisible) return;
        commentGet(commentId).then((res) => {
            if (!res.isSuccess || !res.data) {
                Toast.error(res.message);
                handleModalVisibleChange(false);
                return;
            }

            setEditComment(res.data);
            setCommentContent(res.data.content);
        });
    }, [commentId, modalVisible]);

    // 保存编辑
    const handleEditModalOk = () => {
        editForm?.validate().then(async (form) => {
            // console.log('form', form);

            let comment = {
                ...form,
                commentId: editComment?.commentId,
                content: commentContent,
            } as CommentEditRequest;
            let res = await commentUpdate(comment);
            if (!res.isSuccess) {
                Toast.error(res.message);
                return;
            }
            setModalVisible(false);
            Toast.success('更新成功');
            onSuccess && onSuccess();
        });
    };

    const handleModalVisibleChange = (visible: boolean) => {
        setModalVisible(visible);
        onVisibleChange && onVisibleChange(visible);
    };

    return (
        <Modal
            title="编辑评论"
            visible={modalVisible}
            onOk={handleEditModalOk}
            onCancel={() => handleModalVisibleChange(false)}
            centered
            bodyStyle={{ height: 570 }}
            style={{ width: 1000 }}
            okText={'保存'}
        >
            <Form
                initValues={editComment}
                labelPosition="left"
                labelAlign="left"
                labelWidth={60}
                getFormApi={(formData) => setEditForm(formData)}
            >
                <Row gutter={16} type="flex" justify="space-around" align="middle">
                    <Col span={3}>
                        <Form.Slot noLabel>
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                }}
                            >
                                <Avatar src={editComment?.visitor.avatar} />
                            </div>
                        </Form.Slot>
                    </Col>
                    <Col span={10}>
                        <Form.Input field="visitor.nickname" label="昵称" disabled={true} />
                        <Form.Input field="visitor.email" label="邮箱" disabled={true} />
                    </Col>
                    <Col span={10}>
                        <div style={{ display: 'flex' }}>
                            <Form.Input disabled={true} field="ip" label="IP" />
                            <Form.Input disabled={true} field="region" noLabel={true} />
                        </div>
                        <Form.Switch field="showable" label={{ text: '公开' }} aria-label="公开" />
                    </Col>
                </Row>

                <Form.Section text={'评论内容'}>
                    <MdEditor
                        imgPath="articles/comments"
                        height={420}
                        content={commentContent}
                        onChange={setCommentContent}
                    />
                </Form.Section>
            </Form>
        </Modal>
    );
};

export default Index;
