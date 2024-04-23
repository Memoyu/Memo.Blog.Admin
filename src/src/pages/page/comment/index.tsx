import React, { useState } from 'react';
import { format } from 'date-fns';
import { IconBadge } from '@douyinfe/semi-icons-lab';
import {
    Button,
    Typography,
    Badge,
    Avatar,
    Table,
    Space,
    Form,
    Popconfirm,
    Modal,
    Toast,
    Row,
    Col,
} from '@douyinfe/semi-ui';

import Content from '@src/components/page-content';
import MdEditor from '@src/components/md-editor';
import UploadImage from '@src/components/upload-image';

import { useOnMountUnsafe } from '@src/hooks/useOnMountUnsafe';
import { useData } from '@src/hooks/useData';
import { useModal } from '@src/hooks/useModal';

import { ColumnProps } from '@douyinfe/semi-ui/lib/es/table';
import { FormApi } from '@douyinfe/semi-ui/lib/es/form';
import {
    CommentEditRequest,
    CommentPageModel,
    CommentPageRequest,
    CommentTypeOpts,
} from '@src/common/model';

import { commentDelete, commentGet, commentPage, commentUpdate } from '@src/utils/request';

import './index.scss';

const { Text } = Typography;

const Index: React.FC = () => {
    const columns: ColumnProps[] = [
        {
            title: 'ID',
            align: 'center',
            width: 160,
            dataIndex: 'commentId',
        },
        {
            title: '头像',
            align: 'center',
            dataIndex: 'avatar',
            width: 70,
            render: (text) => {
                return <Avatar alt="cute cat" size="small" src={text} />;
            },
        },
        {
            title: '昵称',
            align: 'center',
            dataIndex: 'nickname',
            width: 100,
            ellipsis: { showTitle: false },
            render: (text) => {
                return <Text ellipsis={{ showTooltip: true }}>{text}</Text>;
            },
        },
        {
            title: '评论所属',
            align: 'center',
            dataIndex: 'belong',
            width: 170,
            ellipsis: { showTitle: false },
            render: (_, comment: CommentPageModel) => {
                return <Text ellipsis={{ showTooltip: true }}>{comment.belong.title}</Text>;
            },
        },
        {
            title: '评论内容',
            align: 'center',
            dataIndex: 'content',
            width: 170,
            ellipsis: { showTitle: false },
            render: (text) => {
                return <Text ellipsis={{ showTooltip: true }}>{text}</Text>;
            },
        },
        {
            title: '邮箱',
            align: 'center',
            dataIndex: 'email',
            width: 130,
            ellipsis: { showTitle: false },
            render: (text) => {
                return <Text ellipsis={{ showTooltip: true }}>{text}</Text>;
            },
        },
        {
            title: 'IP',
            align: 'center',
            dataIndex: 'ip',
            width: 100,
            ellipsis: { showTitle: false },
            render: (text) => {
                return <Text ellipsis={{ showTooltip: true }}>{text}</Text>;
            },
        },
        {
            title: 'IP所属',
            align: 'center',
            dataIndex: 'region',
            width: 120,
            ellipsis: { showTitle: false },
            render: (text) => {
                return <Text ellipsis={{ showTooltip: true }}>{text}</Text>;
            },
        },
        {
            title: '第三方信息',
            align: 'center',
            dataIndex: 'avatarOrigin',
            width: 120,
            ellipsis: { showTitle: false },
            render: (text) => {
                return <Text ellipsis={{ showTooltip: true }}>{text}</Text>;
            },
        },
        {
            title: '评论时间',
            align: 'center',
            dataIndex: 'name',
            width: 150,
            render: (_, comment: CommentPageModel) => (
                <Text>{format(comment.createTime, 'yyyy-MM-dd HH:mm')}</Text>
            ),
        },
        {
            title: '公开',
            align: 'center',
            width: 60,
            render: (_, comment: CommentPageModel) =>
                comment.showable ? <Badge dot type="success" /> : <Badge dot type="danger" />,
        },
        {
            title: '操作',
            align: 'center',
            width: 150,
            fixed: 'right',
            render: (_text, comment: CommentPageModel) => (
                <Space>
                    <Button
                        theme="borderless"
                        type="primary"
                        size="small"
                        onClick={() => handleEditComment(comment.commentId)}
                    >
                        编辑
                    </Button>
                    <Popconfirm
                        position="left"
                        title="确定是否要删除此评论？"
                        onConfirm={() => handleDeleteComment(comment)}
                    >
                        <Button theme="borderless" type="danger" size="small">
                            删除
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const pageSize = 15;
    const [currentPage, setCurrentPage] = useState(1);
    const [commentTotal, setCommentTotal] = useState(1);
    const [searchForm, setSearchForm] = useState<FormApi>();
    const [data, loading, setData, setLoading] = useData<Array<CommentPageModel>>();

    const [_key, _setKey, editVisible, setEditVisible, _setAddModal] = useModal();
    const [editForm, setEditForm] = useState<FormApi>();
    const [editComment, setEditComment] = useState<CommentEditRequest>();
    const [commentContent, setCommentContent] = useState<string>('');
    const [avatar, setAvatar] = useState<string>('');

    // 获取评论分页列表
    let getArticleCommentPage = async (page: number = 1) => {
        setLoading(true);
        setCurrentPage(page);

        let search = searchForm?.getValues();
        // console.log(search);
        let request = {
            commentType: search?.commentType,
            nickname: search?.nickname,
            ip: search?.ip,
            page: page,
            size: pageSize,
        } as CommentPageRequest;
        if (search?.commentTime && search?.commentTime.length) {
            request.dateBegin = format(search?.commentTime[0], 'yyyy-MM-dd HH:mm:ss');
            request.dateEnd = format(search?.commentTime[1], 'yyyy-MM-dd HH:mm:ss');
        }

        commentPage(request)
            .then((res) => {
                if (!res.isSuccess || !res.data) {
                    Toast.error(res.message);
                    return;
                }

                setData(res.data.items);
                setCommentTotal(res.data?.total || 0);
            })
            .finally(() => setLoading(false));
    };

    useOnMountUnsafe(() => {
        getArticleCommentPage();
    });

    // 编辑评论
    const handleEditComment = async (commentId: string) => {
        let res = await commentGet(commentId);
        if (!res.isSuccess || !res.data) {
            Toast.error(res.message);
            return;
        }
        let comment = res.data;

        setEditComment({
            commentId: comment.commentId,
            nickname: comment.nickname,
            email: comment.email,
            content: comment.content,
            avatar: comment.avatar,
            showable: comment.showable,
        });

        setAvatar(comment.avatar);
        setCommentContent(comment.content);
        setEditVisible(true);
    };

    // 删除评论
    const handleDeleteComment = async (data: CommentPageModel) => {
        let res = await commentDelete(data.commentId);
        if (!res.isSuccess) {
            Toast.error(res.message);
            return;
        }
        Toast.success('删除成功');
        getArticleCommentPage();
    };

    // 页数变更
    const handlePageChange = (page: number) => {
        getArticleCommentPage(page);
    };

    // 确认编辑
    const handleEditModalOk = () => {
        editForm?.validate().then(async (form) => {
            console.log('form', form, avatar);

            let comment = {
                ...form,
                commentId: editComment?.commentId,
                avatar: avatar,
                content: commentContent,
            } as CommentEditRequest;
            let res = await commentUpdate(comment);
            if (!res.isSuccess) {
                Toast.error(res.message);
                return;
            }
            setEditVisible(false);
            Toast.success('更新成功');
            getArticleCommentPage(currentPage);
        });
    };

    return (
        <Content title="文章评论" icon={<IconBadge />}>
            <div className="comment-container">
                <div className="comment-list">
                    <div className="comment-list-bar">
                        <Form
                            layout="horizontal"
                            getFormApi={(formData) => setSearchForm(formData)}
                        >
                            <Form.Select
                                label="评论类型"
                                field="commentType"
                                initValue={''}
                                style={{ width: '250px' }}
                                optionList={CommentTypeOpts}
                            ></Form.Select>
                            <Form.Input
                                field="nickname"
                                showClear
                                label="昵称"
                                style={{ width: 190 }}
                            />
                            <Form.Input field="ip" showClear label="IP" style={{ width: 190 }} />
                            <Form.DatePicker
                                label="评论时间"
                                type="dateTimeRange"
                                field="commentTime"
                            />

                            <Space
                                spacing="loose"
                                style={{ alignItems: 'flex-end', marginTop: 10 }}
                            >
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    onClick={() => getArticleCommentPage(1)}
                                >
                                    查询
                                </Button>
                                <Button htmlType="reset">重置</Button>
                            </Space>
                        </Form>
                    </div>
                    <div className="comment-list-table">
                        <Table
                            showHeader={true}
                            loading={loading}
                            size="small"
                            columns={columns}
                            dataSource={data}
                            pagination={{
                                currentPage,
                                pageSize: pageSize,
                                total: commentTotal,
                                onPageChange: handlePageChange,
                            }}
                        />
                    </div>

                    <Modal
                        title="编辑评论"
                        visible={editVisible}
                        onOk={handleEditModalOk}
                        onCancel={() => setEditVisible(false)}
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
                                            <UploadImage
                                                type="avatar"
                                                url={avatar}
                                                path="page/about/banner"
                                                onSuccess={setAvatar}
                                            />
                                        </div>
                                    </Form.Slot>
                                </Col>
                                <Col span={10}>
                                    <Form.Input
                                        field="nickname"
                                        label="昵称"
                                        rules={[{ required: true, message: '昵称必填' }]}
                                    />
                                    <Form.Input field="email" label="邮箱" />
                                </Col>
                                <Col span={10}>
                                    <div style={{ display: 'flex' }}>
                                        <Form.Input disabled={true} field="ip" label="IP" />
                                        <Form.Input disabled={true} field="region" noLabel={true} />
                                    </div>
                                    <Form.Switch
                                        field="showable"
                                        label={{ text: '公开' }}
                                        aria-label="公开"
                                    />
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
                </div>
            </div>
        </Content>
    );
};

export default Index;
