import React, { useEffect, useState } from 'react';
import { IconTag } from '@douyinfe/semi-icons-lab';
import { Button, Table, Popconfirm, Space, Modal, Form, Toast, Tag } from '@douyinfe/semi-ui';
import { ColumnProps } from '@douyinfe/semi-ui/lib/es/table';
import { FormApi } from '@douyinfe/semi-ui/lib/es/form';
import { IconPlusCircleStroked } from '@douyinfe/semi-icons';
import Content from '@src/components/page-content';
import {
    articleTagList,
    articleTagCreate,
    articleTagDelete,
    articleTagUpdate,
    articleTagGet,
} from '@src/utils/request';
import { useTable } from '@src/hooks/useTable';
import { useModal } from '@src/hooks/useModal';
import './index.scss';
import { TagModel } from '@src/common/model';
import { useOnMountUnsafe } from '@src/hooks/useOnMountUnsafe';

const Index: React.FC = () => {
    const columns: ColumnProps[] = [
        {
            title: 'ID',
            align: 'center',
            dataIndex: 'tagId',
            width: '10%',
        },
        {
            title: '名称',
            align: 'center',
            dataIndex: 'name',
            render: (text, tag: TagModel) => (
                <Tag
                    style={{ color: tag.color, borderColor: tag.color }}
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
            render: (_text, tag: TagModel) => (
                <Space>
                    <Button
                        theme="borderless"
                        type="primary"
                        size="small"
                        onClick={() => {
                            handleEditTag(tag.tagId);
                            setEditModalTitle('编辑标签');
                        }}
                    >
                        编辑
                    </Button>
                    <Popconfirm
                        position="left"
                        title="确定是否要删除此分标签？"
                        onConfirm={() => handleDeleteTag(tag)}
                    >
                        <Button theme="borderless" type="danger" size="small">
                            删除
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const [data, loading, setData, setLoading] = useTable();
    const [editModalTitle, setEditModalTitle] = useState<string>();
    const [_key, _setKey, editVisible, setEditVisible, _setAddModal] = useModal();
    const [editForm, setEditForm] = useState<FormApi>();
    const [searchForm, setSearchForm] = useState<FormApi>();
    const [editTag, setEditTag] = useState<TagModel | null>();

    // 获取标签
    let getTagList = async () => {
        setLoading(true);

        let search = searchForm?.getValues();
        let res = await articleTagList(search?.name);

        if (res.isSuccess) {
            setData(res.data as any[]);
        }

        setLoading(false);
    };

    useOnMountUnsafe(() => {
        getTagList();
    });

    // 确认编辑/新增标签
    const handleEditModalOk = () => {
        editForm?.validate().then(async ({ name, color }) => {
            var msg = '';
            var res;
            if (editTag) {
                res = await articleTagUpdate(editTag.tagId, name);
                msg = '更新成功';
            } else {
                res = await articleTagCreate(name, '#dd3344');
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

    // 编辑/新增标签
    const handleEditTag = async (tagId?: string) => {
        let tag = null;
        if (tagId) {
            let res = await articleTagGet(tagId);
            if (!res.isSuccess) {
                Toast.error(res.message);
                return;
            }
            tag = res.data as TagModel;
        }

        setEditTag(tag);
        setEditVisible(true);
    };

    // 删除标签
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
                        <Form
                            labelPosition="inset"
                            layout="horizontal"
                            getFormApi={(formData) => setSearchForm(formData)}
                        >
                            <Form.Input
                                field="name"
                                showClear
                                label="名称"
                                style={{ width: 190 }}
                            />
                            <Space spacing="loose" style={{ alignItems: 'flex-end' }}>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    onClick={() => getTagList()}
                                >
                                    查询
                                </Button>

                                <Button
                                    icon={<IconPlusCircleStroked size="small" />}
                                    style={{ marginRight: 10 }}
                                    onClick={() => {
                                        handleEditTag();
                                        setEditModalTitle('新增标签');
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
                    title={editModalTitle}
                    visible={editVisible}
                    onOk={handleEditModalOk}
                    onCancel={() => setEditVisible(false)}
                    centered
                    bodyStyle={{ height: 100 }}
                    okText={'保存'}
                >
                    <Form initValues={editTag} getFormApi={(formData) => setEditForm(formData)}>
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
