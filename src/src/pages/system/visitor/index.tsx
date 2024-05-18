import React, { useState } from 'react';
import { IconAccessibility } from '@douyinfe/semi-icons-lab';
import { format } from 'date-fns';
import {
    Button,
    Table,
    Space,
    Avatar,
    Typography,
    Modal,
    Popconfirm,
    Form,
    Toast,
    Col,
    Row,
} from '@douyinfe/semi-ui';

import Content from '@src/components/page-content';

import { useOnMountUnsafe } from '@src/hooks/useOnMountUnsafe';
import { useData } from '@src/hooks/useData';
import { useModal } from '@src/hooks/useModal';

import { ColumnProps } from '@douyinfe/semi-ui/lib/es/table';
import { FormApi } from '@douyinfe/semi-ui/lib/es/form';
import {
    AvatarOriginType,
    VisitorEditRequest,
    VisitorModel,
    VisitorPageRequest,
} from '@src/common/model';

import { visitorPage, visitorDelete, visitorUpdate, visitorGet } from '@src/utils/request';

import './index.scss';
import UploadImage from '@src/components/upload-image';
import { AvatarOriginTypeOpts } from '@src/common/select-options';

const { Text } = Typography;

const Index: React.FC = () => {
    const columns: ColumnProps[] = [
        {
            title: 'ID',
            align: 'center',
            dataIndex: 'visitorId',
            width: 160,
        },
        {
            title: '头像',
            align: 'center',
            dataIndex: 'avatar',
            width: 70,
            render: (text) => {
                return <Avatar size="small" src={text} />;
            },
        },
        {
            title: '昵称',
            align: 'center',
            dataIndex: 'nickname',
            width: 100,
            ellipsis: { showTitle: false },
            render: (text) => {
                return <Text ellipsis={{ showTooltip: true }}>{text}</Text>;
            },
        },
        {
            title: '头像来源',
            align: 'center',
            width: 170,
            ellipsis: { showTitle: false },
            render: (_, visitor: VisitorModel) => {
                return (
                    <Text ellipsis={{ showTooltip: true }}>
                        {AvatarOriginTypeOpts[visitor.avatarOriginType || 0].label}
                    </Text>
                );
            },
        },
        {
            title: '访客归属',
            align: 'center',
            dataIndex: 'region',
            width: 170,
            ellipsis: { showTitle: false },
            render: (text) => {
                return <Text ellipsis={{ showTooltip: true }}>{text}</Text>;
            },
        },
        {
            title: '创建时间',
            align: 'center',
            width: 150,
            render: (_, visitor: VisitorModel) => (
                <Text>{format(new Date(visitor.createTime), 'yyyy-MM-dd HH:mm')}</Text>
            ),
        },
        {
            title: '操作',
            align: 'center',
            width: 150,
            render: (_text, visitor: VisitorModel) => {
                return (
                    <Space>
                        <Button
                            theme="borderless"
                            type="primary"
                            size="small"
                            onClick={() => {
                                handleeditVisitor(visitor.visitorId);
                            }}
                        >
                            编辑
                        </Button>

                        <Popconfirm
                            position="left"
                            title="确定是否要删除此访客？"
                            onConfirm={() => handleDeleteVisitor(visitor)}
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

    const pageSize = 15;
    const [currentPage, setCurrentPage] = useState(1);
    const [commentTotal, setCommentTotal] = useState(1);
    const [data, loading, setData, setLoading] = useData<Array<VisitorModel>>();
    const [_key, _setKey, editVisible, setEditVisible, _setAddModal] = useModal();
    const [editForm, setEditForm] = useState<FormApi>();
    const [searchForm, setSearchForm] = useState<FormApi>();
    const [editVisitor, setEditVisitor] = useState<VisitorModel>();
    const [avatar, setAvatar] = useState<string>();

    // 获取访客分页
    let getVisitorPage = async (page: number = 1) => {
        setLoading(true);
        setCurrentPage(page);

        let search = searchForm?.getValues();
        let request = { ...search, page, size: pageSize } as VisitorPageRequest;
        visitorPage(request)
            .then((res) => {
                if (!res.isSuccess || !res.data) {
                    Toast.error(res.message);
                    return;
                }

                setData(res.data.items);
                setCommentTotal(res.data.total || 0);
            })
            .finally(() => setLoading(false));
    };

    useOnMountUnsafe(() => {
        getVisitorPage();
    });

    // 页数变更
    const handlePageChange = (page: number) => {
        getVisitorPage(page);
    };

    // 保存编辑访客
    const handleEditModalOk = () => {
        editForm?.validate().then(async (form) => {
            // 变更了头像，则变更来源类型
            let avatarOriginType = editVisitor?.avatarOriginType;
            if (avatar != editVisitor?.avatar) avatarOriginType = AvatarOriginType.Upload;
            let visitor = {
                ...form,
                visitorId: editVisitor?.visitorId,
                avatar: avatar,
                avatarOriginType: avatarOriginType,
            } as VisitorEditRequest;

            let res = await visitorUpdate(visitor);

            if (!res.isSuccess) {
                Toast.error(res.message);
                return;
            }
            setEditVisible(false);
            Toast.success('更新成功');
            getVisitorPage();
        });
    };

    // 编辑访客
    const handleeditVisitor = async (visitorId: string) => {
        let res = await visitorGet(visitorId);
        if (!res.isSuccess || !res.data) {
            Toast.error(res.message);
            return;
        }

        setAvatar(res.data.avatar);
        setEditVisitor(res.data);
        setEditVisible(true);
    };

    // 删除友链
    const handleDeleteVisitor = async (data: VisitorModel) => {
        let res = await visitorDelete(data.visitorId);
        if (!res.isSuccess) {
            Toast.error(res.message);
            return;
        }

        Toast.success('删除成功');
        getVisitorPage();
    };

    return (
        <Content title="访客管理" icon={<IconAccessibility />}>
            <div className="friend-container">
                <div className="friend-list">
                    <div className="friend-list-bar">
                        <Form
                            layout="horizontal"
                            getFormApi={(formData) => setSearchForm(formData)}
                        >
                            <Form.Input field="visitorId" showClear label="访客标识" />
                            <Form.Input field="nickname" showClear label="昵称" />
                            <Form.Input field="description" showClear label="描述" />
                            <Form.Input field="region" showClear label="访客归属" />
                            <Space
                                spacing="loose"
                                style={{ alignItems: 'flex-end', marginTop: 10 }}
                            >
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    onClick={() => getVisitorPage(1)}
                                >
                                    查询
                                </Button>

                                <Button htmlType="reset">重置</Button>
                            </Space>
                        </Form>
                    </div>
                    <div className="friend-list-table">
                        <Table
                            showHeader={true}
                            loading={loading}
                            size="small"
                            columns={columns}
                            dataSource={data}
                            pagination={{
                                currentPage,
                                pageSize: pageSize,
                                total: commentTotal,
                                onPageChange: handlePageChange,
                            }}
                        />
                    </div>
                </div>
                <Modal
                    title="编辑访客"
                    visible={editVisible}
                    onOk={handleEditModalOk}
                    onCancel={() => setEditVisible(false)}
                    centered
                    style={{ width: 550 }}
                    okText={'保存'}
                >
                    <Form
                        labelPosition="left"
                        labelAlign="left"
                        labelWidth={60}
                        initValues={editVisitor}
                        getFormApi={(formData) => setEditForm(formData)}
                    >
                        <Row gutter={12}>
                            <Col span={4}>
                                <Form.Slot noLabel>
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <UploadImage
                                            type="avatar"
                                            url={avatar}
                                            path="visitor/avatar"
                                            onSuccess={setAvatar}
                                        />
                                    </div>
                                </Form.Slot>
                            </Col>
                            <Col span={20}>
                                <Form.Input
                                    field="nickname"
                                    placeholder="访客昵称不超20个字符"
                                    label="昵称"
                                    rules={[
                                        { required: true, message: '访客昵称必填' },
                                        { max: 20, message: '长度不能超20个字符' },
                                    ]}
                                />
                                <Form.Input field="email" label="邮箱" />
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            </div>
        </Content>
    );
};

export default Index;
