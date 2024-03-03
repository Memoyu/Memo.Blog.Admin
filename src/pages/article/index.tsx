import React, { useEffect, useState } from 'react';
import { Button, Table, Space, Modal, Form, Toast, Tag, Row, Col } from '@douyinfe/semi-ui';
import { ColumnProps } from '@douyinfe/semi-ui/lib/es/table';
import { FormApi } from '@douyinfe/semi-ui/lib/es/form';
import { IconPlusCircleStroked } from '@douyinfe/semi-icons';
import Content from '@src/components/page-content';
import SummaryCard from './components/summary-card';
import { articleList, articleDelete } from '@src/utils/request';
import { useTable } from '@src/hooks/useTable';
import { useModal } from '@src/hooks/useModal';
import './index.scss';
import { ArticleModel } from '@src/common/model';

const Index: React.FC = () => {
    const columns: ColumnProps[] = [
        {
            title: '序号',
            align: 'center',
            dataIndex: 'articleId',
            width: '5%',
        },
        {
            title: '标题',
            align: 'center',
            dataIndex: 'name',
        },
        {
            title: '描述',
            align: 'center',
            dataIndex: 'name',
            width: '10%',
        },
        {
            title: '分类',
            align: 'center',
            dataIndex: 'name',
        },
        {
            title: '标签',
            align: 'center',
            dataIndex: 'name',
            width: '10%',
            render: (text, record: ArticleModel) => (
                <Tag
                    style={{}}
                    type="ghost"
                    // shape="circle"
                    size="large"
                >
                    {text}
                </Tag>
            ),
        },
        {
            title: '状态',
            align: 'center',
            dataIndex: 'name',
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
                    <Button
                        theme="borderless"
                        type="danger"
                        size="small"
                        onClick={() => handleDeleteArticle(record)}
                    >
                        删除
                    </Button>
                </Space>
            ),
        },
    ];

    const [data, loading, setData, setLoading] = useTable();
    const [_key, _setKey, editVisible, setEditVisible, _setAddModal] = useModal();

    let getArticleList = async () => {
        articleList()
            .then((res) => {
                if (res.isSuccess) {
                    setData(res.data as any[]);
                }
            })
            .finally(() => setLoading(false));
    };

    // 使用 useEffect 来异步获取表格数据
    useEffect(() => {
        getArticleList();
    }, []);

    const handleEditArticle = (data: ArticleModel) => {};

    const handleDeleteArticle = (data: ArticleModel) => {
        articleDelete(data.articleId).then((res) => {
            if (!res.isSuccess) {
                Toast.error(res.message);
                return;
            }
            Toast.success('删除成功');
            getArticleList();
        });
    };

    return (
        <Content title="🏷️ 文章管理">
            <div className="article-container">
                <div className="article-list">
                    <div className="article-list-summary">
                        <Row gutter={8}>
                            <Col span={8}>
                                <SummaryCard
                                    type={'空调'}
                                    status={true}
                                    value={'离线中'}
                                    img={'src/assets/air.png'}
                                />
                            </Col>

                            <Col span={8}>
                                <SummaryCard
                                    type={'空调'}
                                    status={true}
                                    value={'离线中'}
                                    img={'src/assets/air.png'}
                                />
                            </Col>

                            <Col span={8}>
                                <SummaryCard
                                    type={'空调'}
                                    status={true}
                                    value={'离线中'}
                                    img={'src/assets/air.png'}
                                />
                            </Col>
                        </Row>
                    </div>
                    <div className="article-list-bar">
                        <Form layout="horizontal" onValueChange={(values) => console.log(values)}>
                            <Form.Select
                                field="Role"
                                label={{ text: '分类' }}
                                style={{ width: 176 }}
                            ></Form.Select>
                            <Form.Select
                                field="Role"
                                label={{ text: '标签' }}
                                style={{ width: 176 }}
                            ></Form.Select>
                            <Form.Input field="UserName" label="标题" style={{ width: 190 }} />

                            <Space spacing="loose" style={{ alignItems: 'flex-end' }}>
                                <Button type="primary" htmlType="submit">
                                    查询
                                </Button>
                                <Button htmlType="reset">重置</Button>

                                <Button
                                    icon={<IconPlusCircleStroked size="small" />}
                                    style={{ marginRight: 10 }}
                                    onClick={() => {
                                        setEditVisible(true);
                                    }}
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
                            pagination={false}
                        />
                    </div>
                </div>
            </div>
        </Content>
    );
};

export default Index;
