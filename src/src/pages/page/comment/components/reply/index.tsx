import { FC, useEffect, useState } from 'react';
import './index.scss';
import {
    Avatar,
    Col,
    Form,
    Modal,
    Row,
    Switch,
    TextArea,
    Toast,
    Typography,
} from '@douyinfe/semi-ui';
import MdEditor from '@src/components/md-editor';

import { FormApi } from '@douyinfe/semi-ui/lib/es/form';
import { CommentCreateRequest, CommentEditRequest, CommentModel } from '@src/common/model';
import { commentCreate, commentGet, commentUpdate } from '@src/utils/request';

interface ComProps {
    commentId: string;
    visible?: boolean;
    onSuccess?: () => void;
    onVisibleChange?: (visible: boolean) => void;
}

const { Text } = Typography;

const Index: FC<ComProps> = ({ commentId, visible, onSuccess, onVisibleChange }) => {
    const [modalVisible, setModalVisible] = useState<boolean>();

    const [replyComment, setReplyComment] = useState<CommentModel>();
    const [commenShowable, setCommenShowable] = useState<boolean>(true);
    const [commentContent, setCommentContent] = useState<string>('');

    useEffect(() => {
        handleModalVisibleChange(visible == undefined ? false : visible);
        return () => handleModalVisibleChange(false);
    }, [visible]);

    useEffect(() => {
        if (!visible) return;
        commentGet(commentId).then((res) => {
            if (!res.isSuccess || !res.data) {
                Toast.error(res.message);
                handleModalVisibleChange(false);
                return;
            }

            setReplyComment(res.data);
        });
        return () => {
            setReplyComment(undefined);
            setCommentContent('');
        };
    }, [commentId, visible]);

    // 确认回复
    const handleReplyModalOk = () => {
        if (replyComment == undefined) {
            Toast.error('回复评论失败，请稍后再试');
            return;
        }
        let create: CommentCreateRequest = {
            visitorId: '9297675229724677',
            parentId: replyComment.parentId || replyComment.commentId,
            replyId: replyComment.commentId,
            content: commentContent,
            commentType: replyComment.commentType,
            belongId: replyComment.belong.belongId,
            showable: commenShowable,
        };

        console.log('回复评论', create);
        commentCreate(create).then((res) => {
            if (!res.isSuccess) {
                Toast.error(res.message);
                return;
            }
            setModalVisible(false);
            Toast.success('回复成功');
            onSuccess && onSuccess();
        });
    };

    const handleModalVisibleChange = (visible: boolean) => {
        setModalVisible(visible);
        onVisibleChange && onVisibleChange(visible);
    };

    return (
        <Modal
            title="回复评论"
            visible={visible}
            onOk={handleReplyModalOk}
            onCancel={() => handleModalVisibleChange(false)}
            centered
            bodyStyle={{ height: 570 }}
            style={{ width: 1000 }}
            okText={'回复'}
        >
            <Form labelPosition="left" labelAlign="left" labelWidth={60}>
                <Form.Slot noLabel>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar size="small" src={replyComment?.visitor.avatar} />
                        <Text strong style={{ marginLeft: 10 }}>
                            {replyComment?.visitor.nickname}
                        </Text>
                    </div>
                    <TextArea
                        readonly
                        style={{ marginTop: 10 }}
                        rows={5}
                        value={replyComment?.content}
                    />
                </Form.Slot>

                <Form.Section text={'评论内容'}>
                    <MdEditor
                        imgPath="articles/comments"
                        height={330}
                        content={commentContent}
                        onChange={setCommentContent}
                    />
                </Form.Section>

                <div style={{ marginTop: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Text style={{ marginRight: 8 }}>公开</Text>
                        <Switch
                            checked={commenShowable}
                            onChange={setCommenShowable}
                            aria-label="公开"
                        />
                    </div>
                </div>
            </Form>
        </Modal>
    );
};

export default Index;
