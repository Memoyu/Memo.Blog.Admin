import React, { useState } from 'react';
import { IconTag } from '@douyinfe/semi-icons-lab';
import { IconPlusCircleStroked } from '@douyinfe/semi-icons';
import { Button, Table, Popconfirm, Space, Form, Toast } from '@douyinfe/semi-ui';

import Content from '@src/components/page-content';
import EditTag from './components/edit';

import { useOnMountUnsafe } from '@src/hooks/useOnMountUnsafe';
import { useData } from '@src/hooks/useData';

import { TagModel } from '@src/common/model';
import { ColumnProps } from '@douyinfe/semi-ui/lib/es/table';
import { FormApi } from '@douyinfe/semi-ui/lib/es/form';

import { articleTagList, articleTagDelete, articleTagGet } from '@src/utils/request';

import './index.scss';
import RelatedArticles from '../components/related-articles';

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
        },
        {
            title: '关联文章',
            align: 'center',
            dataIndex: 'articles',
            render: (text, category: TagModel) => {
                return (
                    <RelatedArticles type="tag" id={category.tagId}>
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
            render: (_text, tag: TagModel) => (
                <Space>
                    <Button
                        theme="borderless"
                        type="primary"
                        size="small"
                        onClick={() => {
                            handleEditTag(tag.tagId);
                            setEditTitle('编辑标签');
                        }}
                    >
                        编辑
                    </Button>
                    <Popconfirm
                        position="left"
                        title="确定是否要删除此标签？"
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

    const [data, loading, setData, setLoading] = useData<Array<TagModel>>();
    const [editTitle, setEditTitle] = useState<string>('');
    const [editVisible, setEditVisible] = useState<boolean>(false);
    const [searchForm, setSearchForm] = useState<FormApi>();
    const [editTag, setEditTag] = useState<TagModel>();

    // 获取标签
    let getTagList = async () => {
        setLoading(true);

        let search = searchForm?.getValues();
        articleTagList(search?.name)
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
        getTagList();
    });

    // 编辑/新增标签
    const handleEditTag = async (tagId?: string) => {
        let tag;
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
                                    onClick={() => getTagList()}
                                >
                                    查询
                                </Button>

                                <Button
                                    icon={<IconPlusCircleStroked size="small" />}
                                    style={{ marginRight: 10 }}
                                    onClick={() => {
                                        handleEditTag();
                                        setEditTitle('新增标签');
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

                <EditTag
                    title={editTitle}
                    visible={editVisible}
                    tag={editTag}
                    onChangeVisible={setEditVisible}
                    onOk={() => getTagList()}
                />
            </div>
        </Content>
    );
};

export default Index;
