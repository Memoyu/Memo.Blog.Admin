import React, { useEffect, useState } from 'react';
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
} from '@douyinfe/semi-ui';
import { ColumnProps } from '@douyinfe/semi-ui/lib/es/table';
import { FormApi } from '@douyinfe/semi-ui/lib/es/form';
import Content from '@src/components/page-content';
import { commentDelete, commentGet, commentPage, commentUpdate } from '@src/utils/request';
import { useTable } from '@src/hooks/useTable';
import { useModal } from '@src/hooks/useModal';
import './index.scss';
import {
    CommentEditRequest,
    CommentPageModel,
    CommentPageRequest,
    CommentModel,
} from '@src/common/model';
import { format } from 'date-fns';
import { useOnMountUnsafe } from '@src/hooks/useOnMountUnsafe';

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
    const [data, loading, setData, setLoading] = useTable();

    const [_key, _setKey, editVisible, setEditVisible, _setAddModal] = useModal();
    const [editForm, setEditForm] = useState<FormApi>();
    const [editComment, setEditComment] = useState<CommentEditRequest | null>();

    // 获取评论分页列表
    let getArticleCommentPage = async (page: number = 1) => {
        setLoading(true);
        setCurrentPage(page);

        let search = searchForm?.getValues();
        console.log(search);
        let request = {
            nickname: search?.nickname,
            ip: search?.ip,
            commentTimeBegin:
                search?.commentTime[0] && format(search?.commentTime[0], 'yyyy-MM-dd HH:mm'),
            commentTimeEnd:
                search?.commentTime[1] && format(search?.commentTime[1], 'yyyy-MM-dd HH:mm'),
            page: page,
            size: pageSize,
        } as CommentPageRequest;

        let res = await commentPage(request);
        if (res.isSuccess) {
            setData(res.data?.items as any[]);
            setCommentTotal(res.data?.total || 0);
        }

        setLoading(false);
    };

    useOnMountUnsafe(() => {
        getArticleCommentPage();
    });

    // 编辑评论
    const handleEditComment = async (commentId: string) => {
        let res = await commentGet(commentId);
        if (!res.isSuccess) {
            Toast.error(res.message);
            return;
        }
        let comment = res.data as CommentModel;

        setEditComment(comment);
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
            var msg = '';
            let comment = {
                commentId: editComment?.commentId,
                // nickname: form.nickname,
                // content: form.content,
                // showable: form.showable,
                ...form,
            } as CommentEditRequest;
            let res = await commentUpdate(comment);
            msg = '更新成功';

            if (!res.isSuccess) {
                Toast.error(res.message);
                return;
            }
            setEditVisible(false);
            Toast.success(msg);
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
                            labelPosition="inset"
                            getFormApi={(formData) => setSearchForm(formData)}
                        >
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

                            <Space spacing="loose" style={{ alignItems: 'flex-end' }}>
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
                        bodyStyle={{ height: 420 }}
                        okText={'保存'}
                    >
                        <Form
                            initValues={editComment}
                            labelPosition="left"
                            labelAlign="left"
                            labelWidth={60}
                            getFormApi={(formData) => setEditForm(formData)}
                        >
                            <Form.Input
                                field="nickname"
                                label="昵称"
                                rules={[{ required: true, message: '昵称必填' }]}
                            />
                            <Form.Input field="avatar" label="头像" />
                            <Form.Input field="email" label="邮箱" />
                            <div style={{ display: 'flex' }}>
                                <Form.Input disabled={true} field="ip" label="IP" />
                                <Form.Input disabled={true} field="region" noLabel={true} />
                            </div>
                            <Form.TextArea
                                field="content"
                                label="内容"
                                rules={[{ required: true, message: '评论内容必填' }]}
                            />

                            <Form.Switch
                                field="showable"
                                label={{ text: '公开' }}
                                aria-label="公开"
                            />
                        </Form>
                    </Modal>
                </div>
            </div>
        </Content>
    );
};

export default Index;
