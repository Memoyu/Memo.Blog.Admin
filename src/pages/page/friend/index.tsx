import React, { useEffect, useState } from 'react';
import { Button, Table, Space, Modal, Form, Toast } from '@douyinfe/semi-ui';
import { ColumnProps } from '@douyinfe/semi-ui/lib/es/table';
import { FormApi } from '@douyinfe/semi-ui/lib/es/form';
import { IconPlusCircleStroked } from '@douyinfe/semi-icons';
import Content from '@src/components/page-content';
import { friendList, friendCreate, friendDelete, friendUpdate } from '@src/utils/request';
import { useTable } from '@src/hooks/useTable';
import { useModal } from '@src/hooks/useModal';
import './index.scss';
import { FriendModel } from '@src/common/model';

const Index: React.FC = () => {
    const columns: ColumnProps[] = [
        {
            title: '序号',
            align: 'center',
            dataIndex: 'friendId',
            width: '10%',
        },
        {
            title: '昵称',
            align: 'center',
            dataIndex: 'name',
        },
        {
            title: '描述',
            align: 'center',
            dataIndex: 'name',
        },
        {
            title: '站点',
            align: 'center',
            dataIndex: 'name',
        },
        {
            title: '浏览次数',
            align: 'center',
            dataIndex: 'name',
        },
        {
            title: '是否公开',
            align: 'center',
            dataIndex: 'name',
            render: (text, record: FriendModel) => <></>,
        },
        {
            title: '操作',
            align: 'center',
            width: '15%',
            render: (_text, record: FriendModel) => {
                return (
                    <Space>
                        <Button
                            theme="borderless"
                            type="primary"
                            size="small"
                            onClick={() => handleEditFriend(record)}
                        >
                            编辑
                        </Button>
                        <Button
                            theme="borderless"
                            type="danger"
                            size="small"
                            onClick={() => handleDeleteFriend(record)}
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
    const [saveFriendForm, setSaveFriendForm] = useState<FormApi>();
    const [editFriend, setEditFriend] = useState<FriendModel | null>();

    let getFriendList = async () => {
        friendList()
            .then((res) => {
                if (res.isSuccess) {
                    setData(res.data as any[]);
                }
            })
            .finally(() => setLoading(false));
    };

    // 使用 useEffect 来异步获取表格数据
    useEffect(() => {
        getFriendList();
    }, []);

    const handleEditModalOk = () => {
        saveFriendForm?.validate().then(async ({ name }) => {
            var msg = '';
            var res;
            if (editFriend) {
                res = await friendUpdate(editFriend.friendId, name);
                msg = '更新成功';
            } else {
                res = await friendCreate(name);
                msg = '添加成功';
            }

            if (!res.isSuccess) {
                Toast.error(res.message);
                return;
            }
            setEditVisible(false);
            Toast.success(msg);
            getFriendList();
        });
    };

    const handleEditFriend = (data: FriendModel) => {
        setEditFriend(data);
        setEditVisible(true);
    };

    const handleDeleteFriend = (data: FriendModel) => {
        friendDelete(data.friendId).then((res) => {
            if (!res.isSuccess) {
                Toast.error(res.message);
                return;
            }
            Toast.success('删除成功');
            getFriendList();
        });
    };

    return (
        <Content title="🛖 友链管理">
            <div className="friend-container">
                <div className="friend-list">
                    <div className="friend-list-bar">
                        <Form layout="horizontal" onValueChange={(values) => console.log(values)}>
                            <Form.Input field="UserName" label="昵称" style={{ width: 190 }} />
                            <Form.Input field="UserName" label="站点" style={{ width: 190 }} />
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
                    <div className="friend-list-table">
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
                    title="添加友链"
                    visible={editVisible}
                    onOk={handleEditModalOk}
                    onCancel={() => setEditVisible(false)}
                    centered
                    bodyStyle={{ height: 120 }}
                    okText={'保存'}
                >
                    <Form
                        initValues={editFriend}
                        getFormApi={(formData) => setSaveFriendForm(formData)}
                    >
                        <Form.Input
                            field="name"
                            placeholder="友链昵称不超10个字符"
                            label="友链昵称"
                            rules={[
                                { required: true, message: '友链昵称必填' },
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
