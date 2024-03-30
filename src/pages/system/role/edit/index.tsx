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
} from '@src/common/model';
import { useOnMountUnsafe } from '@src/hooks/useOnMountUnsafe';
import { CheckboxProps } from '@douyinfe/semi-ui/lib/es/checkbox';

import './index.scss';

const { Text } = Typography;

interface SelectedPermissionModule {
    module: string;
    permissions: Array<string>;
}

const Index: React.FC = () => {
    const columns: ColumnProps[] = [
        {
            title: '权限分组',
            dataIndex: 'module',
            render: (_, permission: PermissionGroupModel) => {
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
    const [selectedRowKeys, setSelectedRowKeys] = useState<Array<string>>([]);
    const params = useParams();
    const [roleId, setRoleId] = useState<string>();
    const [role, setRole] = useState<RoleModel>();

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
        let formApi = formRef.current?.formApi;
        role &&
            formApi?.setValues({
                ...role,
            });

        initSelectedPermissionModules(role);
    };

    // 初始化选中的权限
    const initSelectedPermissionModules = (role: RoleModel) => {
        let modules = refpermissionModules.current;
        if (modules != undefined) {
            //console.log('refRole.current', refRole.current);
            // 做group by 操作
            const groups = role.permissions.reduce((group: any, permission) => {
                const { module } = permission;
                group[module] = group[module] ?? [];
                group[module].push(permission.permissionId);
                return group;
            }, {});
            // console.log('groups', groups);

            modules.map((m) => {
                m.permissions.map((mp) => {
                    var rp = groups[m.module]?.find((p: any) => p == mp.permissionId);
                    mp.checked = rp != undefined;
                });

                handleRowCheckboxChanges(m);
            });
        }
        // console.log('modules', modules);

        setPermissionGroups(modules ?? []);
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

            permissionGroups.map((mg: PermissionGroupModel) => {
                mg.permissions.map((mp) => {
                    if (mp.checked) permissions.push(mp.permissionId);
                });
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
        // console.log('handleCheckboxGroupChange', module, selecteds);
        module.permissions.map((mp) => {
            var rp = selecteds?.find((p: any) => p == mp.permissionId);
            mp.checked = rp != undefined;
        });

        handleRowCheckboxChanges(module);
        setPermissionGroups([...permissionGroups]);
    };

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
            module.permissions.map((mp) => {
                mp.checked = selected == undefined ? false : selected;
            });
            // 处理当前row内部选中框状态
            handleRowCheckboxChanges(module);
        },
        onSelectAll: (selected?: boolean) => {
            // console.log(`select all rows: ${selected}`, groups);
            // 处理row内部选中框状态
            permissionGroups.forEach((mg: PermissionGroupModel) => {
                mg.permissions.map((mp) => {
                    mp.checked = selected == undefined ? false : selected;
                });
                handleRowCheckboxChanges(mg);
            });
        },
    };

    const handleRowCheckboxChanges = (module: PermissionGroupModel) => {
        var checkeds: Array<string> = [];
        var selectedKeys: Array<string> = selectedRowKeys;
        module.permissions.map((mp) => {
            if (mp.checked) {
                checkeds.push(mp.permissionId);
            }
        });

        var selectedRowKeyIndex = selectedRowKeys.findIndex((k) => k == module.module);
        if (checkeds.length == 0 || checkeds.length < module.permissions.length) {
            if (selectedRowKeyIndex > -1) {
                selectedRowKeys.splice(selectedRowKeyIndex, 1);
            }
        } else if (checkeds.length == module.permissions.length) {
            if (selectedRowKeyIndex < 0) {
                selectedKeys.push(module.module);
            }
        }
        // console.log('selectedKeys', selectedKeys);
        setSelectedRowKeys(selectedKeys);
        setPermissionGroups([...permissionGroups]);
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
