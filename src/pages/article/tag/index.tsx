import React, { useEffect, useState } from 'react';
import { IconTag } from '@douyinfe/semi-icons-lab';
import { Button, Table, Space, Modal, Form, Toast, Tag } from '@douyinfe/semi-ui';
import { ColumnProps } from '@douyinfe/semi-ui/lib/es/table';
import { FormApi } from '@douyinfe/semi-ui/lib/es/form';
import { IconPlusCircleStroked } from '@douyinfe/semi-icons';
import Content from '@src/components/page-content';
import {
    articleTagList,
    articleTagCreate,
    articleTagDelete,
    articleTagUpdate,
} from '@src/utils/request';
import { useTable } from '@src/hooks/useTable';
import { useModal } from '@src/hooks/useModal';
import './index.scss';
import { TagModel } from '@src/common/model';

const Index: React.FC = () => {
    const columns: ColumnProps[] = [
        {
            title: '序号',
            align: 'center',
            dataIndex: 'tagId',
            width: '10%',
        },
        {
            title: '名称',
            align: 'center',
            dataIndex: 'name',
            render: (text, record: TagModel) => (
                <Tag
                    style={{ color: record.color, borderColor: record.color }}
                    type="ghost"
                    // shape="circle"
                    size="large"
                >
                    {text}
                </Tag>
            ),
        },
        {
            title: '操作',
            align: 'center',
            width: '15%',
            render: (_text, record: TagModel) => (
                <Space>
                    <Button
                        theme="borderless"
                        type="primary"
                        size="small"
                        onClick={() => handleEditTag(record)}
                    >
                        编辑
                    </Button>
                    <Button
                        theme="borderless"
                        type="danger"
                        size="small"
                        onClick={() => handleDeleteTag(record)}
                    >
                        删除
                    </Button>
                </Space>
            ),
        },
    ];

    const [data, loading, setData, setLoading] = useTable();
    const [_key, _setKey, editVisible, setEditVisible, _setAddModal] = useModal();
    const [saveTagForm, setSaveTagForm] = useState<FormApi>();
    const [editTag, setEditTag] = useState<TagModel | null>();

    let getTagList = async () => {
        articleTagList()
            .then((res) => {
                if (res.isSuccess) {
                    setData(res.data as any[]);
                }
            })
            .finally(() => setLoading(false));
    };

    // 使用 useEffect 来异步获取表格数据
    useEffect(() => {
        getTagList();
    }, []);

    const handleEditModalOk = () => {
        saveTagForm?.validate().then(async ({ name }) => {
            var msg = '';
            var res;
            if (editTag) {
                res = await articleTagUpdate(editTag.tagId, name);
                msg = '更新成功';
            } else {
                res = await articleTagCreate(name);
                msg = '添加成功';
            }

            if (!res.isSuccess) {
                Toast.error(res.message);
                return;
            }
            setEditVisible(false);
            Toast.success(msg);
            getTagList();
        });
    };

    const handleEditTag = (data: TagModel) => {
        setEditTag(data);
        setEditVisible(true);
    };

    const handleDeleteTag = (data: TagModel) => {
        articleTagDelete(data.tagId).then((res) => {
            if (!res.isSuccess) {
                Toast.error(res.message);
                return;
            }
            Toast.success('删除成功');
            getTagList();
        });
    };

    return (
        <Content title="文章标签" icon={<IconTag />}>
            <div className="tag-container">
                <div className="tag-list">
                    <div className="tag-list-bar">
                        <Form layout="horizontal" onValueChange={(values) => console.log(values)}>
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
                    <div className="tag-list-table">
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
                    <Form initValues={editTag} getFormApi={(formData) => setSaveTagForm(formData)}>
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
