import React, { useState } from 'react';
import { format } from 'date-fns';
import { IconAvatar } from '@douyinfe/semi-icons-lab';
import { IconPlusCircleStroked, IconSend } from '@douyinfe/semi-icons';
import {
    Button,
    Table,
    Space,
    Avatar,
    Typography,
    Modal,
    Form,
    Row,
    Col,
    Popconfirm,
    TagGroup,
    Toast,
    Tag,
} from '@douyinfe/semi-ui';

import Content from '@src/components/page-content';
import UploadImage from '@src/components/upload-image';

import { useOnMountUnsafe } from '@src/hooks/useOnMountUnsafe';
import { useData } from '@src/hooks/useData';
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
    UserSelectModel,
} from '@src/common/model';

import {
    userPage,
    userCreate,
    userGet,
    userDelete,
    userUpdate,
    roleList,
    userChangePassword,
    userSelectList,
    messageCreate,
} from '@src/utils/request';

import './index.scss';
import { userIdentityOpts } from '@src/common/select-options';

const { Text } = Typography;

const Index: React.FC = () => {
    const columns: ColumnProps[] = [
        {
            title: 'ID',
            align: 'center',
            dataIndex: 'userId',
            width: 165,
        },
        {
            title: '头像',
            align: 'center',
            dataIndex: 'avatar',
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
            width: 230,
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
                        <Button
                            theme="borderless"
                            type="warning"
                            size="small"
                            onClick={() => handleUserChangePassword(user.userId)}
                        >
                            修改密码
                        </Button>
                        {/* 非初始化的管理员才展示删除 */}
                        {
                            <Popconfirm
                                position="left"
                                title="确定是否要删除此用户？"
                                onConfirm={() => handleDeleteUser(user.userId)}
                            >
                                <Button theme="borderless" type="danger" size="small">
                                    删除
                                </Button>
                            </Popconfirm>
                        }
                    </Space>
                );
            },
        },
    ];

    const initEditModalHeight = 380;

    const pageSize = 15;
    const [currentPage, setCurrentPage] = useState(1);
    const [userTotal, setUserTotal] = useState(1);
    const [searchForm, setSearchForm] = useState<FormApi>();
    const [users, loading, setUsers, setLoading] = useData<Array<UserPageModel>>();
    const [roles, setRoles] = useState<Array<OptionProps>>();

    const [editModalTitle, setEditModalTitle] = useState<string>();
    const [editModalHeight, setEditModalHeight] = useState<number>(initEditModalHeight);
    const [_key, _setKey, editVisible, setEditVisible, _setEditModal] = useModal();
    const [
        _changePasswordKey,
        _setChangePasswordKey,
        changePasswordVisible,
        setChangePasswordVisible,
        _setChangePasswordModal,
    ] = useModal();
    const [editForm, setEditForm] = useState<FormApi>();
    const [changePasswordForm, setChangePasswordForm] = useState<FormApi>();
    const [editUser, setEditUser] = useState<UserEditRequest>();
    const [userAvatar, setUserAvatar] = useState<string>();

    const [userIdentityType, setUserIdentityType] = useState<UserIdentityType>(
        UserIdentityType.Password
    );

    const [sendMessageVisible, setSendMessageVisible] = useState<boolean>(false);
    const [messageForm, setMessageForm] = useState<FormApi>();
    const [userSelects, setUserSelects] = useState<Array<UserSelectModel>>();

    // 获取用户分页
    let getUserPage = (page: number = 1) => {
        setLoading(true);
        setCurrentPage(page);

        let search = searchForm?.getValues();

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
                if (!res.isSuccess || !res.data) {
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
                avatar: userAvatar,
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

    // 变更密码
    const handleChangePasswordModalOk = async () => {
        changePasswordForm?.validate().then(async (form) => {
            let pw = form.password;
            let cpw = form.confirmPassword;
            if (pw != cpw) {
                Toast.error('输入两次密码不一致，请确认后再提交');
                return;
            }
            let userId = editUser?.userId;
            if (userId) {
                let res = await userChangePassword(userId, pw);
                if (!res.isSuccess) {
                    Toast.error(res.message);
                    return;
                }
                Toast.success('变更用户密码成功');
                setChangePasswordVisible(false);
            }
        });
    };

    // 发送消息 按下
    const handleSendMessageClick = () => {
        userSelectList({}).then((res) => {
            if (!res.isSuccess || !res.data) return;

            // let opts: Array<OptionProps> = [];

            // res.data.map((u) => {
            //     opts.push({ value: u.userId, label: `${u.nickname}(${u.username})` });
            // });
            setUserSelects(res.data);
        });

        setSendMessageVisible(true);
    };

    // 消息发送
    const handleSendMessageModalOk = () => {
        messageForm?.validate().then(async (form) => {
            let users = form.users;
            let message = form.message;
            if (!users || users.length < 1) {
                Toast.error('请选择接收用户');
                return;
            }

            if (!message || message.length < 1) {
                Toast.error('请输入消息内容');
                return;
            }

            if (message.length > 150) {
                Toast.error('消息内容过长，请注意字数');
                return;
            }

            messageCreate({ toUsers: users, content: message }).then((res) => {
                if (!res.isSuccess) {
                    Toast.error(res.message);
                    return;
                }

                Toast.success('发送成功');
                setSendMessageVisible(false);
            });
        });
    };

    // 触发编辑用户信息
    const handleEditUser = async (userId?: string) => {
        getRoleList();

        let user: UserEditRequest = {
            username: '',
            nickname: '',
            avatar: undefined,
            roles: [],
            userIdentityType: UserIdentityType.Password,
            identifier: '',
            credential: '',
        };
        setEditModalHeight(initEditModalHeight);

        if (userId) {
            let res = await userGet(userId);
            if (!res.isSuccess || !res.data) {
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
                avatar: res.data.avatar,
                email: res.data.email,
                phoneNumber: res.data.phoneNumber,
                roles: roleIds,
                userIdentityType: res.data.userIdentity.identityType,
                identifier: res.data.userIdentity.identifier,
                credential: res.data.userIdentity.credential,
            } as UserEditRequest;
            setEditModalHeight(280);
        }

        // console.log(user);
        setUserAvatar(user.avatar);
        setUserIdentityType(user.userIdentityType);
        setEditUser(user);
        setEditVisible(true);
    };

    // 触发变更用户密码
    const handleUserChangePassword = async (userId?: string) => {
        let res = await userGet(userId);
        if (!res.isSuccess || !res.data) {
            Toast.error(res.message);
            return;
        }

        var user = res.data;
        if (user.userIdentity.identityType != UserIdentityType.Password) {
            Toast.warning('用户并非使用密码认证，无法变更密码');
            return;
        }

        setEditUser({ userId: user.userId } as UserEditRequest);
        setChangePasswordVisible(true);
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

    // 根据选择用户认证方式渲染内容
    const getIdentityRender = () => {
        return editUser?.userId == undefined ? (
            <Row gutter={20}>
                <Col span={12}>
                    <Form.Select
                        field="userIdentityType"
                        label={{ text: '认证' }}
                        optionList={userIdentityOpts}
                        style={{ width: 270 }}
                        onChange={(val) => setUserIdentityType(val as UserIdentityType)}
                        rules={[{ required: true, message: '用户认证类型必填' }]}
                    />
                </Col>
                <Col span={12}>
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
                </Col>
            </Row>
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

    const renderMultipleWithCustomTag = (
        optionNode: Record<string, any>,
        props: { onClose: any }
    ) => {
        const content = (
            <Tag
                avatarSrc={optionNode.avatar}
                avatarShape="circle"
                closable={true}
                onClose={props.onClose}
                size="large"
            >
                {optionNode.username}
            </Tag>
        );
        return {
            isRenderInTag: false,
            content,
        };
    };

    const renderCustomOption = (item: UserSelectModel, _index: number) => {
        const optionStyle = {
            display: 'flex',
            paddingLeft: 24,
            paddingTop: 10,
            paddingBottom: 10,
        };
        return (
            <Form.Select.Option
                value={item.userId}
                style={optionStyle}
                showTick={true}
                {...item}
                key={item.userId}
            >
                <Avatar size="small" src={item.avatar} />
                <div style={{ marginLeft: 8 }}>
                    <div style={{ fontSize: 14 }}>{item.nickname}</div>
                    <div
                        style={{
                            color: 'var(--color-text-2)',
                            fontSize: 12,
                            lineHeight: '16px',
                            fontWeight: 'normal',
                        }}
                    >
                        {item.username}
                    </div>
                </div>
            </Form.Select.Option>
        );
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
                            <Form.Input field="userId" showClear label="用户ID" />
                            <Form.Input field="username" showClear label="用户名" />
                            <Form.Input field="nickname" showClear label="昵称" />
                            <Form.Input field="email" showClear label="邮箱" />
                            <Form.Input field="phoneNumber" showClear label="电话" />
                            <Form.Select
                                multiple
                                field="roles"
                                label={{ text: '角色' }}
                                style={{ width: 290 }}
                                optionList={roles}
                                showClear
                            />
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

                                <Button
                                    type="primary"
                                    icon={<IconSend size="small" />}
                                    onClick={handleSendMessageClick}
                                >
                                    发送消息
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

                {/* 编辑用户信息 */}
                <Modal
                    title={editModalTitle}
                    visible={editVisible}
                    onOk={handleEditModalOk}
                    onCancel={() => setEditVisible(false)}
                    centered
                    bodyStyle={{ height: editModalHeight }}
                    style={{ width: 650 }}
                    okText={'保存'}
                >
                    <Form
                        labelPosition="left"
                        labelAlign="left"
                        // labelWidth={70}
                        initValues={editUser}
                        getFormApi={(formData) => setEditForm(formData)}
                    >
                        <Row>
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    marginBottom: 20,
                                }}
                            >
                                <UploadImage
                                    type="avatar"
                                    url={userAvatar}
                                    path="account/avatar"
                                    onSuccess={setUserAvatar}
                                />
                            </div>
                        </Row>
                        <Row gutter={20}>
                            <Col span={12}>
                                <Form.Input
                                    field="username"
                                    label="用户名"
                                    rules={[
                                        { required: true, message: '用户名必填' },
                                        { max: 20, message: '用户名长度不能超20个字符' },
                                    ]}
                                />
                            </Col>
                            <Col span={12}>
                                <Form.Input
                                    field="nickname"
                                    label="昵称"
                                    rules={[
                                        { required: true, message: '用户昵称必填' },
                                        { max: 20, message: '用户昵称长度不能超20个字符' },
                                    ]}
                                />
                            </Col>
                        </Row>

                        <Row gutter={20}>
                            <Col span={12}>
                                <Form.Input field="email" label="邮箱" />
                            </Col>
                            <Col span={12}>
                                <Form.Input field="phoneNumber" label="电话" />
                            </Col>
                        </Row>

                        {getIdentityRender()}

                        <Row gutter={20}>
                            <Col span={12}>
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
                                            validator: (_rule, value) =>
                                                value != undefined && value.length > 0,
                                            message: '用户角色至少选一个',
                                        },
                                    ]}
                                />
                            </Col>
                        </Row>
                    </Form>
                </Modal>

                {/* 变更密码 */}
                <Modal
                    title={'修改密码'}
                    visible={changePasswordVisible}
                    onOk={handleChangePasswordModalOk}
                    onCancel={() => setChangePasswordVisible(false)}
                    centered
                    okText={'变更'}
                >
                    <Form
                        labelPosition="left"
                        labelAlign="left"
                        getFormApi={(formData) => setChangePasswordForm(formData)}
                    >
                        <Form.Input
                            field="password"
                            mode="password"
                            label={{ text: <span>密码</span>, required: true }}
                            required
                            validate={validatePassword}
                        />

                        <Form.Input
                            field="confirmPassword"
                            mode="password"
                            label={{ text: <span>确认密码</span>, required: true }}
                            required
                            validate={validatePassword}
                        />
                    </Form>
                </Modal>

                {/* 发送消息 */}
                <Modal
                    title={'发送消息'}
                    visible={sendMessageVisible}
                    onOk={handleSendMessageModalOk}
                    onCancel={() => setSendMessageVisible(false)}
                    centered
                    okText={'发送'}
                >
                    <Form
                        labelPosition="top"
                        labelAlign="left"
                        getFormApi={(formData) => setMessageForm(formData)}
                    >
                        <Form.Select
                            field="users"
                            label={{ text: '接收用户', required: true }}
                            style={{ width: '100%' }}
                            multiple
                            renderSelectedItem={renderMultipleWithCustomTag}
                        >
                            {userSelects?.map((item, index) => renderCustomOption(item, index))}
                        </Form.Select>

                        <Form.TextArea
                            field="message"
                            // style={{ height: 150 }}
                            label={{ text: '消息', required: true }}
                            maxCount={150}
                            showClear
                        />
                    </Form>
                </Modal>
            </div>
        </Content>
    );
};

export default Index;
