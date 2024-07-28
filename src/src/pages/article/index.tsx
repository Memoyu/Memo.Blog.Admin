import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { format } from 'date-fns';
import { IconPlusCircleStroked } from '@douyinfe/semi-icons';
import { IconChangelog } from '@douyinfe/semi-icons-lab';
import {
    Button,
    Table,
    Space,
    Form,
    Popconfirm,
    Typography,
    Badge,
    Toast,
    Tag,
    TagGroup,
} from '@douyinfe/semi-ui';

import Content from '@src/components/page-content';
import ArticlAnlyanis from './components/article-anlyanis';

import { useData } from '@src/hooks/useData';
import { useOnMountUnsafe } from '@src/hooks/useOnMountUnsafe';

import { FormApi } from '@douyinfe/semi-ui/lib/es/form';
import { ColumnProps } from '@douyinfe/semi-ui/lib/es/table';
import { OptionProps } from '@douyinfe/semi-ui/lib/es/select';
import { TagProps } from '@douyinfe/semi-ui/lib/es/tag';
import { ArticlePageModel, ArticlePageRequest, ArticleStatus } from '@src/common/model';

import {
    articlePage,
    articleDelete,
    articleCategoryList,
    articleTagList,
} from '@src/utils/request';

import './index.scss';
import { articleStatusOpts } from '@src/common/select-options';

const { Text } = Typography;
const { Input, Select } = Form;

const Index: React.FC = () => {
    const columns: ColumnProps[] = [
        {
            title: 'ID',
            align: 'center',
            dataIndex: 'articleId',
            width: 160,
        },
        {
            title: '标题',
            align: 'center',
            dataIndex: 'title',
            width: 170,
            ellipsis: { showTitle: false },
            render: (text) => {
                return <Text ellipsis={{ showTooltip: true }}>{text}</Text>;
            },
        },
        {
            title: '描述',
            align: 'center',
            dataIndex: 'description',
            width: 200,
            ellipsis: { showTitle: false },
            render: (text) => {
                return <Text ellipsis={{ showTooltip: true }}>{text}</Text>;
            },
        },
        {
            title: '分类',
            align: 'center',
            dataIndex: 'category.name',
            width: 100,
            ellipsis: { showTitle: false },
            render: (text) => {
                return <Text ellipsis={{ showTooltip: true }}>{text}</Text>;
            },
        },
        {
            title: '标签',
            align: 'center',
            width: 150,
            render: (_, article: ArticlePageModel) => (
                <TagGroup
                    maxTagCount={2}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        width: 350,
                    }}
                    tagList={article.tags.map((t) => {
                        return { color: 'purple', children: t.name } as TagProps;
                    })}
                    size="large"
                    avatarShape="circle"
                    showPopover
                />
            ),
        },
        {
            title: '状态',
            align: 'center',
            width: 90,
            render: (_, article: ArticlePageModel) => (
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
            title: '浏览/评论/点赞',
            align: 'center',
            width: 130,
            render: (_, article: ArticlePageModel) => {
                return (
                    <Text ellipsis={{ showTooltip: true }}>
                        {article.views} / {article.comments} / {article.likes}
                    </Text>
                );
            },
        },
        {
            title: '置顶',
            align: 'center',
            width: 60,
            render: (_, article: ArticlePageModel) => getBoolTag(article.isTop),
        },
        {
            title: '评论',
            align: 'center',
            width: 60,
            render: (_, article: ArticlePageModel) => getBoolTag(article.commentable),
        },
        {
            title: '公开',
            align: 'center',
            width: 60,
            render: (_, article: ArticlePageModel) => getBoolTag(article.publicable),
        },

        {
            title: '创建时间',
            align: 'center',
            width: 150,
            render: (_, article: ArticlePageModel) => (
                <Text>{format(new Date(article.createTime), 'yyyy-MM-dd HH:mm')}</Text>
            ),
        },
        {
            title: '发布时间',
            align: 'center',
            width: 150,
            render: (_, article: ArticlePageModel) => (
                <Text>
                    {article.publishTime &&
                        format(new Date(article.publishTime), 'yyyy-MM-dd HH:mm')}
                </Text>
            ),
        },
        {
            title: '最近修改',
            align: 'center',
            width: 150,
            render: (_, article: ArticlePageModel) => (
                <Text>
                    {article.updateTime && format(new Date(article.updateTime), 'yyyy-MM-dd HH:mm')}
                </Text>
            ),
        },

        {
            title: '操作',
            align: 'center',
            width: 150,
            fixed: 'right',
            render: (_text, article: ArticlePageModel) => (
                <Space>
                    <Button
                        theme="borderless"
                        type="primary"
                        size="small"
                        onClick={() => handleEditArticle(article)}
                    >
                        编辑
                    </Button>
                    <Popconfirm
                        position="left"
                        title="确定是否要删除此文章？"
                        onConfirm={() => handleDeleteArticle(article)}
                    >
                        <Button theme="borderless" type="danger" size="small">
                            删除
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const navigate = useNavigate();
    const [data, loading, setData, setLoading] = useData<Array<ArticlePageModel>>();

    const pageSize = 15;
    const [currentPage, setCurrentPage] = useState(1);
    const [articleTotal, setArticleTotal] = useState(1);
    const [searchForm, setSearchForm] = useState<FormApi>();
    const [categories, setCategories] = useState<Array<OptionProps>>();
    const [tags, setTags] = useState<Array<OptionProps>>();

    // 获取文章列表
    let getArticlePage = async (page: number = 1) => {
        setCurrentPage(page);
        setLoading(true);

        let search = searchForm?.getValues();
        let request = {
            title: search?.title,
            categoryId: search?.category,
            tagIds: search?.tags,
            status: search?.status,
            page: page,
            size: pageSize,
        } as ArticlePageRequest;

        // 分页
        articlePage(request)
            .then((res) => {
                if (!res.isSuccess || !res.data) {
                    Toast.error(res.message);
                    return;
                }

                setData(res.data.items);
                setArticleTotal(res.data?.total || 0);
            })
            .finally(() => setLoading(false));
    };

    // 获取分类列表
    let getCategories = async () => {
        let res = await articleCategoryList();
        var opts = res.data?.map((c) => {
            return { value: c.categoryId, label: c.name };
        });
        setCategories(opts);
    };

    // 获取标签列表
    let getTags = async () => {
        let res = await articleTagList();
        setTags(
            res.data?.map((c) => {
                return { value: c.tagId, label: c.name };
            })
        );
    };

    useOnMountUnsafe(() => {
        getArticlePage();
        getCategories();
        getTags();
    });

    // bool 转 Badge元素
    const getBoolTag = (value: boolean) => {
        return value ? <Badge dot type="success" /> : <Badge dot type="danger" />;
    };

    // 编辑文章
    const handleEditArticle = (data?: ArticlePageModel) => {
        var path = '/article/edit' + (data != undefined ? `/${data?.articleId}` : '');
        navigate(path);
    };

    // 删除文章
    const handleDeleteArticle = async (data: ArticlePageModel) => {
        let res = await articleDelete(data.articleId);
        if (!res.isSuccess) {
            Toast.error(res.message);
            return;
        }
        Toast.success('删除成功');
        getArticlePage();
    };

    // 页数变更
    const handlePageChange = (page: number) => {
        getArticlePage(page);
    };

    return (
        <Content title="文章管理" icon={<IconChangelog />}>
            <div className="article-container">
                <div className="article-list">
                    <div className="article-list-summary">
                        <ArticlAnlyanis />
                    </div>
                    <div className="article-list-bar">
                        <Form
                            layout="horizontal"
                            getFormApi={(formData) => setSearchForm(formData)}
                        >
                            <Input field="title" showClear label="标题" style={{ width: 190 }} />
                            <Select
                                showClear
                                field="category"
                                label={{ text: '分类' }}
                                style={{ width: 176 }}
                                optionList={categories}
                            />
                            <Select
                                multiple
                                field="tags"
                                label={{ text: '标签' }}
                                style={{ width: 290 }}
                                optionList={tags}
                                showClear
                            />
                            <Select
                                showClear
                                field="status"
                                label={{ text: '状态' }}
                                style={{ width: 176 }}
                                optionList={articleStatusOpts}
                            />
                            <Space
                                spacing="loose"
                                style={{ alignItems: 'flex-end', marginTop: 10 }}
                            >
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    onClick={() => getArticlePage(1)}
                                >
                                    查询
                                </Button>
                                <Button htmlType="reset">重置</Button>

                                <Button
                                    icon={<IconPlusCircleStroked size="small" />}
                                    style={{ marginRight: 10 }}
                                    onClick={() => handleEditArticle()}
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
