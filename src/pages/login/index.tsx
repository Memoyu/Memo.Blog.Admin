import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Col, Form, Row, Toast, Typography } from '@douyinfe/semi-ui';
import { IconUser, IconKey } from '@douyinfe/semi-icons';
import { login as ToLogin, userGet } from '@utils/request';
import { useDispatch } from 'react-redux';
import { login, setUserInfo } from '@redux/slices/userSlice';

import './index.scss';

const { Text } = Typography;

const Index: React.FC = () => {
    const initUser = {
        username: 'memoyu',
        password: 'memoyu',
    };

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const submit = async (values: any) => {
        const loginRes = await ToLogin(values.username, values.password);
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

    const submitFail = (errors: any) => {
        console.log(errors);
        navigate(`/login${'?from=' + encodeURIComponent(location.pathname)}`, { replace: true });
    };

    return (
        <Row type="flex" justify="space-around" align="middle" className={'login-form'}>
            <Col span={6} style={{ padding: '2rem', border: '1px solid var(--semi-color-border)' }}>
                <Form
                    initValues={initUser}
                    // 数据验证成功后的回调函数
                    onSubmit={(values) => submit(values)}
                    // 数据验证失败后的回调函数
                    onSubmitFail={(errors) => submitFail(errors)}
                >
                    <h2>登录</h2>
                    <Form.Input
                        field={'username'}
                        label={<IconUser />}
                        placeholder={'请输入用户名'}
                        rules={[
                            { required: true, message: '用户名不能为空' },
                            { min: 4, message: '用户名格式错误' },
                        ]}
                    />
                    <Form.Input
                        field={'password'}
                        label={<IconKey />}
                        placeholder={'请输入密码'}
                        type={'password'}
                        rules={[
                            { required: true, message: '密码不能为空' },
                            { min: 4, message: '密码格式错误' },
                        ]}
                    />

                    <div style={{ marginTop: '2rem' }}>
                        <Button htmlType="submit" block theme={'solid'}>
                            登录
                        </Button>
                    </div>

                    <Row type={'flex'} justify="space-between" style={{ marginTop: '2rem' }}>
                        <Text></Text>
                        <Text>
                            无法登录？<Text link={{ href: 'https://semi.design/' }}>找回密码</Text>
                        </Text>
                    </Row>
                </Form>
            </Col>
        </Row>
    );
};

export default Index;
