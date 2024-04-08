import React, { useState } from 'react';
import { format } from 'date-fns';
import { IconRadio } from '@douyinfe/semi-icons-lab';
import { Button, Table, Space, Typography, Form } from '@douyinfe/semi-ui';

import Content from '@src/components/page-content';

import { useTable } from '@src/hooks/useTable';
import { useOnMountUnsafe } from '@src/hooks/useOnMountUnsafe';

import { ColumnProps } from '@douyinfe/semi-ui/lib/es/table';
import { FormApi } from '@douyinfe/semi-ui/lib/es/form';
import { SystemLogLevel, SystemLogModel, SystemLogPageRequest } from '@src/common/model';

import { systemLogPage } from '@src/utils/request';

import './index.scss';

const { Text } = Typography;

const Index: React.FC = () => {
    const columns: ColumnProps[] = [
        {
            title: 'ID',
            align: 'center',
            dataIndex: 'id',
            width: 100,
            render: (text) => {
                return <Text ellipsis={{ showTooltip: true }}>{text}</Text>;
            },
        },
        {
            title: '日志等级',
            align: 'center',
            dataIndex: 'level',
            width: 90,
            render: (_, log: SystemLogModel) => {
                return <Text ellipsis={{ showTooltip: true }}>{SystemLogLevel[log.level]}</Text>;
            },
        },
        {
            title: '日志内容',
            align: 'center',
            dataIndex: 'message',
            width: 500,
            ellipsis: { showTitle: false },
            render: (text) => {
                return <Text ellipsis={{ showTooltip: true }}>{text}</Text>;
            },
        },
        {
            title: '日志源',
            align: 'center',
            dataIndex: 'source',
            width: 300,
            ellipsis: { showTitle: false },
            render: (text) => {
                return <Text ellipsis={{ showTooltip: true }}>{text}</Text>;
            },
        },
        {
            title: '请求参数',
            align: 'center',
            dataIndex: 'request',
            width: 200,
            ellipsis: { showTitle: false },
            render: (text) => {
                return <Text ellipsis={{ showTooltip: true }}>{text}</Text>;
            },
        },
        {
            title: '请求ID',
            align: 'center',
            dataIndex: 'requestId',
            width: 160,
            ellipsis: { showTitle: false },
            render: (text) => {
                return <Text ellipsis={{ showTooltip: true }}>{text}</Text>;
            },
        },
        {
            title: '请求路径',
            align: 'center',
            dataIndex: 'requestPath',
            width: 200,
            ellipsis: { showTitle: false },
            render: (text) => {
                return <Text ellipsis={{ showTooltip: true }}>{text}</Text>;
            },
        },
        {
            title: '异常信息',
            align: 'center',
            dataIndex: 'exMessage',
            width: 200,
            ellipsis: { showTitle: false },
            render: (text) => {
                return <Text ellipsis={{ showTooltip: true }}>{text}</Text>;
            },
        },
        {
            title: '日志时间',
            align: 'center',
            dataIndex: 'time',
            width: 150,
            render: (_, log: SystemLogModel) => (
                <Text>{format(new Date(log.time), 'yyyy-MM-dd HH:mm')}</Text>
            ),
        },
    ];

    const pageSize = 15;
    const [currentPage, setCurrentPage] = useState(1);
    const [logTotal, setLogTotal] = useState(1);
    const [searchForm, setSearchForm] = useState<FormApi>();
    const [data, loading, setData, setLoading] = useTable();

    // 获取日志分页
    let getSytemLogPage = async (page: number = 1) => {
        setLoading(true);
        setCurrentPage(page);

        let search = searchForm?.getValues();
        let request = {
            ...search,
            page: page,
            size: pageSize,
        } as SystemLogPageRequest;

        if (search?.time && search?.time.length) {
            request.timeBegin = format(search?.time[0], 'yyyy-MM-dd HH:mm:ss');
            request.timeEnd = format(search?.time[1], 'yyyy-MM-dd HH:mm:ss');
        }

        let res = await systemLogPage(request);
        if (res.isSuccess) {
            setData(res.data?.items as any[]);
            setLogTotal(res.data?.total || 0);
        }

        setLoading(false);
    };

    useOnMountUnsafe(() => {
        getSytemLogPage();
    });

    const handlePageChange = (page: any) => {
        getSytemLogPage(page);
    };

    return (
        <Content title="系统日志" icon={<IconRadio />}>
            <div className="system-log-container">
                <div className="system-log-list">
                    <div className="system-log-list-bar">
                        <Form
                            layout="horizontal"
                            getFormApi={(formData) => setSearchForm(formData)}
                        >
                            <Form.Input field="message" showClear label="日志内容" />

                            <Form.Input field="message" showClear label="日志源" />

                            <Form.Select label="日志等级" field="level" style={{ width: '250px' }}>
                                {Object.keys(SystemLogLevel)
                                    .filter((key) => Number.isNaN(Number(key)))
                                    .map((l, i) => {
                                        return (
                                            <Form.Select.Option value={i}>{l}</Form.Select.Option>
                                        );
                                    })}
                            </Form.Select>

                            <Form.DatePicker label="日志时间" type="dateTimeRange" field="time" />

                            <Form.Input field="requestParamterName" showClear label="请求参数名" />

                            <Form.Input field="requestParamterValue" showClear label="请求参数值" />

                            <Form.Input field="requestId" showClear label="请求Id" />

                            <Form.Input field="requestPath" showClear label="请求路径" />

                            <Space
                                spacing="loose"
                                style={{ alignItems: 'flex-end', marginTop: 10 }}
                            >
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    onClick={() => getSytemLogPage(1)}
                                >
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
                                pageSize: pageSize,
                                total: logTotal,
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
