import React, { useEffect, useState } from 'react';
import { Button, Table, Space, Form } from '@douyinfe/semi-ui';
import { ColumnProps } from '@douyinfe/semi-ui/lib/es/table';
import Content from '@src/components/page-content';
import { permissionList } from '@src/utils/request';
import { useTable } from '@src/hooks/useTable';
import './index.scss';
import { PermissionModel } from '@src/common/model';

const Index: React.FC = () => {
    const list = [
        {
            key: 1,
            dataKey: 'videos_info',
            name: '视频信息',
            type: 'Object 对象',
            description: '视频的元信息',
            default: '无',
            children: [
                {
                    key: 11,
                    dataKey: 'status',
                    name: '视频状态',
                    type: 'Enum <Integer> 枚举',
                    description: '视频的可见、推荐状态',
                    default: '1',
                },
                {
                    key: 12,
                    dataKey: 'vid',
                    name: '视频 ID',
                    type: 'String 字符串',
                    description: '标识视频的唯一 ID',
                    default: '无',
                    children: [
                        {
                            dataKey: 'video_url',
                            name: '视频地址',
                            type: 'String 字符串',
                            description: '视频的唯一链接',
                            default: '无',
                        },
                    ],
                },
            ],
        },
        {
            key: 2,
            dataKey: 'text_info',
            name: '文本信息',
            type: 'Object 对象',
            description: '视频的元信息',
            default: '无',
            children: [
                {
                    key: 21,
                    dataKey: 'title',
                    name: '视频标题',
                    type: 'String 字符串',
                    description: '视频的标题',
                    default: '无',
                },
                {
                    key: 22,
                    dataKey: 'video_description',
                    name: '视频描述',
                    type: 'String 字符串',
                    description: '视频的描述',
                    default: '无',
                },
            ],
        },
    ];

    const columns: ColumnProps[] = [
        {
            title: '序号',
            align: 'center',
            dataIndex: 'logId',
        },
        {
            title: '访客标识',
            align: 'center',
            dataIndex: 'name',
        },
        {
            title: '操作',
            align: 'center',
            dataIndex: 'name',
        },
        {
            title: '内容',
            align: 'center',
            dataIndex: 'name',
        },
        {
            title: 'IP',
            align: 'center',
            dataIndex: 'name',
        },
        {
            title: 'IP所属',
            align: 'center',
            dataIndex: 'name',
        },
        {
            title: '设备/浏览器',
            align: 'center',
            dataIndex: 'name',
        },
        {
            title: '访问时间',
            align: 'center',
            dataIndex: 'name',
        },
    ];

    const [currentPage, setPage] = useState(1);
    const [data, loading, setData, setLoading] = useTable();

    let getPermissionList = async () => {
        permissionList()
            .then((res) => {
                if (res.isSuccess) {
                    setData(res.data as any[]);
                }
            })
            .finally(() => setLoading(false));
    };

    // 使用 useEffect 来异步获取表格数据
    useEffect(() => {
        getPermissionList();
    }, []);

    const handlePageChange = (page: any) => {
        getPermissionList();
    };

    return (
        <Content title="🏷️ 权限管理">
            <div className="permission-container">
                <div className="permission-list">
                    <div className="permission-list-bar">
                        <Form layout="horizontal" onValueChange={(values) => console.log(values)}>
                            <Form.Input field="UserName" label="访客标识" style={{ width: 190 }} />
                            <Form.DatePicker
                                label="访问时间"
                                type="dateTimeRange"
                                field="customTime"
                            />

                            <Space spacing="loose" style={{ alignItems: 'flex-end' }}>
                                <Button type="primary" htmlType="submit">
                                    查询
                                </Button>
                                <Button htmlType="reset">重置</Button>
                            </Space>
                        </Form>
                    </div>
                    <div className="permission-list-table">
                        <Table
                            showHeader={true}
                            loading={loading}
                            size="small"
                            columns={columns}
                            defaultExpandAllRows
                            dataSource={list}
                            pagination={false}
                        />
                    </div>
                </div>
            </div>
        </Content>
    );
};

export default Index;
