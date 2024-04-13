import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconUser, IconKey } from '@douyinfe/semi-icons';
import { Button, Card, Col, Form, Row, Toast, Typography } from '@douyinfe/semi-ui';

import { useDispatch } from 'react-redux';
import { login, setUserInfo } from '@redux/slices/userSlice';

import { FormApi } from '@douyinfe/semi-ui/lib/es/form';

import { login as ToLogin, userGet } from '@utils/request';

import './index.scss';

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
    const dispatch = useDispatch();
    const [loginForm, setLoginForm] = useState<FormApi<UserLogin>>();

    // 验证登录表单，并登录跳转
    let handlerLogin = async () => {
        if (!loginForm) {
            Toast.error('登录错误，请刷新当前页面后再试！');
            return;
        }

        let user = loginForm.getValues();
        console.log(user);
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
        dispatch(login(token.accessToken));

        let userRes = await userGet();
        if (!userRes.isSuccess || userRes.data == undefined) {
            Toast.error(userRes.message);
            return;
        }
        let user = userRes.data;
        dispatch(setUserInfo(user));

        navigate(`/dashboard`, { replace: true });
    };

    return (
        <Row type="flex" justify="space-around" align="middle" className={'login-form'}>
            <Col span={6}>
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
                >
                    <Form
                        labelPosition="left"
                        initValues={initUser}
                        getFormApi={(formData) => setLoginForm(formData)}
                    >
                        <Form.Input
                            field={'username'}
                            label={<IconUser />}
                            placeholder={'请输入用户名'}
                        />
                        <Form.Input
                            field={'password'}
                            label={<IconKey />}
                            placeholder={'请输入密码'}
                            type={'password'}
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
            </Col>
        </Row>
    );
};

export default Index;
