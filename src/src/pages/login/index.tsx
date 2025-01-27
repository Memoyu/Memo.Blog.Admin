import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconUser, IconKey } from '@douyinfe/semi-icons';
import { Layout, Button, Card, Form, Toast, Typography } from '@douyinfe/semi-ui';

import { FormApi } from '@douyinfe/semi-ui/lib/es/form';

import { login as ToLogin, userGet } from '@utils/request';

import { useConnectionStore } from '@components/signalr/useSignalR';
import useUserStore from '@stores/useUserStore';

import './index.scss';
import { useOnMountUnsafe } from '@src/hooks/useOnMountUnsafe';
import useConfig from '@src/stores/useConfig';

const { Content, Footer } = Layout;
const { Title, Text } = Typography;

interface UserLogin {
    username: string;
    password: string;
}

const Index: React.FC = () => {
    const initUser: UserLogin = {
        username: '',
        password: '',
    };
    const visitor: UserLogin = {
        username: 'visitor',
        password: 'Visitor123',
    };

    const navigate = useNavigate();
    const initConfig = useConfig((state) => state.init);
    const { setUser, login, logout } = useUserStore.getState();

    const [loginForm, setLoginForm] = useState<FormApi<UserLogin>>();

    const { stop, start } = useConnectionStore((state) => state);

    useOnMountUnsafe(() => {
        logout();
        stop();
    });

    // 验证登录表单，并登录跳转
    let handlerLogin = async () => {
        if (!loginForm) {
            Toast.error('登录错误，请刷新当前页面后再试！');
            return;
        }

        let user = loginForm.getValues();
        // console.log(user);
        if (
            !user.username ||
            user.username?.length <= 0 ||
            !user.password ||
            user.password?.length <= 0
        ) {
            Toast.error('用户名或密码不能为空哟！');
            return;
        }

        handlerLoginAndNavigate(user.username, user.password);
    };

    // 登录并跳转
    let handlerLoginAndNavigate = async (username: string, passwprd: string) => {
        const loginRes = await ToLogin(username, passwprd);
        if (!loginRes.isSuccess || loginRes.data == undefined) {
            Toast.error(loginRes.message);
            return;
        }
        let token = loginRes.data;
        login(token);

        let userRes = await userGet();
        if (!userRes.isSuccess || userRes.data == undefined) {
            Toast.error(userRes.message);
            return;
        }
        let user = userRes.data;
        setUser(user);

        // 初始化配置
        initConfig();
        navigate(`/dashboard`, { replace: true });
        start();
    };

    return (
        <Layout>
            <Content
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    // backgroundImage: 'url(http://oss.blog.memoyu.com/statics/login-bg.jpg)',
                    // backgroundSize: '100%',
                    // backgroundAttachment: 'fixed',
                }}
            >
                <Card
                    title={<Title heading={3}>登录</Title>}
                    headerLine={false}
                    headerExtraContent={
                        <Button
                            theme="borderless"
                            onClick={() =>
                                handlerLoginAndNavigate(visitor.username, visitor.password)
                            }
                        >
                            游客登录
                        </Button>
                    }
                    style={{ minWidth: 380 }}
                >
                    <Form
                        labelPosition="left"
                        initValues={initUser}
                        getFormApi={(formData) => setLoginForm(formData)}
                    >
                        <Form.Input
                            field="username"
                            label={<IconUser />}
                            placeholder={'请输入用户名'}
                        />
                        <Form.Input
                            field="password"
                            label={<IconKey />}
                            placeholder={'请输入密码'}
                            mode="password"
                        />
                        <Button
                            style={{ marginTop: 20 }}
                            htmlType="submit"
                            block
                            theme="solid"
                            type="primary"
                            onClick={handlerLogin}
                        >
                            登录
                        </Button>
                    </Form>
                </Card>
            </Content>
            <Footer
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    paddingBottom: 10,
                }}
            >
                <Text type="quaternary" strong>
                    Copyright © 2024 Memoyu. Blog Admin
                </Text>
            </Footer>
        </Layout>
    );
};

export default Index;
