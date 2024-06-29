import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconExit, IconGithubLogo, IconKanban, IconMoon, IconSun } from '@douyinfe/semi-icons';

import {
    Tooltip,
    Button,
    Avatar,
    Badge,
    Popover,
    Typography,
    Toast,
    Popconfirm,
} from '@douyinfe/semi-ui';

import { setLocalStorage, getLocalStorage } from '@src/utils/storage';
import { THEME_MODE } from '@common/constant';

import { useDispatch } from 'react-redux';
import { useTypedSelector } from '@src/hooks/useTypedSelector';
import { logout, toggleUserShow } from '@redux/slices/userSlice';

import './index.scss';

import Connector from '@common/signalr-connection';
import UserNotify from './components/user-notify';
import { useOnMountUnsafe } from '@src/hooks/useOnMountUnsafe';

const body = document.body;
const { Text } = Typography;

const Index = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const nickname = useTypedSelector((state) => state.userInfo.nickname);
    const avatar = useTypedSelector((state) => state.userInfo.avatar);
    const [isLight, setIsLight] = useState<boolean>(false);
    const [mode, setMode] = useState<string>(getLocalStorage(THEME_MODE) || 'light');

    const [notifyVisible, setNotifyVisible] = useState<boolean>(false);

    const { sendUserMessage, receivedNotification } = Connector();
    useOnMountUnsafe(() => {
        receivedNotification((title, content) => Toast.success(title + ': ' + content));
    });

    const switchMode = () => {
        sendUserMessage(8496611720691717, '这是一条指定发送用户的消息');

        let theme = mode == 'light' ? 'dark' : 'light';
        setThemeMode(theme);
    };

    const setThemeMode = (mode: string) => {
        if (mode == 'light') {
            body.removeAttribute(THEME_MODE);
        } else {
            body.setAttribute(THEME_MODE, mode);
        }

        setIsLight(mode == 'light');
        setMode(mode);
        setLocalStorage(THEME_MODE, mode);
    };

    // 展示用户信息
    const handelShowUser = async () => {
        dispatch(toggleUserShow(true));
    };

    // 退出登录
    const handelLogout = () => {
        dispatch(logout());
        navigate(`/login`, { replace: true });
    };

    useEffect(() => {
        setThemeMode(mode);
    }, []);

    return (
        <div className="footer-btn">
            <Popover
                position="top"
                visible={notifyVisible}
                trigger="custom"
                onVisibleChange={setNotifyVisible}
                showArrow
                content={
                    <div className="avatar-popover-content">
                        <div className="user-header">
                            <div className="user-header-info">
                                <Avatar
                                    className="avatar"
                                    color="orange"
                                    size="small"
                                    src={avatar}
                                    onClick={handelShowUser}
                                />
                                <Text strong style={{ marginLeft: 15 }}>
                                    {nickname}
                                </Text>
                            </div>
                            <div className="user-header-func">
                                <Popconfirm
                                    position="left"
                                    title="真的要离开嘛？"
                                    onConfirm={handelLogout}
                                >
                                    <Button icon={<IconExit />} size="default">
                                        退出
                                    </Button>
                                </Popconfirm>
                            </div>
                        </div>
                        <div className="user-notify">
                            <UserNotify />
                        </div>
                    </div>
                }
            >
                <Badge count={99}>
                    <Avatar
                        className="avatar"
                        color="orange"
                        size="small"
                        src={avatar}
                        onClick={() => setNotifyVisible((v) => !v)}
                    />
                </Badge>
            </Popover>

            <Tooltip content={`${isLight ? '暗色' : '亮色'}`}>
                <Button
                    className="other"
                    type={'tertiary'}
                    style={{ borderRadius: '50%' }}
                    theme={isLight ? 'solid' : 'light'}
                    icon={isLight ? <IconMoon /> : <IconSun />}
                    onClick={switchMode}
                />
            </Tooltip>

            <Tooltip content="客户端">
                <Avatar
                    className="other"
                    color="purple"
                    size="small"
                    onClick={() => window.open('http://blog.memoyu.com', '_blank')}
                >
                    <IconKanban />
                </Avatar>
            </Tooltip>

            <Tooltip content="开源">
                <Avatar
                    className="other"
                    color="orange"
                    size="small"
                    onClick={() =>
                        window.open('https://github.com/Memoyu/Memo.Blog.Admin', '_blank')
                    }
                >
                    <IconGithubLogo />
                </Avatar>
            </Tooltip>
        </div>
    );
};

export default Index;
