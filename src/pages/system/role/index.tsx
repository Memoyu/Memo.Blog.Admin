import React, { useEffect, useState } from 'react';
import { IconToast } from '@douyinfe/semi-icons-lab';
import {
    Button,
    Table,
    CheckboxGroup,
    Space,
    Modal,
    Popconfirm,
    Form,
    Toast,
} from '@douyinfe/semi-ui';
import { ColumnProps } from '@douyinfe/semi-ui/lib/es/table';
import { FormApi } from '@douyinfe/semi-ui/lib/es/form';
import { IconPlusCircleStroked } from '@douyinfe/semi-icons';
import Content from '@src/components/page-content';
import { roleList, roleCreate, roleDelete, roleUpdate, permissionGroup } from '@src/utils/request';
import { useTable } from '@src/hooks/useTable';
import { useModal } from '@src/hooks/useModal';
import './index.scss';
import { PermissionGroupModel, PermissionModel, RoleModel } from '@src/common/model';
import Label from '@douyinfe/semi-ui/lib/es/form/label';

const Index: React.FC = () => {
    const columns: ColumnProps[] = [
        {
            title: 'ID',
            align: 'center',
            dataIndex: 'userId',
        },
        {
            title: '角色名',
            align: 'center',
            dataIndex: 'name',
        },
        {
            title: '描述',
            align: 'center',
            dataIndex: 'description',
        },
        {
            title: '类型',
            align: 'center',
            dataIndex: 'type',
        },
        {
            title: '操作',
            align: 'center',
            render: (_text, role: RoleModel) => {
                return (
                    <Space>
                        <Button
                            theme="borderless"
                            type="primary"
                            size="small"
                            onClick={() => {
                                handleEditUser(role);
                                setEditModalTitle('编辑角色');
                            }}
                        >
                            编辑
                        </Button>
                        <Popconfirm
                            position="left"
                            title="确定是否要删除此分标签？"
                            onConfirm={() => handleDeleteUser(role)}
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

    const permissionColumns: ColumnProps[] = [
        {
            title: '权限分组',
            dataIndex: 'module',
        },
        {
            title: '分组名称',
            align: 'center',
            dataIndex: 'moduleName',
        },
    ];

    const [searchForm, setSearchForm] = useState<FormApi>();
    const [data, loading, setData, setLoading] = useTable();
    const [permissionData, permissionLoading, setPermissionData, setPermissionLoading] = useTable();
    const [editModalTitle, setEditModalTitle] = useState<string>();
    const [modalSearchForm, setModalSearchForm] = useState<FormApi>();
    const [_key, _setKey, editVisible, setEditVisible, _setAddModal] = useModal();
    const [editForm, setEditForm] = useState<FormApi>();
    const [editRole, setEditRole] = useState<RoleModel | null>();

    // 获取角色列表
    let getRoleList = async () => {
        setLoading(true);

        let search = searchForm?.getValues();
        let res = await roleList(search?.name);
        if (res.isSuccess) {
            setData(res.data as any[]);
        }

        setLoading(false);
    };

    // 获取权限分组
    let getPermissionGroup = async () => {
        let search = modalSearchForm?.getValues();
        let res = await permissionGroup(search?.name);
        if (res.isSuccess) {
            setPermissionData(res.data as any[]);
        }
    };

    // 使用 useEffect 来异步获取表格数据
    useEffect(() => {
        getRoleList();
    }, []);

    const handleEditModalOk = () => {
        editForm?.validate().then(async ({ name }) => {
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
            getRoleList();
        });
    };

    const handleEditUser = (data: RoleModel) => {
        setEditRole(data);
        setEditVisible(true);
    };

    const handleDeleteUser = async (data: RoleModel) => {
        let res = await roleDelete(data.roleId);
        if (!res.isSuccess) {
            Toast.error(res.message);
            return;
        }
        Toast.success('删除成功');
        getRoleList();
    };
    const expandRowRender = (group: PermissionGroupModel, index?: number) => {
        return (
            <CheckboxGroup
                key={group.module}
                style={{ margin: '0px 30px' }}
                options={group.permissions.map((g) => g.name)}
                direction="horizontal"
                // value={checkedList}
                // onChange={onChange}
            />
        );
    };

    const rowSelection = {
        getCheckboxProps: (permission?: PermissionModel) => ({
            disabled: permission?.name === '设计文档', // Column configuration not to be checked
            name: permission?.name,
        }),
        onSelect: (permission?: PermissionModel, selected?: boolean) => {
            console.log(`select row: ${selected}`, permission);
        },
        onSelectAll: (selected?: boolean, selectedRows?: Array<PermissionModel>) => {
            console.log(`select all rows: ${selected}`, selectedRows);
        },
        onChange: (
            selectedRowKeys?: Array<string | number>,
            selectedRows?: Array<PermissionModel>
        ) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
    };
    return (
        <Content title="角色管理" icon={<IconToast />}>
            <div className="role-container">
                <div className="role-list">
                    <div className="role-list-bar">
                        <Form
                            layout="horizontal"
                            labelPosition="inset"
                            getFormApi={(formData) => setSearchForm(formData)}
                        >
                            <Form.Input field="name" showClear label="角色名" />
                            <Space spacing="loose" style={{ alignItems: 'flex-end' }}>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    onClick={() => getRoleList()}
                                >
                                    查询
                                </Button>

                                <Button
                                    icon={<IconPlusCircleStroked size="small" />}
                                    style={{ marginRight: 10 }}
                                    onClick={() => {
                                        setEditModalTitle('新增角色');
                                        setEditVisible(true);
                                        getPermissionGroup();
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
                    title={editModalTitle}
                    visible={editVisible}
                    onOk={handleEditModalOk}
                    onCancel={() => setEditVisible(false)}
                    centered
                    bodyStyle={{ height: 500 }}
                    style={{ width: 700 }}
                    okText={'保存'}
                >
                    <Form
                        initValues={editForm}
                        labelPosition="left"
                        labelAlign="left"
                        labelWidth={60}
                        getFormApi={(formData) => setEditForm(formData)}
                    >
                        <Form.Input
                            field="nickname"
                            label="名称"
                            rules={[{ required: true, message: '角色名称' }]}
                        />
                        <Form.TextArea
                            field="description"
                            label="描述"
                            rules={[{ required: true, message: '角色描述必填' }]}
                        />
                        <Form.Section text={'添加权限'}>
                            <Table
                                rowKey="module"
                                scroll={{ y: 250 }}
                                columns={permissionColumns}
                                loading={permissionLoading}
                                dataSource={permissionData}
                                expandedRowRender={expandRowRender}
                                rowSelection={rowSelection}
                                pagination={false}
                            />
                        </Form.Section>
                    </Form>
                </Modal>
            </div>
        </Content>
    );
};

export default Index;
