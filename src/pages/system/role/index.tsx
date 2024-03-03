import React, { useEffect, useState } from 'react';
import { Button, Table, Space, Modal, Form, Toast } from '@douyinfe/semi-ui';
import { ColumnProps } from '@douyinfe/semi-ui/lib/es/table';
import { FormApi } from '@douyinfe/semi-ui/lib/es/form';
import { IconPlusCircleStroked } from '@douyinfe/semi-icons';
import Content from '@src/components/page-content';
import { roleList, roleCreate, roleDelete, roleUpdate } from '@src/utils/request';
import { useTable } from '@src/hooks/useTable';
import { useModal } from '@src/hooks/useModal';
import './index.scss';
import { RoleModel } from '@src/common/model';

const Index: React.FC = () => {
    const columns: ColumnProps[] = [
        {
            title: '序号',
            align: 'center',
            dataIndex: 'userId',
        },
        {
            title: '名称',
            align: 'center',
            dataIndex: 'name',
        },
        {
            title: '描述',
            align: 'center',
            dataIndex: 'name',
        },
        {
            title: '操作',
            align: 'center',
            render: (_text, record: RoleModel) => {
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
    const [saveRoleForm, setSaveRoleForm] = useState<FormApi>();
    const [editRole, setEditRole] = useState<RoleModel | null>();

    let getUserList = async () => {
        roleList()
            .then((res) => {
                if (res.isSuccess) {
                    setData(res.data as any[]);
                }
            })
            .finally(() => setLoading(false));
    };

    // 使用 useEffect 来异步获取表格数据
    useEffect(() => {
        getUserList();
    }, []);

    const handleEditModalOk = () => {
        saveRoleForm?.validate().then(async ({ name }) => {
            var msg = '';
            var res;
            if (editRole) {
                res = await roleUpdate(editRole.roleId, name);
                msg = '更新成功';
            } else {
                res = await roleCreate(name);
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

    const handleEditUser = (data: RoleModel) => {
        setEditRole(data);
        setEditVisible(true);
    };

    const handleDeleteUser = (data: RoleModel) => {
        roleDelete(data.roleId).then((res) => {
            if (!res.isSuccess) {
                Toast.error(res.message);
                return;
            }
            Toast.success('删除成功');
            getUserList();
        });
    };

    return (
        <Content title="🛖 角色管理">
            <div className="role-container">
                <div className="role-list">
                    <div className="role-list-bar">
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
                    <div className="role-list-table">
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
                    title="添加角色"
                    visible={editVisible}
                    onOk={handleEditModalOk}
                    onCancel={() => setEditVisible(false)}
                    centered
                    bodyStyle={{ height: 120 }}
                    okText={'保存'}
                >
                    <Form
                        initValues={editRole}
                        getFormApi={(formData) => setSaveRoleForm(formData)}
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
