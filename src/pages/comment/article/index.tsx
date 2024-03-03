import React, { useEffect, useState } from 'react';
import { Button, Table, Space, Form } from '@douyinfe/semi-ui';
import { ColumnProps } from '@douyinfe/semi-ui/lib/es/table';
import Content from '@src/components/page-content';
import { articleCommentList } from '@src/utils/request';
import { useTable } from '@src/hooks/useTable';
import './index.scss';
import { ArticleCommentModel } from '@src/common/model';

const Index: React.FC = () => {
    const columns: ColumnProps[] = [
        {
            title: 'ID',
            align: 'center',
            dataIndex: 'logId',
        },
        {
            title: '头像',
            align: 'center',
            dataIndex: 'name',
        },
        {
            title: '昵称',
            align: 'center',
            dataIndex: 'name',
        },
        {
            title: '评论文章',
            align: 'center',
            dataIndex: 'name',
        },
        {
            title: '评论内容',
            align: 'center',
            dataIndex: 'name',
        },
        {
            title: '邮箱',
            align: 'center',
            dataIndex: 'name',
        },
        {
            title: 'IP',
            align: 'center',
            dataIndex: 'name',
        },
        {
            title: 'IP所属',
            align: 'center',
            dataIndex: 'name',
        },
        {
            title: '第三方信息',
            align: 'center',
            dataIndex: 'name',
        },
        {
            title: '评论时间',
            align: 'center',
            dataIndex: 'name',
        },
        {
            title: '是否公开',
            align: 'center',
            dataIndex: 'name',
        },
    ];

    const [currentPage, setPage] = useState(1);
    const [data, loading, setData, setLoading] = useTable();

    let getArticleCommentList = async () => {
        articleCommentList()
            .then((res) => {
                if (res.isSuccess) {
                    setData(res.data as any[]);
                }
            })
            .finally(() => setLoading(false));
    };

    // 使用 useEffect 来异步获取表格数据
    useEffect(() => {
        getArticleCommentList();
    }, []);

    const handlePageChange = (page: any) => {
        getArticleCommentList();
    };

    return (
        <Content title="🏷️ 访问日志">
            <div className="comment-container">
                <div className="comment-list">
                    <div className="comment-list-bar">
                        <Form layout="horizontal" onValueChange={(values) => console.log(values)}>
                            <Form.Input field="UserName" label="访客标识" style={{ width: 190 }} />
                            <Form.DatePicker
                                label="访问时间"
                                type="dateTimeRange"
                                field="customTime"
                            />

                            <Space spacing="loose" style={{ alignItems: 'flex-end' }}>
                                <Button type="primary" htmlType="submit">
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
                                pageSize: 5,
                                total: data.length,
                                onPageChange: handlePageChange,
                            }}
                        />
                    </div>
                </div>
            </div>
        </Content>
    );
};

export default Index;
