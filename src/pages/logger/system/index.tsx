import React, { useEffect, useState } from 'react';
import { IconRadio } from '@douyinfe/semi-icons-lab';
import { Button, Table, Space, Form } from '@douyinfe/semi-ui';
import { ColumnProps } from '@douyinfe/semi-ui/lib/es/table';
import Content from '@src/components/page-content';
import { systemLogList } from '@src/utils/request';
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
            title: '操作人',
            align: 'center',
            dataIndex: 'name',
        },
        {
            title: '请求方式',
            align: 'center',
            dataIndex: 'name',
        },
        {
            title: '日志类型',
            align: 'center',
            dataIndex: 'name',
        },
        {
            title: '日志内容',
            align: 'center',
            dataIndex: 'name',
        },
        {
            title: '日志时间',
            align: 'center',
            dataIndex: 'name',
        },
    ];

    const [currentPage, setPage] = useState(1);
    const [data, loading, setData, setLoading] = useTable();

    let getAccessLogList = async () => {
        systemLogList()
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
        <Content title="系统日志" icon={<IconRadio />}>
            <div className="system-log-container">
                <div className="system-log-list">
                    <div className="system-log-list-bar">
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
                    <div className="system-log-list-table">
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
