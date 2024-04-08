import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router-dom';
import { IconToast } from '@douyinfe/semi-icons-lab';
import {
    Button,
    Table,
    CheckboxGroup,
    Space,
    Form,
    Toast,
    Typography,
    Input,
    Collapse,
} from '@douyinfe/semi-ui';

import Content from '@src/components/page-content';

import { useOnMountUnsafe } from '@src/hooks/useOnMountUnsafe';
import { useTable } from '@src/hooks/useTable';

import { ColumnProps } from '@douyinfe/semi-ui/lib/es/table';
import { CheckboxProps } from '@douyinfe/semi-ui/lib/es/checkbox';
import {
    PermissionGroupModel,
    PermissionModel,
    RoleEditRequest,
    RoleModel,
} from '@src/common/model';

import { roleGet, roleCreate, roleUpdate, permissionGroup } from '@src/utils/request';

import './index.scss';

const { Text } = Typography;

const Index: React.FC = () => {
    const columns: ColumnProps[] = [
        {
            title: '权限分组',
            dataIndex: 'module',
            render: (_, permission: PermissionGroupModel) => {
                return (
                    <Text strong ellipsis={{ showTooltip: true }}>
                        {permission.moduleName} - {permission.module}
                    </Text>
                );
            },
        },
    ];

    const navigate = useNavigate();
    const formRef = useRef<Form>(null);
    const [selectedRowKeys, setSelectedRowKeys] = useState<Array<string>>([]);
    const params = useParams();
    const [roleId, setRoleId] = useState<string>();
    const [role, setRole] = useState<RoleModel>();
    const refSelectedPermissions = useRef<Array<PermissionModel>>();

    const [searchPermissionName, setSearchPermissionName] = useState<string>();
    const [
        permissionGroups,
        permissionGroupLoading,
        setPermissionGroups,
        setPermissionGroupLoading,
    ] = useTable();
    let refpermissionModules = useRef<Array<PermissionGroupModel>>();

    // 获取角色信息
    let getRoleDetail = async (roleId: string) => {
        let res = await roleGet(roleId);

        if (!res.isSuccess || res.data == undefined) {
            Toast.error(res.message);
            return;
        }

        //console.log('role', res);
        var role = res.data;
        setRole(role);
        refSelectedPermissions.current = role.permissions;
        let formApi = formRef.current?.formApi;
        role &&
            formApi?.setValues({
                ...role,
            });

        initSelectedPermissionModules();
    };

    // 初始化选中的权限
    const initSelectedPermissionModules = () => {
        handleRowCheckboxChanges();
    };

    // 获取权限分组
    let getPermissionGroup = async (name?: string) => {
        setPermissionGroupLoading(true);

        let res = await permissionGroup(name);
        if (res.isSuccess) {
            var modules = res.data ?? [];
            refpermissionModules.current = modules;
            setPermissionGroups(modules);
        }
        handleRowCheckboxChanges();
        setPermissionGroupLoading(false);
    };

    useOnMountUnsafe(() => {
        getPermissionGroup();

        var roleId = params.id;
        if (roleId) {
            setRoleId(roleId);
            getRoleDetail(roleId);
        }
    });

    // 新增/编辑评论
    const handleSaveRole = () => {
        let formApi = formRef.current?.formApi;
        formApi?.validate().then(async (form) => {
            var permissions = [] as Array<string>;
            (refSelectedPermissions.current ?? []).map((sp) => {
                permissions.push(sp.permissionId);
            });

            let role = { permissions, ...form } as RoleEditRequest;

            var msg = '';
            var res;
            if (roleId) {
                role.roleId = roleId;
                res = await roleUpdate(role);
                msg = '更新角色';
            } else {
                res = await roleCreate(role);
                msg = '添加角色';
            }

            if (!res.isSuccess) {
                Toast.error(res.message);
                return;
            }

            Toast.success(msg + '成功');

            navigate('/system/role');
        });
    };

    // 权限组选中事件
    const handleCheckboxGroupChange = (module: PermissionGroupModel, selecteds: any[]) => {
        // console.log(`handleCheckboxGroupChange`, selecteds, module);
        handleSelectedPermissionChanges(module, (p: PermissionModel) => {
            let permissionId = selecteds?.find((id: any) => id == p.permissionId);
            return permissionId != undefined;
        });
    };

    // 行展开后渲染的内容
    const expandRowRender = (module: PermissionGroupModel) => {
        return (
            <CheckboxGroup
                key={module.module}
                style={{ margin: '0px 0px 20px 30px' }}
                options={module.permissions.map((p) => {
                    return { label: p.name, value: p.permissionId };
                })}
                direction="horizontal"
                value={module.permissions.filter((mp) => mp.checked)?.map((mp) => mp.permissionId)}
                onChange={(vals) => handleCheckboxGroupChange(module, vals)}
            />
        );
    };

    // 行行为属性配置
    const rowSelection = {
        selectedRowKeys: selectedRowKeys,
        getCheckboxProps: (module?: PermissionGroupModel) => {
            var props = {
                indeterminate: false,
                checked: false,
            } as CheckboxProps;
            if (!module) return props;

            var checkeds =
                module.permissions.filter((rp) => {
                    return rp.checked;
                }) ?? [];

            if (checkeds.length == 0) {
                props.indeterminate = false;
                props.checked = false;
            } else if (checkeds.length < module.permissions.length) {
                props.indeterminate = true;
                props.checked = false;
            } else if (checkeds.length == module.permissions.length) {
                props.indeterminate = false;
                props.checked = true;
            }

            // console.log('props' + group.module, props);
            return props;
        },
        onSelect: (module?: PermissionGroupModel, selected?: boolean) => {
            // console.log(`select row: ${selected}`, module);
            if (!module) return;

            handleSelectedPermissionChanges(module, () =>
                selected == undefined ? false : selected
            );
        },
        onSelectAll: (
            selected?: boolean,
            selectedRows?: Array<PermissionGroupModel>,
            changedRows?: Array<PermissionGroupModel>
        ) => {
            // console.log(`select all rows: ${selected}`, groups);
            // console.log(`select all rows: ${selected}`, selectedRows, changedRows);

            if (changedRows == undefined) return;

            // 选中时，才需要全部添加，否则清空
            var targets: Array<PermissionGroupModel> = [];
            if ((selectedRows ?? [])?.length > 0) targets = selectedRows ?? [];
            else targets = changedRows ?? [];

            targets.forEach((mg: PermissionGroupModel) => {
                handleSelectedPermissionChanges(mg, () =>
                    selected == undefined ? false : selected
                );
            });
        },
    };

    // 触发选中变更，对选中/取消的权限在选择数组中进行增删
    const handleSelectedPermissionChanges = (
        module: PermissionGroupModel,
        getSelected: (permission: PermissionModel) => boolean
    ) => {
        var selectedPermissions: Array<PermissionModel> = refSelectedPermissions.current ?? [];
        //console.log(`handleSelectedPermissionChanges`, selectedPermissions);
        module.permissions.map((mp) => {
            let index = selectedPermissions.findIndex((p) => p.permissionId == mp.permissionId);
            let checked = getSelected(mp);
            if (checked) {
                if (index < 0) selectedPermissions.push(mp);
            } else {
                if (index > -1) selectedPermissions.splice(index, 1);
            }
        });

        refSelectedPermissions.current = selectedPermissions;
        handleRowCheckboxChanges();
    };

    // 触发Table列表checkbox状态变更，进行权限数据的选中数据配置
    const handleRowCheckboxChanges = () => {
        var selectedKeys: Array<string> = selectedRowKeys;
        var selectedPermissions = refSelectedPermissions.current ?? [];
        var permissionModules = refpermissionModules.current ?? [];

        // console.log('permissionGroups', permissionModules);

        // 处理权限列表的选项选中状态
        permissionModules.map((pg: PermissionGroupModel) => {
            var groupCheckeds: Array<string> = [];
            pg.permissions.map((mp) => {
                let spIndex = selectedPermissions.findIndex(
                    (p) => p.permissionId == mp.permissionId
                );
                mp.checked = spIndex > -1;
                if (mp.checked) groupCheckeds.push(mp.permissionId);
            });

            // 处理行选中状态
            var selectedRowKeyIndex = selectedRowKeys.findIndex((k) => k == pg.module);
            if (groupCheckeds.length == 0 || groupCheckeds.length < pg.permissions.length) {
                if (selectedRowKeyIndex > -1) {
                    selectedRowKeys.splice(selectedRowKeyIndex, 1);
                }
            } else if (groupCheckeds.length == pg.permissions.length) {
                if (selectedRowKeyIndex < 0) {
                    selectedKeys.push(pg.module);
                }
            }
        });

        // console.log('selectedKeys', selectedKeys);
        setSelectedRowKeys(selectedKeys);
        setPermissionGroups([...permissionModules]);
    };

    return (
        <Content title="编辑角色" icon={<IconToast />}>
            <div className="role-edit-container">
                <Form
                    ref={formRef}
                    initValues={role}
                    labelPosition="left"
                    labelAlign="left"
                    labelWidth={60}
                >
                    <Form.Input
                        field="name"
                        label="名称"
                        rules={[{ required: true, message: '角色名称' }]}
                    />
                    <Form.TextArea
                        field="description"
                        label="描述"
                        rules={[{ required: true, message: '角色描述必填' }]}
                    />
                    <Collapse defaultActiveKey={'table'}>
                        <Collapse.Panel
                            header={
                                <Text style={{ fontSize: 17 }} strong>
                                    选择权限
                                </Text>
                            }
                            itemKey="table"
                        >
                            <Space spacing="loose" style={{ marginBottom: 10 }}>
                                <Input
                                    prefix="权限名"
                                    showClear
                                    onChange={(val) => setSearchPermissionName(val)}
                                    onEnterPress={() => getPermissionGroup(searchPermissionName)}
                                ></Input>
                                <Button
                                    type="primary"
                                    onClick={() => getPermissionGroup(searchPermissionName)}
                                >
                                    查询
                                </Button>
                            </Space>
                            <Table
                                expandRowByClick
                                rowKey="module"
                                expandAllRows={true}
                                columns={columns}
                                loading={permissionGroupLoading}
                                dataSource={permissionGroups}
                                expandedRowRender={expandRowRender}
                                rowSelection={rowSelection}
                                pagination={false}
                            />
                        </Collapse.Panel>
                    </Collapse>

                    <Space style={{ margin: 20, width: '100%' }}>
                        <Button
                            type="primary"
                            theme="solid"
                            style={{ width: 120, marginRight: 4 }}
                            onClick={() => handleSaveRole()}
                        >
                            保存
                        </Button>
                    </Space>
                </Form>
            </div>
        </Content>
    );
};

export default Index;
