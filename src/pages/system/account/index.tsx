import React, { useState } from 'react';
import { format } from 'date-fns';
import { IconAvatar } from '@douyinfe/semi-icons-lab';
import { IconPlusCircleStroked } from '@douyinfe/semi-icons';
import {
    Button,
    Table,
    Space,
    Avatar,
    Typography,
    Modal,
    Form,
    Popconfirm,
    TagGroup,
    Toast,
} from '@douyinfe/semi-ui';

import Content from '@src/components/page-content';

import { useOnMountUnsafe } from '@src/hooks/useOnMountUnsafe';
import { useTable } from '@src/hooks/useTable';
import { useModal } from '@src/hooks/useModal';

import { ColumnProps } from '@douyinfe/semi-ui/lib/es/table';
import { FormApi } from '@douyinfe/semi-ui/lib/es/form';
import { TagProps } from '@douyinfe/semi-ui/lib/es/tag';
import { OptionProps } from '@douyinfe/semi-ui/lib/es/select';
import {
    UserEditRequest,
    UserIdentityType,
    UserPageModel,
    UserPageRequest,
} from '@src/common/model';

import {
    userPage,
    userCreate,
    userGet,
    userDelete,
    userUpdate,
    roleList,
} from '@src/utils/request';

import './index.scss';

const { Text } = Typography;

const Index: React.FC = () => {
    const columns: ColumnProps[] = [
        {
            title: 'ID',
            align: 'center',
            dataIndex: 'userId',
            width: 160,
        },
        {
            title: '头像',
            align: 'center',
            dataIndex: 'name',
            width: 70,
            render: (text) => {
                return <Avatar alt="cute cat" size="small" src={text} />;
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
            title: '用户名',
            align: 'center',
            dataIndex: 'username',
            width: 100,
            ellipsis: { showTitle: false },
            render: (text) => {
                return <Text ellipsis={{ showTooltip: true }}>{text}</Text>;
            },
        },
        {
            title: '邮箱',
            align: 'center',
            dataIndex: 'email',
            width: 130,
            ellipsis: { showTitle: false },
            render: (text) => {
                return <Text ellipsis={{ showTooltip: true }}>{text}</Text>;
            },
        },
        {
            title: '手机号码',
            align: 'center',
            dataIndex: 'phoneNumber',
            width: 140,
        },
        {
            title: '角色',
            align: 'center',
            dataIndex: 'roles',
            width: 130,
            render: (_, user: UserPageModel) => (
                <TagGroup
                    maxTagCount={2}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        width: 140,
                    }}
                    tagList={user.roles.map((r) => {
                        return { color: 'purple', children: r.name } as TagProps;
                    })}
                    size="large"
                    avatarShape="circle"
                    showPopover
                />
            ),
        },
        {
            title: '上次登录时间',
            align: 'center',
            dataIndex: 'lastLoginTime',
            width: 150,
            render: (_, user: UserPageModel) => (
                <Text>{format(user.lastLoginTime, 'yyyy-MM-dd HH:mm')}</Text>
            ),
        },
        {
            title: '创建时间',
            align: 'center',
            dataIndex: 'createTime',
            width: 150,
            render: (_, user: UserPageModel) => (
                <Text>{format(user.createTime, 'yyyy-MM-dd HH:mm')}</Text>
            ),
        },
        {
            title: '操作',
            align: 'center',
            width: 150,
            fixed: 'right',
            render: (_text, user: UserPageModel) => {
                return (
                    <Space>
                        <Button
                            theme="borderless"
                            type="primary"
                            size="small"
                            onClick={() => {
                                handleEditUser(user.userId);
                                setEditModalTitle('编辑用户');
                            }}
                        >
                            编辑
                        </Button>
                        <Popconfirm
                            position="left"
                            title="确定是否要删除此用户？"
                            onConfirm={() => handleDeleteUser(user.userId)}
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

    const userIdentityOpts: Array<OptionProps> = [
        {
            value: 0,
            label: '密码',
        },
        {
            value: 1,
            label: '微信',
        },
        {
            value: 2,
            label: 'QQ',
        },
        {
            value: 3,
            label: 'Github',
        },
        {
            value: 4,
            label: 'Gitee',
        },
    ];

    const pageSize = 15;
    const [currentPage, setCurrentPage] = useState(1);
    const [userTotal, setUserTotal] = useState(1);
    const [searchForm, setSearchForm] = useState<FormApi>();
    const [users, loading, setUsers, setLoading] = useTable();
    const [roles, setRoles] = useState<Array<OptionProps>>();

    const [editModalTitle, setEditModalTitle] = useState<string>();
    const [editModalHeight, setEditModalHeight] = useState<number>(430);
    const [_key, _setKey, editVisible, setEditVisible, _setAddModal] = useModal();
    const [editForm, setEditForm] = useState<FormApi>();
    const [editUser, setEditUser] = useState<UserEditRequest>();
    const [userIdentityType, setUserIdentityType] = useState<UserIdentityType>(
        UserIdentityType.Password
    );

    // 获取用户分页
    let getUserPage = (page: number = 1) => {
        setLoading(true);
        setCurrentPage(page);

        let search = searchForm?.getValues();
        // console.log(search);

        let request = {
            userId: search?.userId,
            username: search?.username,
            nickname: search?.nickname,
            email: search?.email,
            phoneNumber: search?.phoneNumber,
            roles: search?.roles,
            page: page,
            size: pageSize,
        } as UserPageRequest;

        userPage(request)
            .then((res) => {
                if (!res.isSuccess || res.data == undefined) {
                    Toast.error(res.message);
                    return;
                }
                setUsers(res.data.items);
                setUserTotal(res.data.total);
            })
            .finally(() => setLoading(false));
    };

    // 获取角色列表
    let getRoleList = async () => {
        let res = await roleList();
        if (res.isSuccess && res.data != undefined) {
            setRoles(
                res.data.map((c) => {
                    return { value: c.roleId, label: c.name };
                })
            );
        }
    };

    useOnMountUnsafe(() => {
        getRoleList();
        getUserPage();
    });

    // 页数变更
    const handlePageChange = (page: number) => {
        getUserPage(page);
    };

    // 保存编辑/新增
    const handleEditModalOk = () => {
        editForm?.validate().then(async (form) => {
            let user = {
                ...form,
            } as UserEditRequest;

            var msg = '';
            var res;
            if (editUser?.userId != undefined) {
                res = await userUpdate(user);
                msg = '更新';
            } else {
                res = await userCreate(user);
                msg = '添加';
            }

            if (!res.isSuccess) {
                Toast.error(res.message);
                return;
            }

            setEditVisible(false);
            Toast.success(msg + '用户成功');
            getUserPage();
        });
    };

    // 触发编辑
    const handleEditUser = async (userId?: string) => {
        getRoleList();

        let user: UserEditRequest = {
            username: '',
            nickname: '',
            roles: [],
            userIdentityType: UserIdentityType.Password,
            identifier: '',
            credential: '',
        };
        setEditModalHeight(430);

        if (userId) {
            let res = await userGet(userId);
            if (!res.isSuccess || res.data == undefined) {
                Toast.error(res.message);
                return;
            }
            var roleIds: Array<string> = [];
            res.data.roles.forEach((r) => {
                roleIds.push(r.roleId);
            });

            user = {
                userId: res.data.userId,
                username: res.data.username,
                nickname: res.data.nickname,
                email: res.data.email,
                phoneNumber: res.data.phoneNumber,
                roles: roleIds,
                userIdentityType: res.data.userIdentity.identityType,
                identifier: res.data.userIdentity.identifier,
                credential: res.data.userIdentity.credential,
            } as UserEditRequest;
            setEditModalHeight(340);
        }

        // console.log(user);
        setUserIdentityType(user.userIdentityType);
        setEditUser(user);
        setEditVisible(true);
    };

    // 触发删除
    const handleDeleteUser = async (userId: string) => {
        let res = await userDelete(userId);
        if (!res.isSuccess) {
            Toast.error(res.message);
            return;
        }

        Toast.success('删除用户成功');
        getUserPage();
    };

    const getIdentityRender = () => {
        return editUser?.userId == undefined ? (
            <>
                <Form.Select
                    field="userIdentityType"
                    label={{ text: '认证方式' }}
                    optionList={userIdentityOpts}
                    style={{ width: 270 }}
                    onChange={(val) => setUserIdentityType(val as UserIdentityType)}
                    rules={[{ required: true, message: '用户认证类型必填' }]}
                ></Form.Select>
                {userIdentityType == UserIdentityType.Password ? (
                    <Form.Input
                        field="credential"
                        mode="password"
                        label={{ text: <span>密码</span>, required: true }}
                        required
                        validate={validatePassword}
                    />
                ) : (
                    <Form.Input
                        field="credential"
                        label="凭证"
                        rules={[
                            { required: true, message: '凭证必填' },
                            { min: 5, message: '凭证长度不能小于5个字符' },
                        ]}
                    />
                )}
            </>
        ) : (
            <></>
        );
    };

    const validatePassword = (value: string) => {
        // 校验密码强度
        // 1. 必须同时包含大写字母、小写字母和数字，三种组合
        // 2. 长度在8-30之间
        if (!value) return '密码不能为空';
        const passwordReg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*$/;
        if (!passwordReg.test(value)) return '密码必须同时包含大写字母、小写字母和数字';
        if (value.length < 6 || value.length > 22) return '密码长度8-30位';
        return '';
    };

    return (
        <Content title="用户管理" icon={<IconAvatar />}>
            <div className="user-container">
                <div className="user-list">
                    <div className="user-list-bar">
                        <Form
                            layout="horizontal"
                            getFormApi={(formData) => setSearchForm(formData)}
                        >
                            <Form.Input
                                field="userId"
                                showClear
                                label="用户ID"
                                style={{ width: 190 }}
                            />
                            <Form.Input
                                field="username"
                                showClear
                                label="用户名"
                                style={{ width: 190 }}
                            />
                            <Form.Input
                                field="nickname"
                                showClear
                                label="昵称"
                                style={{ width: 190 }}
                            />
                            <Form.Input
                                field="email"
                                showClear
                                label="邮箱"
                                style={{ width: 190 }}
                            />
                            <Form.Input
                                field="phoneNumber"
                                showClear
                                label="电话"
                                style={{ width: 190 }}
                            />
                            <Form.Select
                                multiple
                                field="roles"
                                label={{ text: '角色' }}
                                style={{ width: 290 }}
                                optionList={roles}
                                showClear
                            ></Form.Select>
                            <Space
                                spacing="loose"
                                style={{ alignItems: 'flex-end', marginTop: 10 }}
                            >
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    onClick={() => getUserPage()}
                                >
                                    查询
                                </Button>

                                <Button
                                    icon={<IconPlusCircleStroked size="small" />}
                                    style={{ marginRight: 10 }}
                                    onClick={() => {
                                        handleEditUser();
                                        setEditModalTitle('新增用户');
                                    }}
                                >
                                    新增
                                </Button>
                            </Space>
                        </Form>
                    </div>
                    <div className="user-list-table">
                        <Table
                            showHeader={true}
                            loading={loading}
                            size="small"
                            columns={columns}
                            dataSource={users}
                            pagination={{
                                currentPage,
                                pageSize: pageSize,
                                total: userTotal,
                                onPageChange: handlePageChange,
                            }}
                        />
                    </div>
                </div>
                <Modal
                    title={editModalTitle}
                    visible={editVisible}
                    onOk={handleEditModalOk}
                    onCancel={() => setEditVisible(false)}
                    centered
                    bodyStyle={{ height: editModalHeight }}
                    style={{ width: 450 }}
                    okText={'保存'}
                >
                    <Form
                        labelPosition="left"
                        labelAlign="left"
                        labelWidth={90}
                        initValues={editUser}
                        getFormApi={(formData) => setEditForm(formData)}
                    >
                        <Form.Input
                            field="username"
                            label="用户名"
                            rules={[
                                { required: true, message: '用户名必填' },
                                { max: 20, message: '用户名长度不能超20个字符' },
                            ]}
                        />
                        <Form.Input
                            field="nickname"
                            label="昵称"
                            rules={[
                                { required: true, message: '用户昵称必填' },
                                { max: 20, message: '用户昵称长度不能超20个字符' },
                            ]}
                        />
                        <Form.Input field="email" label="邮箱" />
                        <Form.Input field="phoneNumber" label="电话" />

                        {getIdentityRender()}

                        <Form.Select
                            multiple
                            field="roles"
                            label={{ text: '角色' }}
                            optionList={roles}
                            showClear
                            style={{ width: 270 }}
                            rules={[
                                { required: true, message: '用户角色必填' },
                                {
                                    validator: (rule, value) =>
                                        value != undefined && value.length > 0,
                                    message: '用户角色至少选一个',
                                },
                            ]}
                        ></Form.Select>
                    </Form>
                </Modal>
            </div>
        </Content>
    );
};

export default Index;
