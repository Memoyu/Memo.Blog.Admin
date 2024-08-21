import { FC, useEffect, useState } from 'react';
import './index.scss';
import {
    Avatar,
    Form,
    Modal,
    Select,
    Switch,
    TextArea,
    Toast,
    Typography,
} from '@douyinfe/semi-ui';
import { shallow } from 'zustand/shallow';
import { debounce } from 'lodash';

import MdEditor from '@src/components/md-editor';

import useConfig from '@src/stores/useConfig';
import {
    AdminVisitorModel,
    CommentCreateRequest,
    CommentModel,
    VisitorPageRequest,
} from '@src/common/model';
import { commentCreate, commentGet, visitorPage } from '@src/utils/request';

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

    const visitor = useConfig((state) => state.visitor, shallow);
    const setVisitor = useConfig((state) => state.setVisitor);
    const [loading, setLoading] = useState<boolean>();
    const [visitors, setVisitors] = useState<Array<AdminVisitorModel>>();

    useEffect(() => {
        handleModalVisibleChange(visible == undefined ? false : visible);
        return () => handleModalVisibleChange(false);
    }, [visible]);

    useEffect(() => {
        if (visitor.visitorId.length > 0) {
            setVisitors([visitor]);
        }
    }, [visitor]);

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

        if (visitor.visitorId.length < 1 || visitor.visitorId == '0') {
            Toast.error('请到系统配置中设置回复游客后再试');
            return;
        }

        let create: CommentCreateRequest = {
            visitorId: visitor.visitorId,
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

    const handleSearch = (val: string) => {
        let request = { nickname: val, page: 1, size: 20 } as VisitorPageRequest;
        visitorPage(request)
            .then((res) => {
                if (!res.isSuccess || !res.data) {
                    Toast.error(res.message);
                    return;
                }

                setVisitors(
                    res.data.items.map((v) => {
                        return {
                            visitorId: v.visitorId,
                            avatar: v.avatar,
                            nickname: v.nickname,
                        };
                    })
                );
            })
            .finally(() => setLoading(false));
    };

    const handleSelectChange = (visitorId: any) => {
        visitors?.forEach((v) => {
            if (v.visitorId == visitorId) {
                setVisitor(v);
            }
        });
    };

    const renderOptionItemWithVisitor = (item: AdminVisitorModel) => {
        return (
            <Select.Option value={item.visitorId} showTick={true} {...item} key={item.visitorId}>
                <div style={{ display: 'flex', alignItems: 'center', fontSize: 15 }}>
                    <Avatar size="small" src={item.avatar} />
                    <div style={{ marginLeft: 10 }}> {item.nickname}</div>
                </div>
            </Select.Option>
        );
    };

    const renderSelectedItemWithVisitor = (item: any) => {
        // console.log('选项选中', item);
        let content = (
            <div style={{ display: 'flex', alignItems: 'center', fontSize: 15 }}>
                <Avatar size="extra-small" src={item.avatar} />
                <div style={{ marginLeft: 10 }}> {item.nickname}</div>
            </div>
        );
        return content;
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
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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

                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <div>回复使用访客：</div>
                            <Select
                                style={{ marginTop: 5, width: 300 }}
                                filter
                                remote
                                value={visitor.visitorId}
                                onSearch={debounce(handleSearch, 800)}
                                loading={loading}
                                emptyContent={null}
                                onChange={handleSelectChange}
                                renderSelectedItem={renderSelectedItemWithVisitor}
                            >
                                {visitors?.map((item) => renderOptionItemWithVisitor(item))}
                            </Select>
                        </div>
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
