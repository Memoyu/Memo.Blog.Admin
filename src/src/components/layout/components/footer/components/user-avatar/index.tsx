import { FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Button,
    Avatar,
    Badge,
    Typography,
    Popover,
    Popconfirm,
    Notification,
} from '@douyinfe/semi-ui';
import { IconExit, IconLikeHeart, IconAt, IconSend } from '@douyinfe/semi-icons';

import UserNotify from '../user-notify';

import { useOnMountUnsafe } from '@src/hooks/useOnMountUnsafe';
import { useConnectionStore } from '@components/signalr/useSignalR';
import useUserStore from '@stores/useUserStore';
import useNotificationStore from '@stores/useNotificationStore';
import { shallow } from 'zustand/shallow';

import { unreadMessageGet } from '@src/utils/request';

import { CLIENT_ARTICLE_DETAIL_URL, CLIENT_MOMENT_LIST_URL } from '@common/constant';
import {
    MessageType,
    UserMessageResult,
    CommentMessageResult,
    LikeMessageResult,
    NotificationStore,
    BelongType,
} from '@src/common/model';

import './index.scss';

interface ComProps {}

const { Text } = Typography;

const Index: FC<ComProps> = ({}) => {
    const navigate = useNavigate();

    const { userInfo, toggleUserShow } = useUserStore.getState();
    const start = useConnectionStore((state) => state.start);

    const { setUnreadNum } = useNotificationStore.getState();
    const total = useNotificationStore((state) => state.unreadNum.total, shallow);

    const readMessage = useNotificationStore((state) => state.readMessage);

    const [notifyVisible, setNotifyVisible] = useState<boolean>(false);

    const getUnreadMessageNum = () => {
        unreadMessageGet().then((res) => {
            if (!res.isSuccess || !res.data) return;
            setUnreadNum(res.data);
        });
    };

    useEffect(() => {
        const unsub = useNotificationStore.subscribe(
            (state) => state.notifications,
            (notifications, _prevnNotifications) => {
                if (notifications.length < 1) return;
                let notification = notifications[0];

                // 推送通知
                Notification.info({
                    icon: getMessageIcon(notification.type),
                    title: getMessageTitle(notification.type),
                    content: getMessageContent(notification),
                    duration: 10,
                });
            }
        );
        return unsub;
    }, []);

    useOnMountUnsafe(() => {
        start();
        getUnreadMessageNum();
    });

    // 构建消息提醒图标
    const getMessageIcon = (type: MessageType) => {
        switch (type) {
            case MessageType.User:
                return <IconSend />;
            case MessageType.Comment:
                return <IconAt />;
            case MessageType.Like:
                return <IconLikeHeart />;
        }
    };

    // 构建消息提醒标题
    const getMessageTitle = (type: MessageType) => {
        switch (type) {
            case MessageType.User:
                return '收到用户发来消息';
            case MessageType.Comment:
                return '收到新评论';
            case MessageType.Like:
                return '收到新点赞';
        }
    };

    // 构建消息提醒内容
    const getMessageContent = (notification: NotificationStore) => {
        let type = notification.type;
        let message = notification.content;
        let title = '';
        let content = '';
        let link = '';

        switch (type) {
            case MessageType.User:
                let userMessage: UserMessageResult = JSON.parse(message);
                title = `${userMessage.userNickname} 发来消息：`;
                content = userMessage.content;
                break;
            case MessageType.Comment:
                let commentMessage: CommentMessageResult = JSON.parse(message);
                switch (commentMessage.commentType) {
                    case BelongType.Article:
                        title = `${commentMessage.visitorNickname} 评论文章: [${commentMessage.title}]`;
                        content = commentMessage.content;
                        link = CLIENT_ARTICLE_DETAIL_URL + commentMessage.belongId;
                        break;

                    case BelongType.Moment:
                        title = `${commentMessage.visitorNickname} 评论了动态！`;
                        content = commentMessage.content;
                        link = CLIENT_MOMENT_LIST_URL;
                        break;
                }
                break;
            case MessageType.Like:
                let likeMessage: LikeMessageResult = JSON.parse(message);
                switch (likeMessage.likeType) {
                    case BelongType.Article:
                        title = `${likeMessage.visitorNickname} 点赞文章: [${likeMessage.title}]`;
                        link = CLIENT_ARTICLE_DETAIL_URL + likeMessage.belongId;
                        break;

                    case BelongType.Moment:
                        title = `${likeMessage.visitorNickname} 点赞了动态！`;
                        link = CLIENT_MOMENT_LIST_URL;
                        break;
                }
                break;
        }

        return (
            <>
                <Text strong ellipsis={true} style={{ width: 330 }}>
                    {title}
                </Text>
                <br />
                {content.length > 1 && (
                    <Text ellipsis={true} style={{ width: 330, marginLeft: 10 }}>
                        {content}
                    </Text>
                )}
                {link.length > 1 && (
                    <div style={{ marginTop: 8 }}>
                        <Text
                            onClick={() => handleReadMessageClick(type, notification.messageId)}
                            link={{ href: link, target: '_blank' }}
                        >
                            查看详情
                        </Text>
                    </div>
                )}
            </>
        );
    };

    // 触发查看消息详情，并已读消息
    const handleReadMessageClick = (type: MessageType, messageId: string) => {
        readMessage(type, messageId);
    };

    // 展示用户信息
    const handelShowUser = async () => {
        toggleUserShow(true);
    };

    // 退出登录
    const handelLogout = () => {
        navigate(`/login`, { replace: true });
    };

    return (
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
                                src={userInfo?.avatar}
                                onClick={handelShowUser}
                            />
                            <Text strong style={{ marginLeft: 15 }}>
                                {userInfo?.nickname}
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
            <Badge count={total == 0 ? undefined : total}>
                <Avatar
                    className="avatar"
                    color="orange"
                    size="small"
                    src={userInfo?.avatar}
                    onClick={() => setNotifyVisible((v) => !v)}
                />
            </Badge>
        </Popover>
    );
};

export default Index;
