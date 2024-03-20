import React, { useEffect, useState } from 'react';
import {
    Button,
    Table,
    Space,
    Form,
    Popconfirm,
    Typography,
    Toast,
    Tag,
    Row,
    Col,
} from '@douyinfe/semi-ui';
import { ColumnProps } from '@douyinfe/semi-ui/lib/es/table';
import { IconPlusCircleStroked } from '@douyinfe/semi-icons';
import Content from '@src/components/page-content';
import SummaryCard from './components/summary-card';
import { articleList, articleDelete } from '@src/utils/request';
import { useTable } from '@src/hooks/useTable';
import { useNavigate } from 'react-router';
import './index.scss';
import { ArticleModel, ArticleStatus } from '@src/common/model';

const { Text } = Typography;

const Index: React.FC = () => {
    const columns: ColumnProps[] = [
        {
            title: '序号',
            align: 'center',
            dataIndex: 'articleId',
            width: 120,
        },
        {
            title: '标题',
            align: 'center',
            dataIndex: 'title',
        },
        {
            title: '描述',
            align: 'center',
            dataIndex: 'description',
            width: 300,
            render: (text) => {
                return (
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                        {/* 宽度计算方式为单元格设置宽度 - 非文本内容宽度 */}
                        <Text
                            ellipsis={{ showTooltip: true }}
                            style={{ width: 'calc(300px - 76px)' }}
                        >
                            {text}
                        </Text>
                    </span>
                );
            },
        },
        {
            title: '分类',
            align: 'center',
            dataIndex: 'category.name',
        },
        {
            title: '标签',
            align: 'center',
            width: '10%',
            render: (_, record: ArticleModel) => (
                <Space>
                    {record.tags.map((t, i) => (
                        <Tag
                            key={i}
                            type="ghost"
                            // shape="circle"
                            size="large"
                        >
                            {t.name}
                        </Tag>
                    ))}
                </Space>
            ),
        },
        {
            title: '状态',
            align: 'center',
            render: (_, article: ArticleModel) => (
                <Space>
                    {article.status == ArticleStatus.Draft ? (
                        <Tag style={{ padding: '11px 12px' }} shape="circle" color="amber">
                            草稿
                        </Tag>
                    ) : article.status == ArticleStatus.Published ? (
                        <Tag style={{ padding: '11px 12px' }} shape="circle" color="cyan">
                            已发布
                        </Tag>
                    ) : (
                        <Tag style={{ padding: '11px 12px' }} shape="circle" color="red">
                            下线
                        </Tag>
                    )}
                </Space>
            ),
        },
        {
            title: '置顶',
            align: 'center',
            width: 60,
            render: (_, article: ArticleModel) => getBoolTag(article.isTop),
        },
        {
            title: '允许评论',
            align: 'center',
            width: 90,
            render: (_, article: ArticleModel) => getBoolTag(article.commentable),
        },
        {
            title: '是否公开',
            align: 'center',
            width: 90,
            render: (_, article: ArticleModel) => getBoolTag(article.publicable),
        },
        {
            title: '操作',
            align: 'center',
            width: '15%',
            render: (_text, record: ArticleModel) => (
                <Space>
                    <Button
                        theme="borderless"
                        type="primary"
                        size="small"
                        onClick={() => handleEditArticle(record)}
                    >
                        编辑
                    </Button>
                    <Popconfirm
                        title="确定是否要保存此修改？"
                        content="此修改将不可逆"
                        onConfirm={() => handleDeleteArticle(record)}
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

    const navigate = useNavigate();
    const [data, loading, setData, setLoading] = useTable();
    const [currentPage, setCurrentPage] = useState(1);
    const [articleTotal, setArticleTotal] = useState(1);

    // 获取文章列表
    let getArticleList = async (page: number = 1) => {
        setCurrentPage(page);

        let res = await articleList({ page: page, size: pageSize });
        if (res.isSuccess) {
            setData(res.data?.items as any[]);
            setArticleTotal(res.data?.total || 0);
        }

        setLoading(false);
    };

    useEffect(() => {
        getArticleList();
    }, []);

    const getBoolTag = (value: boolean) => {
        return value ? <Text color="purple">🟢</Text> : <Text color="lime">🔴</Text>;
    };

    // 添加文章
    const handleAddArticle = () => {
        navigate('/article/edit');
    };

    // 编辑文章
    const handleEditArticle = (data: ArticleModel) => {
        navigate(`/article/edit/${data.articleId}`);
    };

    // 删除文章
    const handleDeleteArticle = async (data: ArticleModel) => {
        let res = await articleDelete(data.articleId);
        if (!res.isSuccess) {
            Toast.error(res.message);
            return;
        }
        Toast.success('删除成功');
        getArticleList();
    };

    // 页数变更
    const handlePageChange = (page: number) => {
        getArticleList(page);
    };

    return (
        <Content title="🏷️ 文章管理">
            <div className="article-container">
                <div className="article-list">
                    <div className="article-list-summary">
                        <Row gutter={8}>
                            <Col span={8}>
                                <SummaryCard
                                    type={'文章总数'}
                                    value={'123'}
                                    img={'src/assets/air.png'}
                                />
                            </Col>

                            <Col span={8}>
                                <SummaryCard
                                    type={'评论总数'}
                                    value={'23'}
                                    img={'src/assets/air.png'}
                                />
                            </Col>

                            <Col span={8}>
                                <SummaryCard
                                    type={'阅读量'}
                                    value={'13'}
                                    img={'src/assets/air.png'}
                                />
                            </Col>
                        </Row>
                    </div>
                    <div className="article-list-bar">
                        <Form layout="horizontal" onValueChange={(values) => console.log(values)}>
                            <Form.Input field="UserName" label="标题" style={{ width: 190 }} />
                            <Form.Select
                                field="Title"
                                label={{ text: '分类' }}
                                style={{ width: 176 }}
                            ></Form.Select>
                            <Form.Select
                                field="Tags"
                                label={{ text: '标签' }}
                                style={{ width: 176 }}
                            ></Form.Select>
                            <Space spacing="loose" style={{ alignItems: 'flex-end' }}>
                                <Button type="primary" htmlType="submit" onClick={getArticleList}>
                                    查询
                                </Button>
                                <Button htmlType="reset">重置</Button>

                                <Button
                                    icon={<IconPlusCircleStroked size="small" />}
                                    style={{ marginRight: 10 }}
                                    onClick={handleAddArticle}
                                >
                                    新增
                                </Button>
                            </Space>
                        </Form>
                    </div>
                    <div className="article-list-table">
                        <Table
                            showHeader={true}
                            loading={loading}
                            size="small"
                            columns={columns}
                            dataSource={data}
                            pagination={{
                                currentPage,
                                pageSize: pageSize,
                                total: articleTotal,
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
