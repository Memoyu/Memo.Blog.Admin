import React, { useState } from 'react';
import { format } from 'date-fns';
import { IconToken } from '@douyinfe/semi-icons-lab';
import { IconPlusCircleStroked } from '@douyinfe/semi-icons';
import { Button, Table, Space, Typography, Popconfirm, Form, Toast } from '@douyinfe/semi-ui';

import Content from '@src/components/page-content';
import OpenSourceEdit from './components/edit';

import { useOnMountUnsafe } from '@src/hooks/useOnMountUnsafe';
import { useData } from '@src/hooks/useData';
import { useModal } from '@src/hooks/useModal';

import { ColumnProps } from '@douyinfe/semi-ui/lib/es/table';
import { FormApi } from '@douyinfe/semi-ui/lib/es/form';
import { OpenSourceModel, OpenSourceListRequest } from '@src/common/model';

import { openSourceDelete, openSourceList } from '@src/utils/request';

import './index.scss';

const { Text } = Typography;

const Index: React.FC = () => {
    const columns: ColumnProps[] = [
        {
            title: 'ID',
            align: 'center',
            dataIndex: 'projectId',
            ellipsis: true,
            width: 165,
        },
        {
            title: '简介图',
            align: 'center',
            dataIndex: 'imageUrl',
            width: 160,
            render: (text) => {
                return (
                    <div
                        style={{
                            width: 100,
                            background: 'no-repeat center center #f4f1ec',
                            backgroundSize: 'auto 100%',
                            height: 150,
                            backgroundImage: `url(${text})`,
                        }}
                    />
                );
            },
        },
        {
            title: '项目',
            align: 'center',
            dataIndex: 'title',
            width: 170,
            ellipsis: { showTitle: false },
            render: (text) => {
                return <Text ellipsis={{ showTooltip: true }}>{text}</Text>;
            },
        },
        {
            title: '描述',
            align: 'center',
            dataIndex: 'description',
            width: 170,
            ellipsis: { showTitle: false },
            render: (text) => {
                return <Text ellipsis={{ showTooltip: true }}>{text}</Text>;
            },
        },
        {
            title: 'README地址',
            align: 'center',
            dataIndex: 'readmeUrl',
            width: 170,
            ellipsis: { showTitle: false },
            render: (text) => {
                return <Text ellipsis={{ showTooltip: true }}>{text}</Text>;
            },
        },
        {
            title: 'Star',
            align: 'center',
            dataIndex: 'star',
            width: 90,
        },
        {
            title: 'Fork',
            align: 'center',
            dataIndex: 'fork',
            width: 90,
        },
        {
            title: '创建时间',
            align: 'center',
            width: 150,
            render: (_, project: OpenSourceModel) => (
                <Text>{format(project.createTime, 'yyyy-MM-dd HH:mm')}</Text>
            ),
        },
        {
            title: '操作',
            align: 'center',
            fixed: 'right',
            width: 150,
            render: (_text, project: OpenSourceModel) => {
                return (
                    <Space>
                        <Button
                            theme="borderless"
                            type="primary"
                            size="small"
                            onClick={() => {
                                handleEditOpenSource(project.projectId);
                                setEditModalTitle('编辑项目');
                            }}
                        >
                            编辑
                        </Button>

                        <Popconfirm
                            position="left"
                            title="确定是否要删除此项目？"
                            onConfirm={() => handleDeleteProject(project)}
                        >
                            <Button theme="borderless" type="danger" size="small">
                                删除
                            </Button>
                        </Popconfirm>
                    </Space>
                );
            },
        },
    ];

    const [data, loading, setData, setLoading] = useData<Array<OpenSourceModel>>();
    const [editModalTitle, setEditModalTitle] = useState<string>();
    const [editProjectId, setEditProjectId] = useState<string>();
    const [_key, _setKey, editVisible, setEditVisible, _setAddModal] = useModal();
    const [searchForm, setSearchForm] = useState<FormApi>();

    // 获取开源项目列表
    let getOpenSourcePage = async () => {
        setLoading(true);

        let search = searchForm?.getValues();
        let request = { ...search } as OpenSourceListRequest;
        if (search?.dateTime && search?.dateTime.length) {
            request.dateBegin = format(search?.dateTime[0], 'yyyy-MM-dd HH:mm:ss');
            request.dateEnd = format(search?.dateTime[1], 'yyyy-MM-dd HH:mm:ss');
        }

        openSourceList(request)
            .then((res) => {
                if (!res.isSuccess || !res.data) {
                    Toast.error(res.message);
                    return;
                }

                setData(res.data);
            })
            .finally(() => setLoading(false));
    };

    useOnMountUnsafe(() => {
        getOpenSourcePage();
    });

    const handleEditOpenSource = (projectId?: string) => {
        setEditVisible(true);
        setEditProjectId(projectId);
    };

    // 删除开源项目
    const handleDeleteProject = async (data: OpenSourceModel) => {
        let res = await openSourceDelete(data.projectId);
        if (!res.isSuccess) {
            Toast.error(res.message);
            return;
        }

        Toast.success('删除成功');
        getOpenSourcePage();
    };

    return (
        <Content title="开源管理" icon={<IconToken />}>
            <div className="open-source-container">
                <div className="open-source-list">
                    <div className="open-source-list-bar">
                        <Form
                            layout="horizontal"
                            getFormApi={(formData) => setSearchForm(formData)}
                        >
                            <Form.Input field="title" showClear label="项目" />
                            <Form.Input field="description" showClear label="描述" />
                            <Form.DatePicker
                                label="创建时间"
                                type="dateTimeRange"
                                field="dateTime"
                            />
                            <Space
                                spacing="loose"
                                style={{ alignItems: 'flex-end', marginTop: 10 }}
                            >
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    onClick={() => getOpenSourcePage()}
                                >
                                    查询
                                </Button>

                                <Button htmlType="reset">重置</Button>

                                <Button
                                    icon={<IconPlusCircleStroked size="small" />}
                                    style={{ marginRight: 10 }}
                                    onClick={() => {
                                        handleEditOpenSource();
                                        setEditModalTitle('新增项目');
                                    }}
                                >
                                    新增
                                </Button>
                            </Space>
                        </Form>
                    </div>
                    <div className="open-source-list-table">
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
            <OpenSourceEdit
                projectId={editProjectId}
                visible={editVisible}
                title={editModalTitle}
                onVisibleChange={setEditVisible}
                onOk={getOpenSourcePage}
            />
        </Content>
    );
};

export default Index;
