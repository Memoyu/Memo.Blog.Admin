import React, { useEffect, useState } from 'react';
import { Button, Table, Space, Form } from '@douyinfe/semi-ui';
import { ColumnProps } from '@douyinfe/semi-ui/lib/es/table';
import Content from '@src/components/page-content';
import { accessLogList } from '@src/utils/request';
import { useTable } from '@src/hooks/useTable';
import './index.scss';
import { AccessLogModel } from '@src/common/model';

const Index: React.FC = () => {
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

    let getAccessLogList = async () => {
        accessLogList()
            .then((res) => {
                if (res.isSuccess) {
                    setData(res.data as any[]);
                }
            })
            .finally(() => setLoading(false));
    };

    // 使用 useEffect 来异步获取表格数据
    useEffect(() => {
        getAccessLogList();
    }, []);

    const handlePageChange = (page: any) => {
        getAccessLogList();
    };

    return (
        <Content title="🏷️ 访问日志">
            <div className="access-log-container">
                <div className="access-log-list">
                    <div className="access-log-list-bar">
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
                    <div className="access-log-list-table">
                        <Table
                            showHeader={true}
                            loading={loading}
                            size="small"
                            columns={columns}
                            dataSource={data}
                            pagination={{
                                currentPage,
                                pageSize: 5,
                                total: data.length,
                                onPageChange: handlePageChange,
                            }}
                        />
                    </div>
                </div>
            </div>
        </Content>
    );
};

export default Index;
