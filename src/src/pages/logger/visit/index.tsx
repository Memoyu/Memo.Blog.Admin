import React, { useState } from 'react';
import { format } from 'date-fns';
import { IconProgress } from '@douyinfe/semi-icons-lab';
import { Button, Table, Space, Form, Typography, Toast } from '@douyinfe/semi-ui';

import Content from '@src/components/page-content';

import { useOnMountUnsafe } from '@src/hooks/useOnMountUnsafe';
import { useData } from '@src/hooks/useData';

import { ColumnProps } from '@douyinfe/semi-ui/lib/es/table';
import { FormApi } from '@douyinfe/semi-ui/lib/es/form';
import { VisitLogModel, VisitLogPageRequest } from '@src/common/model';

import { visitLogPage } from '@src/utils/request';

import './index.scss';
import { visitLogBehaviorOpts } from '@src/common/select-options';

const { Text } = Typography;

const Index: React.FC = () => {
    const columns: ColumnProps[] = [
        {
            title: 'ID',
            align: 'center',
            dataIndex: 'visitId',
            width: 165,
        },
        {
            title: '访客标识',
            align: 'center',
            dataIndex: 'visitorId',
            width: 165,
        },
        {
            title: '访问行为',
            align: 'center',
            dataIndex: 'behaviorName',
            width: 90,
        },
        {
            title: '访问路径',
            align: 'center',
            dataIndex: 'path',
            width: 200,
            ellipsis: { showTitle: false },
            render: (text) => {
                return <Text ellipsis={{ showTooltip: true }}>{text}</Text>;
            },
        },
        {
            title: '受访问内容',
            align: 'center',
            dataIndex: 'visited',
            width: 170,
            ellipsis: { showTitle: false },
            render: (_, log: VisitLogModel) => {
                return <Text ellipsis={{ showTooltip: true }}>{log.visited.title}</Text>;
            },
        },
        {
            title: 'IP',
            align: 'center',
            dataIndex: 'ip',
            width: 100,
            render: (text) => {
                return <Text ellipsis={{ showTooltip: true }}>{text}</Text>;
            },
        },
        {
            title: '国家',
            align: 'center',
            dataIndex: 'country',
            width: 80,
        },
        {
            title: '区域',
            align: 'center',
            dataIndex: 'region',
            width: 100,
        },
        {
            title: '省市',
            align: 'center',
            dataIndex: 'province',
            width: 100,
        },
        {
            title: '城市',
            align: 'center',
            dataIndex: 'city',
            width: 100,
        },
        {
            title: '服务商',
            align: 'center',
            dataIndex: 'isp',
            width: 80,
        },
        {
            title: '设备/浏览器',
            align: 'center',
            dataIndex: 'os-browser',
            width: 150,
            render: (_, log: VisitLogModel) => <Text>{log.os + ' - ' + log.browser}</Text>,
        },
        {
            title: '访问时间',
            align: 'center',
            dataIndex: 'visitDate',
            width: 150,
            render: (_, log: VisitLogModel) => (
                <Text>{format(new Date(log.visitDate), 'yyyy-MM-dd HH:mm')}</Text>
            ),
        },
    ];

    const pageSize = 15;
    const [currentPage, setCurrentPage] = useState(1);
    const [logTotal, setLogTotal] = useState(1);
    const [searchForm, setSearchForm] = useState<FormApi>();
    const [data, loading, setData, setLoading] = useData<Array<VisitLogModel>>();

    let getVisitLogPage = async (page: number = 1) => {
        setLoading(true);
        setCurrentPage(page);

        let search = searchForm?.getValues();
        let request = {
            ...search,
            page: page,
            size: pageSize,
        } as VisitLogPageRequest;

        if (search?.time && search?.time.length) {
            request.dateBegin = format(search?.time[0], 'yyyy-MM-dd HH:mm:ss');
            request.dateEnd = format(search?.time[1], 'yyyy-MM-dd HH:mm:ss');
        }

        visitLogPage(request)
            .then((res) => {
                if (!res.isSuccess || !res.data) {
                    Toast.error(res.message);
                    return;
                }

                setData(res.data.items);
                setLogTotal(res.data.total || 0);
            })
            .finally(() => setLoading(false));
    };

    useOnMountUnsafe(() => {
        getVisitLogPage();
    });

    const handlePageChange = (page: any) => {
        getVisitLogPage(page);
    };

    return (
        <Content title="访问日志" icon={<IconProgress />}>
            <div className="visit-log-container">
                <div className="visit-log-list">
                    <div className="visit-log-list-bar">
                        <Form
                            layout="horizontal"
                            getFormApi={(formData) => setSearchForm(formData)}
                        >
                            <Form.Input field="visitId" showClear label="日志Id" />

                            <Form.Input field="visitorId" showClear label="访客标识" />

                            <Form.Select
                                showClear
                                label="访问行为"
                                field="behavior"
                                style={{ width: '250px' }}
                                optionList={visitLogBehaviorOpts}
                            />

                            <Form.Input field="path" showClear label="访问路径" />

                            <Form.Input field="visitedId" showClear label="受访Id" />

                            <Form.Input field="ip" showClear label="访问IP" />

                            <Form.Input field="country" showClear label="访问国家" />

                            <Form.Input field="region" showClear label="访问区域" />

                            <Form.Input field="province" showClear label="访问省市" />

                            <Form.Input field="city" showClear label="访问城市" />

                            <Form.Input field="isp" showClear label="服务商" />

                            <Form.Select
                                showClear
                                label="操作系统"
                                field="os"
                                style={{ width: '250px' }}
                            />

                            <Form.Select
                                showClear
                                label="浏览器"
                                field="browser"
                                style={{ width: '250px' }}
                            />

                            <Form.DatePicker label="日志时间" type="dateTimeRange" field="time" />

                            <Space
                                spacing="loose"
                                style={{ alignItems: 'flex-end', marginTop: 10 }}
                            >
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    onClick={() => getVisitLogPage(1)}
                                >
                                    查询
                                </Button>
                                <Button htmlType="reset">重置</Button>
                            </Space>
                        </Form>
                    </div>
                    <div className="visit-log-list-table">
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
