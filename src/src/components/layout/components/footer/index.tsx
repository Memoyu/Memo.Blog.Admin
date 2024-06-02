import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import {
    IconAt,
    IconExit,
    IconGithubLogo,
    IconKanban,
    IconMoon,
    IconSun,
} from '@douyinfe/semi-icons';
import { IllustrationIdle, IllustrationIdleDark } from '@douyinfe/semi-illustrations';

import {
    Tooltip,
    Button,
    Avatar,
    Badge,
    Popover,
    Typography,
    Tabs,
    TabPane,
    Empty,
    List,
} from '@douyinfe/semi-ui';

import { setLocalStorage, getLocalStorage } from '@src/utils/storage';
import { THEME_MODE } from '@common/constant';

import { useDispatch } from 'react-redux';
import { useTypedSelector } from '@src/hooks/useTypedSelector';
import { logout, toggleUserShow } from '@redux/slices/userSlice';

import './index.scss';
import { UserNotifyModel } from '@src/common/model';

const body = document.body;
const { Title, Text } = Typography;
const list: Array<UserNotifyModel> = [
    {
        avatar: '',
        title: 'title 评论了文章 xxxxxxx的快乐',
        content: '评论内容2221112',
        to: 'http://2222',
        date: new Date(),
        isRead: false,
    },
    {
        avatar: '',
        title: 'title2 评论了动态',
        content: '评论内容22222',
        to: 'http://2222',
        date: new Date(),
        isRead: false,
    },
    {
        avatar: '',
        title: 'title3 评论了关于',
        content: '评论内容444444',
        to: 'http://2222',
        date: new Date(),
        isRead: false,
    },
    {
        avatar: '',
        title: 'title4',
        content: '评论内容555555',
        to: 'http://2222',
        date: new Date(),
        isRead: false,
    },
    {
        avatar: '',
        title: 'title5',
        content: '评论内容558888885555',
        to: 'http://2222',
        date: new Date(),
        isRead: false,
    },
    {
        avatar: '',
        title: 'title6',
        content: '评论内容77777',
        to: 'http://2222',
        date: new Date(),
        isRead: false,
    },
    {
        avatar: '',
        title: 'title7',
        content: '评论内容550000005555',
        to: 'http://2222',
        date: new Date(),
        isRead: false,
    },
];

const Index = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const nickname = useTypedSelector((state) => state.userInfo.nickname);
    const avatar = useTypedSelector((state) => state.userInfo.avatar);
    const [isLight, setIsLight] = useState<boolean>(false);
    const [mode, setMode] = useState<string>(getLocalStorage(THEME_MODE) || 'light');

    const [notifyActiveKey, setNotifyActiveKey] = useState<string>('1');
    const [notifyVisible, setNotifyVisible] = useState<boolean>(false);

    const switchMode = () => {
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

    const emptyRender = (
        <div className="empty">
            <Empty
                image={<IllustrationIdle />}
                darkModeImage={<IllustrationIdleDark />}
                description={'空空如也！'}
            />
        </div>
    );

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
                                <Button icon={<IconExit />} size="default" onClick={handelLogout}>
                                    退出
                                </Button>
                            </div>
                        </div>
                        <div className="user-notify">
                            <Tabs
                                size="small"
                                activeKey={notifyActiveKey}
                                onChange={setNotifyActiveKey}
                                tabBarExtraContent={
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Button onClick={() => {}}>标为已读</Button>
                                    </div>
                                }
                            >
                                <TabPane
                                    tab={
                                        <Badge count={99}>
                                            <Text
                                                strong={notifyActiveKey == '1'}
                                                type={
                                                    notifyActiveKey == '1' ? 'primary' : 'tertiary'
                                                }
                                            >
                                                评论
                                            </Text>
                                        </Badge>
                                    }
                                    itemKey="1"
                                >
                                    <div className="user-notify-list-wrap">
                                        <List
                                            // loading={loading}
                                            // loadMore={loadMore}
                                            dataSource={list}
                                            emptyContent={emptyRender}
                                            renderItem={(item) => (
                                                <List.Item
                                                    style={{ padding: 5, width: '100%' }}
                                                    header={
                                                        <Avatar size="small">{item.avatar}</Avatar>
                                                    }
                                                    main={
                                                        <div style={{ width: '100%' }}>
                                                            <Text strong>{item.title}</Text>
                                                            <div>
                                                                <Text
                                                                    type="secondary"
                                                                    ellipsis={{
                                                                        rows: 2,
                                                                        showTooltip: {
                                                                            type: 'popover',
                                                                            opts: {
                                                                                style: {
                                                                                    width: 300,
                                                                                },
                                                                            },
                                                                        },
                                                                    }}
                                                                >
                                                                    {item.content}
                                                                </Text>
                                                            </div>
                                                            <div>
                                                                <Text
                                                                    type="tertiary"
                                                                    style={{ float: 'right' }}
                                                                >
                                                                    {format(
                                                                        item.date,
                                                                        'yyyy-MM-dd HH:mm'
                                                                    )}
                                                                </Text>
                                                            </div>
                                                        </div>
                                                    }
                                                />
                                            )}
                                        />
                                    </div>
                                </TabPane>
                                <TabPane tab="点赞" itemKey="2">
                                    <div className="user-notify-list-wrap">{emptyRender}</div>
                                </TabPane>
                                <TabPane tab="通知" itemKey="3">
                                    <div className="user-notify-list-wrap">{emptyRender}</div>
                                </TabPane>
                            </Tabs>
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
