import React, { useRef, useState } from 'react';
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
import { useNavigate } from 'react-router';
import { useParams } from 'react-router-dom';
import { ColumnProps } from '@douyinfe/semi-ui/lib/es/table';
import Content from '@src/components/page-content';
import { roleGet, roleCreate, roleUpdate, permissionGroup } from '@src/utils/request';
import { useTable } from '@src/hooks/useTable';
import {
    PermissionGroupModel,
    PermissionModel,
    RoleEditRequest,
    RoleModel,
    RolePermissionModel,
} from '@src/common/model';
import { useOnMountUnsafe } from '@src/hooks/useOnMountUnsafe';
import { CheckboxProps } from '@douyinfe/semi-ui/lib/es/checkbox';

import './index.scss';

const { Text } = Typography;

interface SelectedPermissionModule {
    module: string;
    permissions: Array<string>;
}

interface RowCheckProps {
    module: string;
    indeterminate: boolean;
    checked: boolean;
}

const Index: React.FC = () => {
    const columns: ColumnProps[] = [
        {
            title: '权限分组',
            dataIndex: 'module',
            render: (_, permission: PermissionModel) => {
                return (
                    <Text ellipsis={{ showTooltip: true }}>
                        {permission.moduleName} - {permission.module}
                    </Text>
                );
            },
        },
    ];

    const navigate = useNavigate();
    const formRef = useRef<Form>(null);
    const [rowCheckProps, setRowCheckProps] = useState<Array<RowCheckProps>>([]);
    const [selectedPermissionModules, setSelectedPermissionModules] = useState<
        Array<SelectedPermissionModule>
    >([]);

    const params = useParams();
    const [roleId, setRoleId] = useState<string>();
    const [role, setRole] = useState<RoleModel>();
    let refPermissionGroups = useRef<Array<PermissionGroupModel>>();
    const [searchPermissionName, setSearchPermissionName] = useState<string>();
    const [
        permissionGroups,
        permissionGroupLoading,
        setPermissionGroups,
        setPermissionGroupLoading,
    ] = useTable();

    // 获取角色信息
    let getRoleDetail = async (roleId: string) => {
        let res = await roleGet(roleId);

        if (!res.isSuccess) {
            Toast.error(res.message);
            return;
        }

        //console.log('role', res);
        var role = res.data;
        setRole(role);

        let formApi = formRef.current?.formApi;
        role &&
            formApi?.setValues({
                ...role,
            });

        initSelectedPermissionModules(role?.permissions ?? []);
    };

    // 初始化选中的权限
    const initSelectedPermissionModules = (permissions: Array<PermissionModel>) => {
        const groups = permissions.reduce((group: any, permission) => {
            const { module } = permission;
            group[module] = group[module] ?? [];
            group[module].push(permission.permissionId.toString());
            return group;
        }, {});

        console.log('groups', groups);
        // console.log('permissionGroups', perGroups.current);
        var selecteds = [];
        for (let key in groups) {
            var current = { module: key, permissions: groups[key] } as SelectedPermissionModule;
            selecteds.push(current);
            var modules = refPermissionGroups.current?.find((s) => s.module == key);
            if (modules) handleCheckboxGroupSelect(current, modules);
        }

        setSelectedPermissionModules(selecteds);
        // console.log(selecteds);
    };

    // 获取权限分组
    let getPermissionGroup = async (name?: string) => {
        setPermissionGroupLoading(true);

        let res = await permissionGroup(name);
        if (res.isSuccess) {
            setPermissionGroups(res.data as any[]);
            refPermissionGroups.current = res.data;
        }

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
            (selectedPermissionModules ?? []).forEach((sp) => {
                var selecteds = sp.permissions ?? [];
                permissions.push(...selecteds);
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
    const handleCheckboxGroupChange = (modules: PermissionGroupModel, selecteds: any[]) => {
        var current = selectedPermissionModules?.find((s) => s.module == modules.module);
        if (current) {
            current.permissions = selecteds;
        } else {
            current = {
                module: modules.module,
                permissions: selecteds,
            };
            selectedPermissionModules.push(current);
        }

        // 需要使用解构赋值，这样才能重新渲染界面
        setSelectedPermissionModules([...selectedPermissionModules]);

        handleCheckboxGroupSelect(current, modules);
    };

    const expandRowRender = (group: PermissionGroupModel, index?: number) => {
        return (
            <CheckboxGroup
                key={group.module}
                style={{ margin: '0px 0px 20px 30px' }}
                options={group.permissions.map((p) => {
                    return { label: p.name, value: p.permissionId.toString() };
                })}
                direction="horizontal"
                value={
                    selectedPermissionModules?.find((s) => s.module == group.module)?.permissions
                }
                onChange={(vals) => handleCheckboxGroupChange(group, vals)}
            />
        );
    };

    const rowSelection = {
        getCheckboxProps: (group?: PermissionGroupModel) => {
            // var def = { indeterminate: false, checked: false } as CheckboxProps;
            // if (!group) return def;
            // var current = rowCheckProps.find((r) => r.module == group.module);
            // if (!current) return def;
            // console.log('group', group);
            var noCheck = group?.permissions.find((rp) => {
                return rp.checked == false;
            });
            var indeterminate = noCheck != undefined;

            return {
                indeterminate: current.indeterminate,
                checked: current.checked,
                //defaultChecked: current.checked,
            } as CheckboxProps;
        },
        onSelect: (group?: PermissionGroupModel, selected?: boolean) => {
            console.log(`select row: ${selected}`, group);
            if (!group) return;

            // 处理当前row内部选中框状态
            handleRowCheckboxChange(selected, group);
        },
        onSelectAll: (selected?: boolean, groups?: Array<PermissionGroupModel>) => {
            // console.log(`select all rows: ${selected}`, groups);
            if (!groups) return;

            // 处理row选中框状态
            setRowCheckProps(
                groups.map((g) => {
                    return {
                        module: g.module,
                        indeterminate: false,
                        checked: selected,
                    } as RowCheckProps;
                })
            );

            // 处理row内部选中框状态
            if (groups?.length > 0) {
                groups?.forEach((group) => {
                    handleRowCheckboxChange(selected, group);
                });
            } else {
                setSelectedPermissionModules([]);
            }
        },
        onChange: (
            selectedRowKeys?: Array<string | number>,
            selectedRows?: Array<PermissionGroupModel>
        ) => {
            // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
    };

    const handleRowCheckboxChange = (selected?: boolean, modules?: PermissionGroupModel) => {
        if (!modules) return;
        var current = selectedPermissionModules?.find((s) => s.module == modules.module);
        if (!current) {
            // 不存在，新建，插入
            current = { module: modules.module, permissions: [] };
            selectedPermissionModules.push(current);
        }

        // 更新选中（全选或全不选）
        if (selected) {
            current.permissions = modules?.permissions.map((p) => p.permissionId.toString()) ?? [];
        } else {
            current.permissions = [];
        }

        // console.log('x', selectedPermissions);
        setSelectedPermissionModules([...selectedPermissionModules]);

        handleCheckboxGroupSelect(current, modules);
    };

    const handleCheckboxGroupSelect = (
        selectedModule: SelectedPermissionModule,
        modules: PermissionGroupModel
    ) => {
        var selecteds = selectedModule.permissions;
        var permissions = modules.permissions;
        // 处理行的选中状态
        var rowProps = rowCheckProps.find((r) => r.module == selectedModule.module);
        if (!rowProps) {
            rowProps = { module: selectedModule.module } as RowCheckProps;
            rowCheckProps.push(rowProps);
        }

        if (selecteds.length == 0) {
            rowProps.indeterminate = false;
            rowProps.checked = false;
        } else if (selecteds.length < permissions.length) {
            rowProps.indeterminate = true;
            rowProps.checked = false;
        } else if (selecteds.length == permissions.length) {
            rowProps.indeterminate = false;
            rowProps.checked = true;
        }
        setRowCheckProps([...rowCheckProps]);

        console.log('rowCheckProps', JSON.stringify(rowCheckProps));
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
                                    onChange={(val) => setSearchPermissionName(val)}
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
