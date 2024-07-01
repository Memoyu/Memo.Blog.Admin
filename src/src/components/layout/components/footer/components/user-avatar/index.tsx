import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Button,
    Avatar,
    Badge,
    Typography,
    Notification,
    Popover,
    Popconfirm,
} from '@douyinfe/semi-ui';
import { IconExit, IconLikeHeart, IconAt, IconSend } from '@douyinfe/semi-icons';

import UserNotify from '../user-notify';

import Connector from '@components/signalr/signalr-connection';

import { useOnMountUnsafe } from '@src/hooks/useOnMountUnsafe';
import { useDispatch } from 'react-redux';
import { incrementTypeNum, setUnreadMessageNum } from '@redux/slices/notificationSlice';
import { useTypedSelector } from '@src/hooks/useTypedSelector';
import { toggleUserShow } from '@redux/slices/userSlice';

import './index.scss';

import { unreadMessageGet } from '@src/utils/request';

import {
    MessageType,
    UserMessageResult,
    CommentMessageResult,
    LikeMessageResult,
} from '@src/common/model';

interface ComProps {}

const { Text } = Typography;

const Index: FC<ComProps> = ({}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [notifyVisible, setNotifyVisible] = useState<boolean>(false);

    const nickname = useTypedSelector((state) => state.userInfo.nickname);
    const avatar = useTypedSelector((state) => state.userInfo.avatar);
    const unreadMessageNum = useTypedSelector((state) => state.unreadMessageNum);

    const { receivedNotification } = Connector();

    const getUnreadMessageNum = () => {
        unreadMessageGet().then((res) => {
            if (!res.isSuccess || !res.data) return;
            dispatch(setUnreadMessageNum(res.data));
        });
    };

    useOnMountUnsafe(() => {
        receivedNotification((type, content) => {
            // 增加通知数量
            dispatch(incrementTypeNum({ num: 1, type }));

            // 推送通知
            Notification.info({
                icon: getMessageIcon(type),
                title: getMessageTitle(type),
                content: getMessageContent(type, content),
                duration: 0,
            });
        });

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
    const getMessageContent = (type: MessageType, content: string) => {
        switch (type) {
            case MessageType.User:
                let userMessage: UserMessageResult = JSON.parse(content);
                return (
                    <>
                        <Text strong>{userMessage.userNickname} 发来消息：</Text>
                        <br />
                        <Text ellipsis={true} style={{ width: 330 }}>
                            {userMessage.content}
                        </Text>
                    </>
                );
            case MessageType.Comment:
                let commentMessage: CommentMessageResult = JSON.parse(content);
                return (
                    <>
                        <Text strong ellipsis={true} style={{ width: 330 }}>
                            {commentMessage.visitorNickname} 评论文章: [{commentMessage.title}]
                        </Text>
                        <br />
                        <Text ellipsis={true} style={{ width: 330 }}>
                            {commentMessage.content}
                        </Text>
                    </>
                );
            case MessageType.Like:
                let likeMessage: LikeMessageResult = JSON.parse(content);
                return (
                    <Text strong ellipsis={true} style={{ width: 330 }}>
                        {likeMessage.visitorNickname} 点赞文章: {likeMessage.title}
                    </Text>
                );
        }
    };

    // 展示用户信息
    const handelShowUser = async () => {
        dispatch(toggleUserShow(true));
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
            <Badge count={unreadMessageNum.total == 0 ? undefined : unreadMessageNum.total}>
                <Avatar
                    className="avatar"
                    color="orange"
                    size="small"
                    src={avatar}
                    onClick={() => setNotifyVisible((v) => !v)}
                />
            </Badge>
        </Popover>
    );
};

export default Index;
