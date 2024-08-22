import React, { useState } from 'react';
import './index.scss';
import { format } from 'date-fns';
import { IconBadge } from '@douyinfe/semi-icons-lab';
import {
    Button,
    Typography,
    Avatar,
    Table,
    Space,
    Form,
    Popconfirm,
    Toast,
    Highlight,
} from '@douyinfe/semi-ui';

import Content from '@src/components/page-content';

import CommentEdit from './components/edit';
import CommentReply from './components/reply';
import Dot from '@src/components/dot';

import { useOnMountUnsafe } from '@src/hooks/useOnMountUnsafe';
import { useData } from '@src/hooks/useData';

import { ColumnProps } from '@douyinfe/semi-ui/lib/es/table';
import { FormApi } from '@douyinfe/semi-ui/lib/es/form';
import { commentTypeOpts } from '@src/common/select-options';
import { CommentPageModel, CommentPageRequest } from '@src/common/model';

import { commentDelete, commentPage } from '@src/utils/request';
import { useConfig } from '@src/stores';

const { Text } = Typography;

const Index: React.FC = () => {
    const columns: ColumnProps[] = [
        {
            title: 'ID',
            align: 'center',
            width: 200,
            dataIndex: 'commentId',
        },
        {
            title: '头像',
            align: 'center',
            dataIndex: 'avatar',
            width: 70,
            render: (_, comment: CommentPageModel) => {
                return <Avatar alt="cute cat" size="small" src={comment.visitor?.avatar} />;
            },
        },
        {
            title: '昵称',
            align: 'center',
            dataIndex: 'nickname',
            width: 100,
            ellipsis: { showTitle: false },
            render: (_, comment: CommentPageModel) => {
                return (
                    <Highlight
                        sourceString={comment.visitor?.nickname}
                        searchWords={searchNicknames}
                    />
                );
                // return <Text ellipsis={{ showTooltip: true }}>{comment.visitor.nickname}</Text>;
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
                return <Highlight sourceString={text} searchWords={searchContents} />;
                // return <Text ellipsis={{ showTooltip: true }}>{text}</Text>;
            },
        },
        {
            title: '邮箱',
            align: 'center',
            dataIndex: 'email',
            width: 130,
            ellipsis: { showTitle: false },
            render: (_, comment: CommentPageModel) => {
                return <Text ellipsis={{ showTooltip: true }}>{comment.visitor?.email}</Text>;
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
            width: 150,
            render: (_, comment: CommentPageModel) => (
                <Text>{format(comment.createTime, 'yyyy-MM-dd HH:mm')}</Text>
            ),
        },
        {
            title: '公开',
            align: 'center',
            width: 60,
            render: (_, comment: CommentPageModel) => <Dot tag={comment.showable} />,
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
                        type="warning"
                        size="small"
                        onClick={() => handleReplyComment(comment.commentId)}
                    >
                        回复
                    </Button>
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

    const initCommentVisitor = useConfig((state) => state.init);

    const pageSize = 15;
    const [currentPage, setCurrentPage] = useState(1);
    const [commentTotal, setCommentTotal] = useState(1);
    const [searchForm, setSearchForm] = useState<FormApi>();
    const [searchNicknames, setSearchNicknames] = useState<Array<string>>([]);
    const [searchContents, setSearchContents] = useState<Array<string>>([]);
    const [data, loading, setData, setLoading] = useData<Array<CommentPageModel>>();

    const [editVisible, setEditVisible] = useState<boolean>();
    const [editCommentId, setEditCommentId] = useState<string>('');

    const [replyVisible, setReplyVisible] = useState<boolean>();
    const [replyCommentId, setReplyCommentId] = useState<string>('');

    // 获取评论分页列表
    let getArticleCommentPage = async (page: number = 1) => {
        setLoading(true);
        setCurrentPage(page);

        let search = searchForm?.getValues();
        setSearchNicknames([search?.nickname]);
        setSearchContents([search?.content]);
        // console.log(search);
        let request = {
            commentType: search?.commentType,
            nickname: search?.nickname,
            content: search?.content,
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
        initCommentVisitor();
    });

    // 回复评论
    const handleReplyComment = (commentId: string) => {
        setReplyCommentId(commentId);
        setReplyVisible(true);
    };

    // 编辑评论
    const handleEditComment = (commentId: string) => {
        console.log('编辑评论', commentId);
        setEditCommentId(commentId);
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

    // 展开行显示表格
    const expandRowRender = (record: CommentPageModel, _index: number, _expanded: boolean) => {
        return (
            <Table
                showHeader={false}
                size="small"
                columns={columns}
                dataSource={record.children}
                rowKey={'commentId'}
                pagination={false}
            />
        );
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
                                showClear
                                label="评论类型"
                                field="commentType"
                                style={{ width: '250px' }}
                                optionList={commentTypeOpts}
                            />
                            <Form.Input
                                field="nickname"
                                showClear
                                label="昵称"
                                style={{ width: 190 }}
                            />
                            <Form.Input
                                field="content"
                                showClear
                                label="评论内容"
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
                            rowKey={'commentId'}
                            rowExpandable={(r: CommentPageModel) =>
                                r.children && r.children.length > 0
                            }
                            expandedRowRender={expandRowRender}
                            pagination={{
                                currentPage,
                                pageSize: pageSize,
                                total: commentTotal,
                                onPageChange: handlePageChange,
                            }}
                        />
                    </div>

                    {/* 编辑评论 */}
                    <CommentEdit
                        commentId={editCommentId}
                        visible={editVisible}
                        onSuccess={() => getArticleCommentPage(currentPage)}
                        onVisibleChange={setEditVisible}
                    />

                    {/* 回复评论 */}
                    <CommentReply
                        commentId={replyCommentId}
                        visible={replyVisible}
                        onSuccess={() => {
                            getArticleCommentPage(currentPage);
                            setReplyVisible(false);
                        }}
                        onVisibleChange={setReplyVisible}
                    />
                </div>
            </div>
        </Content>
    );
};

export default Index;
