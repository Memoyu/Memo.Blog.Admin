import React, { useState } from 'react';
import { IconTabs } from '@douyinfe/semi-icons-lab';
import { IconPlusCircleStroked } from '@douyinfe/semi-icons';
import { Button, Table, Popconfirm, Space, Form, Toast } from '@douyinfe/semi-ui';

import Content from '@src/components/page-content';
import RelatedArticles from '@pages/article/components/related-articles';
import EditCategory from './components/edit';

import { useData } from '@src/hooks/useData';
import { useOnMountUnsafe } from '@src/hooks/useOnMountUnsafe';

import { ColumnProps } from '@douyinfe/semi-ui/lib/es/table';
import { FormApi } from '@douyinfe/semi-ui/lib/es/form';
import { CategoryModel } from '@src/common/model';

import { articleCategoryList, articleCategoryDelete, articleCategoryGet } from '@src/utils/request';

import './index.scss';

const Index: React.FC = () => {
    const columns: ColumnProps[] = [
        {
            title: 'ID',
            align: 'center',
            dataIndex: 'categoryId',
            width: 165,
        },
        {
            title: '名称',
            align: 'center',
            dataIndex: 'name',
        },
        {
            title: '关联文章',
            align: 'center',
            dataIndex: 'articles',
            render: (text, category: CategoryModel) => {
                return (
                    <RelatedArticles type="category" id={category.categoryId}>
                        <Button theme="borderless" type="primary" size="small">
                            {text}
                        </Button>
                    </RelatedArticles>
                );
            },
        },
        {
            title: '操作',
            align: 'center',
            width: '15%',
            render: (_text, category: CategoryModel) => {
                return (
                    // 非初始化的未分类才显示操作
                    category.categoryId != '1' && (
                        <Space>
                            <Button
                                theme="borderless"
                                type="primary"
                                size="small"
                                onClick={() => {
                                    handleEditCategory(category.categoryId);
                                    setEditTitle('编辑分类');
                                }}
                            >
                                编辑
                            </Button>

                            <Popconfirm
                                position="left"
                                title="确定是否要删除此分类？"
                                content="所有关联文章将变为[未分类]"
                                onConfirm={() => handleDeleteCategory(category)}
                            >
                                <Button theme="borderless" type="danger" size="small">
                                    删除
                                </Button>
                            </Popconfirm>
                        </Space>
                    )
                );
            },
        },
    ];

    const [data, loading, setData, setLoading] = useData<Array<CategoryModel>>();
    const [editTitle, setEditTitle] = useState<string>('');
    const [editVisible, setEditVisible] = useState<boolean>(false);

    const [searchForm, setSearchForm] = useState<FormApi>();
    const [editCategory, setEditCategory] = useState<CategoryModel>();

    // 获取分类列表
    let getCategoryList = async () => {
        setLoading(true);

        let search = searchForm?.getValues();
        articleCategoryList(search?.name)
            .then((res) => {
                if (!res.isSuccess || !res.data) {
                    Toast.error(res.message);
                    return;
                }

                setData(res.data);
            })
            .finally(() => setLoading(false));
    };

    useOnMountUnsafe(() => {
        getCategoryList();
    });

    // 编辑/新增分类
    const handleEditCategory = async (categoryId?: string) => {
        let category;
        if (categoryId) {
            let res = await articleCategoryGet(categoryId);
            if (!res.isSuccess) {
                Toast.error(res.message);
                return;
            }
            category = res.data as CategoryModel;
        }

        setEditCategory(category);
        setEditVisible(true);
    };

    // 删除分类
    const handleDeleteCategory = (data: CategoryModel) => {
        articleCategoryDelete(data.categoryId).then((res) => {
            if (!res.isSuccess) {
                Toast.error(res.message);
                return;
            }
            Toast.success('删除成功');
            getCategoryList();
        });
    };

    return (
        <Content title="文章分类" icon={<IconTabs />}>
            <div className="category-container">
                <div className="category-list">
                    <div className="category-list-bar">
                        <Form
                            layout="horizontal"
                            getFormApi={(formData) => setSearchForm(formData)}
                        >
                            <Form.Input
                                field="name"
                                showClear
                                label="名称"
                                style={{ width: 190 }}
                            />
                            <Space
                                spacing="loose"
                                style={{ alignItems: 'flex-end', marginTop: 10 }}
                            >
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    onClick={() => getCategoryList()}
                                >
                                    查询
                                </Button>

                                <Button
                                    icon={<IconPlusCircleStroked size="small" />}
                                    onClick={() => {
                                        handleEditCategory();
                                        setEditTitle('新增分类');
                                    }}
                                >
                                    新增
                                </Button>
                            </Space>
                        </Form>
                    </div>
                    <div className="category-list-table">
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
                <EditCategory
                    title={editTitle}
                    visible={editVisible}
                    category={editCategory}
                    onChangeVisible={setEditVisible}
                    onOk={() => getCategoryList()}
                />
            </div>
        </Content>
    );
};

export default Index;
