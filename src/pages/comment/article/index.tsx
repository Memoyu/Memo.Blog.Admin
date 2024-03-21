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
import { commentDelete, commentPage } from '@src/utils/request';
import { useTable } from '@src/hooks/useTable';
import { useModal } from '@src/hooks/useModal';
import './index.scss';
import { CommentModel, CommentPageModel, CommentPageRequest } from '@src/common/model';
import { format } from 'date-fns';

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
            render: (text) => {
                return <Avatar alt="cute cat" size="small" src={text} />;
            },
        },
        {
            title: '昵称',
            align: 'center',
            dataIndex: 'nickname',
        },
        {
            title: '评论文章',
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
        },
        {
            title: 'IP',
            align: 'center',
            dataIndex: 'ip',
        },
        {
            title: 'IP所属',
            align: 'center',
            dataIndex: 'ipBelong',
        },
        {
            title: '第三方信息',
            align: 'center',
            dataIndex: 'avatarOrigin',
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
            render: (_, comment: CommentPageModel) =>
                comment.showable ? <Badge dot type="success" /> : <Badge dot type="danger" />,
        },
        {
            title: '操作',
            align: 'center',
            width: '15%',
            render: (_text, comment: CommentPageModel) => (
                <Space>
                    <Button
                        theme="borderless"
                        type="primary"
                        size="small"
                        onClick={() => handleEditComment(comment)}
                    >
                        编辑
                    </Button>
                    <Popconfirm
                        position="left"
                        title="确定是否要保存此修改？"
                        content="此修改将不可逆"
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
    const [editComment, setEditComment] = useState<CommentModel | null>();

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
                search?.commentTime && format(search?.commentTime[0], 'yyyy-MM-dd HH:mm'),
            commentTimeEnd:
                search?.commentTime && format(search?.commentTime[1], 'yyyy-MM-dd HH:mm'),
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

    // 使用 useEffect 来异步获取表格数据
    useEffect(() => {
        getArticleCommentPage();
    }, []);

    // 编辑评论
    const handleEditComment = (data: CommentPageModel) => {
        setEditComment({ ...data });
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
    const handleEditModalOk = () => {};

    return (
        <Content title="文章评论" icon={<IconBadge />}>
            <div className="comment-container">
                <div className="comment-list">
                    <div className="comment-list-bar">
                        <Form
                            layout="horizontal"
                            getFormApi={(formData) => setSearchForm(formData)}
                        >
                            <Form.Input field="nickname" label="昵称" style={{ width: 190 }} />
                            <Form.Input field="ip" label="IP" style={{ width: 190 }} />
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
                            labelWidth={80}
                            getFormApi={(formData) => setEditForm(formData)}
                        >
                            <Form.Input
                                field="nickname"
                                label="昵称"
                                rules={[{ required: true, message: '昵称必填' }]}
                            />
                            <Form.Input field="avatar" label="头像" />
                            <Form.Input field="email" label="邮箱" />
                            <Form.Input disabled={true} field="ip" label="IP" />
                            <Form.TextArea
                                field="content"
                                label="评论内容"
                                rules={[{ required: true, message: '评论内容必填' }]}
                            />

                            <Form.Switch
                                field="showable"
                                label={{ text: '是否公开' }}
                                aria-label="是否公开"
                            />
                        </Form>
                    </Modal>
                </div>
            </div>
        </Content>
    );
};

export default Index;
