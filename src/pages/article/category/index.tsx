import React, { useEffect, useState } from 'react';
import { Button, Table, Space, Modal, Form, Toast } from '@douyinfe/semi-ui';
import { ColumnProps } from '@douyinfe/semi-ui/lib/es/table';
import { FormApi } from '@douyinfe/semi-ui/lib/es/form';
import { IconPlusCircleStroked } from '@douyinfe/semi-icons';
import Content from '@src/components/page-content';
import {
    articleCategoryList,
    articleCategoryCreate,
    articleCategoryDelete,
    articleCategoryUpdate,
} from '@src/utils/request';
import { useTable } from '@src/hooks/useTable';
import { useModal } from '@src/hooks/useModal';
import './index.scss';
import { CategoryModel } from '@src/common/model';

const Index: React.FC = () => {
    const columns: ColumnProps[] = [
        {
            title: '序号',
            align: 'center',
            dataIndex: 'categoryId',
            width: '10%',
        },
        {
            title: '名称',
            align: 'center',
            dataIndex: 'name',
        },
        {
            title: '操作',
            align: 'center',
            width: '15%',
            render: (_text, record: CategoryModel) => {
                return (
                    <Space>
                        <Button
                            theme="borderless"
                            type="primary"
                            size="small"
                            onClick={() => handleEditCategory(record)}
                        >
                            编辑
                        </Button>
                        <Button
                            theme="borderless"
                            type="danger"
                            size="small"
                            onClick={() => handleDeleteCategory(record)}
                        >
                            删除
                        </Button>
                    </Space>
                );
            },
        },
    ];

    const [data, loading, setData, setLoading] = useTable();
    const [_key, _setKey, editVisible, setEditVisible, _setAddModal] = useModal();
    const [saveCategoryForm, setSaveCategoryForm] = useState<FormApi>();
    const [editCategory, setEditCategory] = useState<CategoryModel | null>();

    let getCategoryList = async () => {
        articleCategoryList()
            .then((res) => {
                if (res.isSuccess) {
                    setData(res.data as any[]);
                }
            })
            .finally(() => setLoading(false));
    };

    // 使用 useEffect 来异步获取表格数据
    useEffect(() => {
        getCategoryList();
    }, []);

    const handleEditModalOk = () => {
        saveCategoryForm?.validate().then(async ({ name }) => {
            var msg = '';
            var res;
            if (editCategory) {
                res = await articleCategoryUpdate(editCategory.categoryId, name);
                msg = '更新成功';
            } else {
                res = await articleCategoryCreate(name);
                msg = '添加成功';
            }

            if (!res.isSuccess) {
                Toast.error(res.message);
                return;
            }
            setEditVisible(false);
            Toast.success(msg);
            getCategoryList();
        });
    };

    const handleEditCategory = (data: CategoryModel) => {
        setEditCategory(data);
        setEditVisible(true);
    };

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
        <Content title="🛖 文章分类">
            <div className="category-container">
                <div className="category-list">
                    <div className="category-list-bar">
                        <Form layout="horizontal">
                            <Form.Input field="UserName" label="名称" style={{ width: 190 }} />
                            <Space spacing="loose" style={{ alignItems: 'flex-end' }}>
                                <Button type="primary" htmlType="submit">
                                    查询
                                </Button>

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
                <Modal
                    title="添加分类"
                    visible={editVisible}
                    onOk={handleEditModalOk}
                    onCancel={() => setEditVisible(false)}
                    centered
                    bodyStyle={{ height: 120 }}
                    okText={'保存'}
                >
                    <Form
                        initValues={editCategory}
                        getFormApi={(formData) => setSaveCategoryForm(formData)}
                    >
                        <Form.Input
                            field="name"
                            placeholder="分类名称不超10个字符"
                            label="分类名称"
                            rules={[
                                { required: true, message: '分类名称必填' },
                                { max: 10, message: '长度不能超10个字符' },
                            ]}
                        />
                    </Form>
                </Modal>
            </div>
        </Content>
    );
};

export default Index;
