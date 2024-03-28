import React, { useEffect, useState } from 'react';
import { IconAvatar } from '@douyinfe/semi-icons-lab';
import { Button, Table, Space, Modal, Form, Toast } from '@douyinfe/semi-ui';
import { ColumnProps } from '@douyinfe/semi-ui/lib/es/table';
import { FormApi } from '@douyinfe/semi-ui/lib/es/form';
import { IconPlusCircleStroked } from '@douyinfe/semi-icons';
import Content from '@src/components/page-content';
import { userList, userCreate, userDelete, userUpdate } from '@src/utils/request';
import { useTable } from '@src/hooks/useTable';
import { useModal } from '@src/hooks/useModal';
import './index.scss';
import { UserModel } from '@src/common/model';
import { useOnMountUnsafe } from '@src/hooks/useOnMountUnsafe';

const Index: React.FC = () => {
    const columns: ColumnProps[] = [
        {
            title: 'ID',
            align: 'center',
            dataIndex: 'userId',
        },
        {
            title: '头像',
            align: 'center',
            dataIndex: 'name',
        },
        {
            title: '昵称',
            align: 'center',
            dataIndex: 'name',
        },
        {
            title: '用户名',
            align: 'center',
            dataIndex: 'name',
        },
        {
            title: '邮箱',
            align: 'center',
            dataIndex: 'name',
        },
        {
            title: '手机号码',
            align: 'center',
            dataIndex: 'name',
        },
        {
            title: '上次登录时间',
            align: 'center',
            dataIndex: 'name',
        },
        {
            title: '操作',
            align: 'center',
            render: (_text, record: UserModel) => {
                return (
                    <Space>
                        <Button
                            theme="borderless"
                            type="primary"
                            size="small"
                            onClick={() => handleEditUser(record)}
                        >
                            编辑
                        </Button>
                        <Button
                            theme="borderless"
                            type="danger"
                            size="small"
                            onClick={() => handleDeleteUser(record)}
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
    const [saveUserForm, setSaveUserForm] = useState<FormApi>();
    const [editUser, setEditUser] = useState<UserModel | null>();

    let getUserList = async () => {
        userList()
            .then((res) => {
                if (res.isSuccess) {
                    setData(res.data as any[]);
                }
            })
            .finally(() => setLoading(false));
    };

    useOnMountUnsafe(() => {
        getUserList();
    });

    const handleEditModalOk = () => {
        saveUserForm?.validate().then(async ({ name }) => {
            var msg = '';
            var res;
            if (editUser) {
                res = await userUpdate(editUser.userId, name);
                msg = '更新成功';
            } else {
                res = await userCreate(name);
                msg = '添加成功';
            }

            if (!res.isSuccess) {
                Toast.error(res.message);
                return;
            }
            setEditVisible(false);
            Toast.success(msg);
            getUserList();
        });
    };

    const handleEditUser = (data: UserModel) => {
        setEditUser(data);
        setEditVisible(true);
    };

    const handleDeleteUser = (data: UserModel) => {
        userDelete(data.userId).then((res) => {
            if (!res.isSuccess) {
                Toast.error(res.message);
                return;
            }
            Toast.success('删除成功');
            getUserList();
        });
    };

    return (
        <Content title="用户管理" icon={<IconAvatar />}>
            <div className="user-container">
                <div className="user-list">
                    <div className="user-list-bar">
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
                    <div className="user-list-table">
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
                    title="添加用户"
                    visible={editVisible}
                    onOk={handleEditModalOk}
                    onCancel={() => setEditVisible(false)}
                    centered
                    bodyStyle={{ height: 120 }}
                    okText={'保存'}
                >
                    <Form
                        initValues={editUser}
                        getFormApi={(formData) => setSaveUserForm(formData)}
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
