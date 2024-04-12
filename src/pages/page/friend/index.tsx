import React, { useEffect, useState } from 'react';
import { IconSpin } from '@douyinfe/semi-icons-lab';
import { IconPlusCircleStroked } from '@douyinfe/semi-icons';
import {
    Button,
    Table,
    Space,
    Avatar,
    Badge,
    Typography,
    Modal,
    Popconfirm,
    Form,
    Toast,
} from '@douyinfe/semi-ui';

import Content from '@src/components/page-content';

import { useOnMountUnsafe } from '@src/hooks/useOnMountUnsafe';
import { useData } from '@src/hooks/useData';
import { useModal } from '@src/hooks/useModal';

import { ColumnProps } from '@douyinfe/semi-ui/lib/es/table';
import { FormApi } from '@douyinfe/semi-ui/lib/es/form';
import { FriendEditRequest, FriendModel, FriendPageRequest } from '@src/common/model';

import {
    friendPage,
    friendCreate,
    friendDelete,
    friendUpdate,
    friendGet,
} from '@src/utils/request';

import './index.scss';

const { Text } = Typography;

const Index: React.FC = () => {
    const columns: ColumnProps[] = [
        {
            title: 'ID',
            align: 'center',
            dataIndex: 'friendId',
            width: 160,
        },
        {
            title: '头像',
            align: 'center',
            dataIndex: 'avatar',
            width: 70,
            render: (text) => {
                return <Avatar alt="cute cat" size="small" src={text} />;
            },
        },
        {
            title: '昵称',
            align: 'center',
            dataIndex: 'nickname',
            width: 100,
            ellipsis: { showTitle: false },
            render: (text) => {
                return <Text ellipsis={{ showTooltip: true }}>{text}</Text>;
            },
        },
        {
            title: '描述',
            align: 'center',
            dataIndex: 'description',
            width: 170,
            ellipsis: { showTitle: false },
            render: (text) => {
                return <Text ellipsis={{ showTooltip: true }}>{text}</Text>;
            },
        },
        {
            title: '站点',
            align: 'center',
            dataIndex: 'site',
            width: 170,
            ellipsis: { showTitle: false },
            render: (text) => {
                return <Text ellipsis={{ showTooltip: true }}>{text}</Text>;
            },
        },
        {
            title: '浏览次数',
            align: 'center',
            dataIndex: 'views',
            width: 90,
        },
        {
            title: '公开',
            align: 'center',
            width: 60,
            render: (_, comment: FriendModel) =>
                comment.showable ? <Badge dot type="success" /> : <Badge dot type="danger" />,
        },
        {
            title: '操作',
            align: 'center',
            width: 150,
            render: (_text, friend: FriendModel) => {
                return (
                    <Space>
                        <Button
                            theme="borderless"
                            type="primary"
                            size="small"
                            onClick={() => {
                                handleEditFriend(friend.friendId);
                                setEditModalTitle('编辑友链');
                            }}
                        >
                            编辑
                        </Button>

                        <Popconfirm
                            position="left"
                            title="确定是否要删除此友链？"
                            onConfirm={() => handleDeleteFriend(friend)}
                        >
                            <Button theme="borderless" type="danger" size="small">
                                删除
                            </Button>
                        </Popconfirm>
                    </Space>
                );
            },
        },
    ];

    const pageSize = 15;
    const [currentPage, setCurrentPage] = useState(1);
    const [commentTotal, setCommentTotal] = useState(1);
    const [data, loading, setData, setLoading] = useData<Array<FriendModel>>();
    const [editModalTitle, setEditModalTitle] = useState<string>();
    const [_key, _setKey, editVisible, setEditVisible, _setAddModal] = useModal();
    const [editForm, setEditForm] = useState<FormApi>();
    const [searchForm, setSearchForm] = useState<FormApi>();
    const [editFriend, setEditFriend] = useState<FriendModel>();

    // 获取友链分页
    let getFriendPage = async (page: number = 1) => {
        setLoading(true);
        setCurrentPage(page);

        let search = searchForm?.getValues();
        let request = { ...search, page, size: pageSize } as FriendPageRequest;
        friendPage(request)
            .then((res) => {
                if (!res.isSuccess || !res.data) {
                    Toast.error(res.message);
                    return;
                }

                setData(res.data.items);
                setCommentTotal(res.data.total || 0);
            })
            .finally(() => setLoading(false));
    };

    useOnMountUnsafe(() => {
        getFriendPage();
    });

    // 页数变更
    const handlePageChange = (page: number) => {
        getFriendPage(page);
    };

    // 保存编辑/新增友链
    const handleEditModalOk = () => {
        editForm?.validate().then(async (form) => {
            let friend = {
                ...form,
            } as FriendEditRequest;

            var msg = '';
            var res;
            if (editFriend) {
                res = await friendUpdate(friend);
                msg = '更新成功';
            } else {
                res = await friendCreate(friend);
                msg = '添加成功';
            }

            if (!res.isSuccess) {
                Toast.error(res.message);
                return;
            }
            setEditVisible(false);
            Toast.success(msg);
            getFriendPage();
        });
    };

    // 编辑/新增友链
    const handleEditFriend = async (friendId?: string) => {
        let friend = { showable: true } as FriendModel;
        if (friendId) {
            let res = await friendGet(friendId);
            if (!res.isSuccess) {
                Toast.error(res.message);
                return;
            }
            friend = res.data as FriendModel;
        }

        setEditFriend(friend);
        setEditVisible(true);
    };

    // 删除友链
    const handleDeleteFriend = async (data: FriendModel) => {
        let res = await friendDelete(data.friendId);
        if (!res.isSuccess) {
            Toast.error(res.message);
            return;
        }

        Toast.success('删除成功');
        getFriendPage();
    };

    return (
        <Content title="友链管理" icon={<IconSpin />}>
            <div className="friend-container">
                <div className="friend-list">
                    <div className="friend-list-bar">
                        <Form
                            layout="horizontal"
                            getFormApi={(formData) => setSearchForm(formData)}
                        >
                            <Form.Input field="nickname" showClear label="昵称" />
                            <Form.Input field="description" showClear label="描述" />
                            <Form.Input field="site" showClear label="站点" />
                            <Space
                                spacing="loose"
                                style={{ alignItems: 'flex-end', marginTop: 10 }}
                            >
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    onClick={() => getFriendPage(1)}
                                >
                                    查询
                                </Button>

                                <Button htmlType="reset">重置</Button>

                                <Button
                                    icon={<IconPlusCircleStroked size="small" />}
                                    style={{ marginRight: 10 }}
                                    onClick={() => {
                                        handleEditFriend();
                                        setEditModalTitle('新增友链');
                                    }}
                                >
                                    新增
                                </Button>
                            </Space>
                        </Form>
                    </div>
                    <div className="friend-list-table">
                        <Table
                            showHeader={true}
                            loading={loading}
                            size="small"
                            columns={columns}
                            dataSource={data}
                            pagination={{
                                currentPage,
                                pageSize: pageSize,
                                total: commentTotal,
                                onPageChange: handlePageChange,
                            }}
                        />
                    </div>
                </div>
                <Modal
                    title={editModalTitle}
                    visible={editVisible}
                    onOk={handleEditModalOk}
                    onCancel={() => setEditVisible(false)}
                    centered
                    bodyStyle={{ height: 350 }}
                    okText={'保存'}
                >
                    <Form
                        labelPosition="left"
                        labelAlign="left"
                        labelWidth={60}
                        initValues={editFriend}
                        getFormApi={(formData) => setEditForm(formData)}
                    >
                        <Form.Input
                            field="nickname"
                            placeholder="友链昵称不超20个字符"
                            label="昵称"
                            rules={[
                                { required: true, message: '友链昵称必填' },
                                { max: 20, message: '长度不能超20个字符' },
                            ]}
                        />
                        <Form.Input field="avatar" label="头像" />
                        <Form.Input
                            field="site"
                            label="站点"
                            rules={[{ required: true, message: '友链站点必填' }]}
                        />
                        <Form.TextArea
                            field="description"
                            label="描述"
                            rules={[{ required: true, message: '友链描述必填' }]}
                        />
                        <Form.Switch field="showable" label={{ text: '公开' }} aria-label="公开" />
                    </Form>
                </Modal>
            </div>
        </Content>
    );
};

export default Index;
