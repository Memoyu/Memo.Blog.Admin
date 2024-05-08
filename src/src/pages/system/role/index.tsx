import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { IconToast } from '@douyinfe/semi-icons-lab';
import { IconPlusCircleStroked } from '@douyinfe/semi-icons';
import { Button, Table, Typography, Space, Popconfirm, Form, Toast } from '@douyinfe/semi-ui';

import Content from '@src/components/page-content';

import { useOnMountUnsafe } from '@src/hooks/useOnMountUnsafe';
import { useData } from '@src/hooks/useData';

import { ColumnProps } from '@douyinfe/semi-ui/lib/es/table';
import { FormApi } from '@douyinfe/semi-ui/lib/es/form';
import { RoleListModel, RoleType } from '@src/common/model';

import { roleList, roleDelete } from '@src/utils/request';

import './index.scss';

const { Text } = Typography;

const Index: React.FC = () => {
    const columns: ColumnProps[] = [
        {
            title: 'ID',
            align: 'center',
            dataIndex: 'roleId',
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
            render: (_, role: RoleListModel) => {
                return (
                    <Text>
                        {role.type == RoleType.Create
                            ? '手动创建'
                            : role.type == RoleType.Init
                              ? '初始化创建'
                              : ''}
                    </Text>
                );
            },
        },
        {
            title: '操作',
            align: 'center',
            render: (_text, role: RoleListModel) => {
                return (
                    <Space>
                        <Button
                            theme="borderless"
                            type="primary"
                            size="small"
                            onClick={() => handleEditRole(role)}
                        >
                            编辑
                        </Button>
                        {/* 非初始化的管理员才展示删除 */}
                        {
                            <Popconfirm
                                position="left"
                                title="确定是否要删除此角色？"
                                onConfirm={() => handleDeleteRole(role)}
                            >
                                <Button theme="borderless" type="danger" size="small">
                                    删除
                                </Button>
                            </Popconfirm>
                        }
                    </Space>
                );
            },
        },
    ];

    const navigate = useNavigate();
    const [searchForm, setSearchForm] = useState<FormApi>();
    const [data, loading, setData, setLoading] = useData<Array<RoleListModel>>();

    // 获取角色列表
    let getRoleList = async () => {
        setLoading(true);

        let search = searchForm?.getValues();
        roleList(search?.name)
            .then((res) => {
                if (!res.isSuccess || !res.data) {
                    Toast.error(res.message);
                    return;
                }
                setData(res.data as any[]);
            })
            .finally(() => setLoading(false));
    };

    useOnMountUnsafe(() => {
        getRoleList();
    });

    // 编辑角色
    const handleEditRole = (data?: RoleListModel) => {
        var path = '/system/role/edit' + (data != undefined ? `/${data?.roleId}` : '');
        navigate(path);
    };

    // 删除角色
    const handleDeleteRole = async (data: RoleListModel) => {
        let res = await roleDelete(data.roleId);
        if (!res.isSuccess) {
            Toast.error(res.message);
            return;
        }
        Toast.success('删除成功');
        getRoleList();
    };

    return (
        <Content title="角色管理" icon={<IconToast />}>
            <div className="role-container">
                <div className="role-list">
                    <div className="role-list-bar">
                        <Form
                            layout="horizontal"
                            getFormApi={(formData) => setSearchForm(formData)}
                        >
                            <Form.Input field="name" showClear label="角色名" />
                            <Space
                                spacing="loose"
                                style={{ alignItems: 'flex-end', marginTop: 10 }}
                            >
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
                                    onClick={() => handleEditRole()}
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
            </div>
        </Content>
    );
};

export default Index;
