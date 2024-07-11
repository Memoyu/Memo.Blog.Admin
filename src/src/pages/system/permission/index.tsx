import React, { useState } from 'react';
import { IconButton } from '@douyinfe/semi-icons-lab';
import { Button, Table, Space, Form, TagGroup, Toast } from '@douyinfe/semi-ui';

import Content from '@src/components/page-content';

import { useOnMountUnsafe } from '@src/hooks/useOnMountUnsafe';
import { useData } from '@src/hooks/useData';

import { ColumnProps } from '@douyinfe/semi-ui/lib/es/table';
import { TagProps } from '@douyinfe/semi-ui/lib/es/tag';
import { FormApi } from '@douyinfe/semi-ui/lib/es/form';
import { PermissionModel } from '@src/common/model';

import { permissionList } from '@src/utils/request';

import './index.scss';

const Index: React.FC = () => {
    const columns: ColumnProps[] = [
        {
            title: 'ID',
            align: 'center',
            dataIndex: 'permissionId',
        },
        {
            title: '模块',
            align: 'center',
            dataIndex: 'moduleName',
        },
        {
            title: '权限',
            align: 'center',
            dataIndex: 'name',
        },
        {
            title: '标识',
            align: 'center',
            dataIndex: 'signature',
        },
        {
            title: '关联角色',
            align: 'center',
            dataIndex: 'roles',
            width: 200,
            render: (_, permission: PermissionModel) => (
                <TagGroup
                    maxTagCount={2}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        width: 200,
                    }}
                    tagList={permission.roles.map((r) => {
                        return { color: 'purple', children: r.name } as TagProps;
                    })}
                    size="large"
                    avatarShape="circle"
                    showPopover
                />
            ),
        },
    ];

    const [searchForm, setSearchForm] = useState<FormApi>();
    const [data, loading, setData, setLoading] = useData<Array<PermissionModel>>([]);

    let getPermissionList = async () => {
        setLoading(true);

        let search = searchForm?.getValues();
        permissionList(search?.name, search?.signature)
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
        getPermissionList();
    });

    return (
        <Content title="权限管理" icon={<IconButton />}>
            <div className="permission-container">
                <div className="permission-list">
                    <div className="permission-list-bar">
                        <Form
                            layout="horizontal"
                            getFormApi={(formData) => setSearchForm(formData)}
                        >
                            <Form.Input field="name" showClear label="权限" />
                            <Form.Input field="signature" showClear label="标识" />
                            <Space
                                spacing="loose"
                                style={{ alignItems: 'flex-end', marginTop: 10 }}
                            >
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    onClick={() => getPermissionList()}
                                >
                                    查询
                                </Button>
                            </Space>
                        </Form>
                    </div>

                    <div className="permission-list-table">
                        <Table
                            dataSource={data}
                            loading={loading}
                            size="small"
                            rowKey={'signature'}
                            expandAllGroupRows={true}
                            groupBy={(permission: PermissionModel | undefined) =>
                                permission?.moduleName + ' - ' + permission?.module
                            }
                            columns={columns}
                            renderGroupSection={(groupKey: any) => <strong>{groupKey}</strong>}
                            clickGroupedRowToExpand // if you want to click the entire row to expand
                            pagination={false}
                        />
                    </div>
                </div>
            </div>
        </Content>
    );
};

export default Index;
