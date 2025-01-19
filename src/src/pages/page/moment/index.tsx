import React, { useState } from 'react';
import { format } from 'date-fns';
import { IconNotification } from '@douyinfe/semi-icons-lab';
import { IconPlusCircleStroked } from '@douyinfe/semi-icons';
import {
    Button,
    Typography,
    TagGroup,
    Table,
    Space,
    Form,
    Popconfirm,
    Modal,
    Toast,
} from '@douyinfe/semi-ui';

import Content from '@src/components/page-content';
import MdEditor from '@src/components/md-editor';

import { useOnMountUnsafe } from '@src/hooks/useOnMountUnsafe';
import { useData } from '@src/hooks/useData';
import { useModal } from '@src/hooks/useModal';

import { ColumnProps } from '@douyinfe/semi-ui/lib/es/table';
import { FormApi } from '@douyinfe/semi-ui/lib/es/form';
import { TagProps } from '@douyinfe/semi-ui/lib/es/tag';
import { MomentEditRequest, MomentPageRequest, MomentModel } from '@src/common/model';

import {
    momentCreate,
    momentDelete,
    momentGet,
    momentPage,
    momentUpdate,
} from '@src/utils/request';

import './index.scss';
import Dot from '@src/components/dot';

const { Text } = Typography;

const Index: React.FC = () => {
    const columns: ColumnProps[] = [
        {
            title: 'ID',
            align: 'center',
            width: 160,
            dataIndex: 'momentId',
        },
        {
            title: '内容',
            align: 'center',
            dataIndex: 'content',
            width: 370,
            ellipsis: { showTitle: false },
            render: (text) => {
                return <Text ellipsis={{ showTooltip: true }}>{text}</Text>;
            },
        },
        {
            title: '标签',
            align: 'center',
            width: 150,
            render: (_, moment: MomentModel) => (
                <TagGroup
                    maxTagCount={2}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        width: 350,
                    }}
                    tagList={moment.tags.map((t) => {
                        return { color: 'purple', children: t } as TagProps;
                    })}
                    size="large"
                    avatarShape="circle"
                    showPopover
                />
            ),
        },
        {
            title: '点赞次数',
            align: 'center',
            dataIndex: 'likes',
            width: 90,
        },
        {
            title: '动态时间',
            align: 'center',
            width: 150,
            render: (_, moment: MomentModel) => (
                <Text>{format(new Date(moment.createTime), 'yyyy-MM-dd HH:mm')}</Text>
            ),
        },
        {
            title: '公开',
            align: 'center',
            width: 60,
            render: (_, article: MomentModel) => <Dot tag={article.showable} />,
        },
        {
            title: '评论',
            align: 'center',
            width: 60,
            render: (_, article: MomentModel) => <Dot tag={article.commentable} />,
        },
        {
            title: '操作',
            align: 'center',
            width: 150,
            fixed: 'right',
            render: (_text, moment: MomentModel) => (
                <Space>
                    <Button
                        theme="borderless"
                        type="primary"
                        size="small"
                        onClick={() => {
                            handleEditMoment(moment.momentId);
                            setEditModalTitle('编辑动态');
                        }}
                    >
                        编辑
                    </Button>
                    <Popconfirm
                        position="left"
                        title="确定是否要删除此动态？"
                        onConfirm={() => handleDeleteMoment(moment)}
                    >
                        <Button theme="borderless" type="danger" size="small">
                            删除
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const pageSize = 15;
    const [currentPage, setCurrentPage] = useState(1);
    const [momentTotal, setMomentTotal] = useState(1);
    const [searchForm, setSearchForm] = useState<FormApi>();
    const [data, loading, setData, setLoading] = useData<Array<MomentModel>>();
    const [editModalTitle, setEditModalTitle] = useState<string>();
    const [_key, _setKey, editVisible, setEditVisible, _setAddModal] = useModal();
    const [editForm, setEditForm] = useState<FormApi>();
    const [editMoment, setEditMoment] = useState<MomentModel>();
    const [content, setContent] = useState<string>('');

    // 获取动态分页列表
    let getMomentPage = async (page: number = 1) => {
        setLoading(true);
        setCurrentPage(page);

        let search = searchForm?.getValues();
        // console.log(search);

        let request = {
            tags: search?.tags,
            content: search?.content,
            page: page,
            size: pageSize,
        } as MomentPageRequest;
        if (search?.momentTime && search?.momentTime.length) {
            request.dateBegin = format(search?.momentTime[0], 'yyyy-MM-dd 00:00');
            request.dateEnd = format(search?.momentTime[1], 'yyyy-MM-dd 23:59');
        }

        momentPage(request)
            .then((res) => {
                if (!res.isSuccess || !res.data) {
                    Toast.error(res.message);
                    return;
                }

                setData(res.data?.items as any[]);
                setMomentTotal(res.data?.total || 0);
            })
            .finally(() => setLoading(false));
    };

    useOnMountUnsafe(() => {
        getMomentPage();
    });

    // 编辑动态
    const handleEditMoment = async (momentId?: string) => {
        let moment = { content: '', showable: true, commentable: true } as MomentModel;
        let content = '';
        if (momentId) {
            let res = await momentGet(momentId);
            if (!res.isSuccess || !res.data) {
                Toast.error(res.message);
                return;
            }

            moment = res.data;
            content = moment.content;
        }

        setContent(content);
        setEditMoment(moment);
        setEditVisible(true);
    };

    // 删除动态
    const handleDeleteMoment = async (data: MomentModel) => {
        let res = await momentDelete(data.momentId);
        if (!res.isSuccess) {
            Toast.error(res.message);
            return;
        }
        Toast.success('删除成功');
        getMomentPage();
    };

    // 页数变更
    const handlePageChange = (page: number) => {
        getMomentPage(page);
    };

    // 确认编辑
    const handleSaveMoment = (close: boolean = true) => {
        editForm?.validate().then(async (form) => {
            let moment = {
                ...form,
                content,
            } as MomentEditRequest;

            let msg = '';
            let res;
            if (editMoment != undefined && editMoment.momentId) {
                moment.momentId = editMoment.momentId;
                res = await momentUpdate(moment);
                msg = '更新成功';
            } else {
                res = await momentCreate(moment);
                msg = '添加成功';
            }

            if (!res.isSuccess) {
                Toast.error(res.message);
                return;
            }
            Toast.success(msg);

            setEditMoment((old) => {
                if (old != undefined && res.data != undefined) old.momentId = res.data;
                return old;
            });
            getMomentPage();

            if (close) {
                setEditVisible(false);
            }
        });
    };

    return (
        <Content title="动态管理" icon={<IconNotification />}>
            <div className="moment-container">
                <div className="moment-list">
                    <div className="moment-list-bar">
                        <Form
                            layout="horizontal"
                            getFormApi={(formData) => setSearchForm(formData)}
                        >
                            <Form.Input
                                field="content"
                                showClear
                                label="内容"
                                style={{ width: 190 }}
                            />
                            <Form.TagInput
                                field="tags"
                                showClear
                                label="标签"
                                style={{ width: 250 }}
                            />
                            <Form.DatePicker
                                label="动态时间"
                                needConfirm={true}
                                type="dateRange"
                                field="momentTime"
                            />

                            <Space
                                spacing="loose"
                                style={{ alignItems: 'flex-end', marginTop: 10 }}
                            >
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    onClick={() => getMomentPage(1)}
                                >
                                    查询
                                </Button>
                                <Button htmlType="reset">重置</Button>
                                <Button
                                    icon={<IconPlusCircleStroked size="small" />}
                                    style={{ marginRight: 10 }}
                                    onClick={() => {
                                        handleEditMoment();
                                        setEditModalTitle('新增动态');
                                    }}
                                >
                                    新增
                                </Button>
                            </Space>
                        </Form>
                    </div>
                    <div className="moment-list-table">
                        <Table
                            showHeader={true}
                            loading={loading}
                            size="small"
                            columns={columns}
                            dataSource={data}
                            pagination={{
                                currentPage,
                                pageSize: pageSize,
                                total: momentTotal,
                                onPageChange: handlePageChange,
                            }}
                        />
                    </div>

                    <Modal
                        title={editModalTitle}
                        visible={editVisible}
                        onOk={() => handleSaveMoment()}
                        onCancel={() => setEditVisible(false)}
                        centered
                        bodyStyle={{ height: 570 }}
                        style={{ width: 1000 }}
                        okText={'保存'}
                    >
                        <Form
                            initValues={editMoment}
                            labelPosition="left"
                            labelAlign="left"
                            labelWidth={50}
                            getFormApi={(formData) => setEditForm(formData)}
                        >
                            <Form.TagInput field="tags" label="标签" />

                            <Form.Section text={'动态内容'}>
                                <MdEditor
                                    imgPath="articles/comments"
                                    height={490}
                                    previewTheme={'github'}
                                    content={content}
                                    onChange={setContent}
                                    onSave={() => handleSaveMoment(false)}
                                />
                            </Form.Section>
                            <div style={{ display: 'flex' }}>
                                <Form.Switch
                                    field="showable"
                                    label={{ text: '公开' }}
                                    aria-label="公开"
                                    style={{ marginRight: 50 }}
                                />
                                <Form.Switch
                                    field="commentable"
                                    label={{ text: '评论' }}
                                    aria-label="评论"
                                />
                            </div>
                        </Form>
                    </Modal>
                </div>
            </div>
        </Content>
    );
};

export default Index;
