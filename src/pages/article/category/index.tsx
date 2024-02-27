import React, { useEffect } from 'react';
import { Button, Table, Space, Modal, Form } from '@douyinfe/semi-ui';
import { ColumnProps } from '@douyinfe/semi-ui/lib/es/table';
import { FormApi } from '@douyinfe/semi-ui/lib/es/form';
import { IconPlusCircleStroked } from '@douyinfe/semi-icons';
import Header from '@components/page-header';
import { articleCategoryList } from '@src/utils/request';
import { useTable } from '@src/hooks/useTable';
import { useModal } from '@src/hooks/useModal';
import './index.scss';

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
            width: '15%',
        },
        {
            title: '操作',
            align: 'center',
            render: () => {
                return (
                    <Space>
                        <Button theme="borderless" type="primary" size="small">
                            编辑
                        </Button>
                        <Button theme="borderless" type="danger" size="small">
                            删除
                        </Button>
                    </Space>
                );
            },
        },
    ];

    const [data, loading, setData, setLoading] = useTable();
    const [addKey, setAddKey, addVisible, setAddVisible, setAddModal] = useModal();

    let toGetList = async () => {
        articleCategoryList()
            .then((res) => {
                if (res.isSuccess) {
                    setData(res.data as any[]);
                }
            })
            .finally(() => setLoading(false));
    };

    let toSaveCategory = async (formData: FormApi<any>) => {};

    // 使用 useEffect 来异步获取表格数据
    useEffect(() => {
        toGetList();
    }, []);

    const handleAddCategory = () => setAddVisible(true);

    const handleAddModalOk = () => {
        setAddVisible(false);
    };
    const handleAddModalCancel = () => setAddVisible(false);

    return (
        <div className="category-container">
            <Header title="🛖 文章分类" />
            <div className="content">
                <div className="content-bar">
                    <Button
                        icon={<IconPlusCircleStroked size="small" />}
                        style={{ marginRight: 10 }}
                        onClick={handleAddCategory}
                    >
                        新增
                    </Button>
                </div>
                <div className="content-table">
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
                visible={addVisible}
                onOk={handleAddModalOk}
                onCancel={handleAddModalCancel}
                centered
                bodyStyle={{ height: 120 }}
                okText={'保存'}
            >
                <Form getFormApi={(data) => toSaveCategory(data)}>
                    <Form.Input
                        field="name"
                        placeholder="分类名称不超5个字符"
                        label="分类名称"
                        rules={[{ required: true, message: '分类名称必填' }]}
                    />
                </Form>
            </Modal>
        </div>
    );
};

export default Index;
