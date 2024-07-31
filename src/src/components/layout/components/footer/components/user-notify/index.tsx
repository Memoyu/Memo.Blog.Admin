import { FC, useRef, useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Button, Avatar, Badge, Tabs, TabPane, List, Typography, Toast } from '@douyinfe/semi-ui';
import ListEmpty from '@src/components/list-empty';

import { useOnMountUnsafe } from '@src/hooks/useOnMountUnsafe';
import { useData } from '@src/hooks/useData';
import useNotificationStore from '@stores/useNotificationStore';
import { shallow } from 'zustand/shallow';

import { messagePage, messageRead } from '@src/utils/request';

import {
    MessageType,
    UserMessageResult,
    CommentMessageResult,
    LikeMessageResult,
    MessagePageModel,
    MessagePageRequest,
} from '@src/common/model';
import { CLIENT_ARTICLE_DETAIL_URL } from '@src/common/constant';

import './index.scss';

interface MessageShowModel {
    messageId: string;
    isRead: boolean;
    avatar: string;
    title: string;
    content: string;
    date: Date;
    link: string;
}

interface ComProps {}

const { Text, Paragraph } = Typography;

const Index: FC<ComProps> = ({}) => {
    const setTypeUnreadNum = useNotificationStore((state) => state.setTypeUnreadNum);
    const unreadNum = useNotificationStore((state) => state.unreadNum, shallow);
    const readMessage = useNotificationStore((state) => state.readMessage);

    const pageSize = 15;
    const [_, messageShowLoading, _set, setMessageShowLoading] = useData<Array<MessageShowModel>>();

    const [messageShows, setMessageShows] = useState<Array<MessageShowModel>>();

    const messageShowNoMoreRef = useRef<boolean>(true);
    const messageShowPageRef = useRef<number>(1);
    const tabActive = useRef<number>(MessageType.Comment);

    const getMessagePage = (type: MessageType) => {
        setMessageShowLoading(true);

        let request = {
            type: type,
            page: messageShowPageRef.current,
            size: pageSize,
        } as MessagePageRequest;
        messagePage(request)
            .then((res) => {
                if (!res.isSuccess || !res.data) return;

                let items = res.data.items;

                var messages: Array<MessageShowModel> =
                    messageShowPageRef.current == 1 ? [] : (messageShows ?? []);
                items.forEach((m) => {
                    messages.push(getMessageShow(m));
                });
                messageShowNoMoreRef.current = messages.length >= res.data.total;
                setMessageShows(messages);
                setTypeUnreadNum(request.type, res.data.unReads);
            })
            .finally(() => setMessageShowLoading(false));
    };

    useEffect(() => {
        const unsubNotification = useNotificationStore.subscribe(
            (state) => state.notifications,
            (notifications, _) => {
                if (notifications.length < 1) return;
                let notification = notifications[0];
                // console.log(tabActive.current, notification.type);
                if (tabActive.current != notification.type) return; // 推送的消息不是当前选中的tab
                setMessageShows((ms) => {
                    if (!ms) ms = [];
                    ms.unshift(
                        getMessageShow({
                            messageId: notification.messageId,
                            messageType: notification.type,
                            content: notification.content,
                            createTime: new Date(),
                        } as MessagePageModel)
                    );
                    return [...ms];
                });
            }
        );

        const unsubReadMessage = useNotificationStore.subscribe(
            (state) => state.readMessageId,
            (id, _) => {
                if (id.length < 1) return;
                setMessageShows((ms) => {
                    if (!ms) return;
                    try {
                        ms.map((m) => {
                            if (m.messageId == id) {
                                m.isRead = true;
                                throw '成功已读';
                            }
                        });
                    } catch {}
                    return [...ms];
                });
            }
        );

        return () => {
            unsubNotification();
            unsubReadMessage();
        };
    }, []);

    useOnMountUnsafe(() => {
        getMessagePage(MessageType.Comment);
    });

    // 构建消息提醒内容
    const getMessageShow = (message: MessagePageModel) => {
        let show: MessageShowModel = {
            messageId: message.messageId,
            isRead: message.isRead,
            avatar: '',
            title: '',
            content: '',
            date: message.createTime,
            link: '',
        };
        switch (message.messageType) {
            case MessageType.User:
                let userMessage: UserMessageResult = JSON.parse(message.content);
                show.avatar = userMessage.userAvatar;
                show.title = `${userMessage.userNickname} 发来消息：`;
                show.content = userMessage.content;
                break;
            case MessageType.Comment:
                let commentMessage: CommentMessageResult = JSON.parse(message.content);
                show.avatar = commentMessage.visitorAvatar;
                show.title = `${commentMessage.visitorNickname} 评论文章: [${commentMessage.title}]`;
                show.content = commentMessage.content;
                show.link = CLIENT_ARTICLE_DETAIL_URL + commentMessage.belongId;
                break;
            case MessageType.Like:
                let likeMessage: LikeMessageResult = JSON.parse(message.content);
                show.avatar = likeMessage.visitorAvatar;
                show.title = `${likeMessage.visitorNickname} 点赞文章: [${likeMessage.title}]`;
                show.link = CLIENT_ARTICLE_DETAIL_URL + likeMessage.belongId;
                break;
        }
        return show;
    };

    // tab 切换
    const handleTabChange = (key: string) => {
        let type: MessageType = Number(key);
        tabActive.current = type;
        messageShowPageRef.current = 1;
        messageShowNoMoreRef.current = false;
        // 清空
        setMessageShows([]);
        getMessagePage(type);
    };

    // 【全部已读】触发，已读当前选选中的类型消息
    const handleAllReadClick = () => {
        let type: MessageType = tabActive.current;
        messageRead({ type }).then((res) => {
            if (!res.isSuccess) {
                Toast.error('操作失败：' + res.message);
                return;
            }

            Toast.success('已全部已读');
            getMessagePage(type);
        });
    };

    // 触发查看消息详情，并已读消息
    const handleReadMessageClick = (messageId: string) => {
        let type: MessageType = tabActive.current;
        readMessage(type, messageId);
    };

    const tabTitleRender = (key: MessageType, title: string, num: number) => (
        <Badge count={num == 0 ? undefined : num}>
            <Text
                strong={tabActive.current == key}
                type={tabActive.current == key ? 'primary' : 'tertiary'}
            >
                {title}
            </Text>
        </Badge>
    );

    const loadMoreMessageShowRender =
        !messageShowLoading && !messageShowNoMoreRef.current ? (
            <div
                style={{
                    textAlign: 'center',
                    marginTop: 12,
                    height: 32,
                    lineHeight: '32px',
                }}
            >
                <Button
                    onClick={() => {
                        messageShowPageRef.current += 1;
                        let type: MessageType = tabActive.current;
                        getMessagePage(type);
                    }}
                >
                    显示更多
                </Button>
            </div>
        ) : null;

    const listContentRender = (
        <>
            {(!messageShows || messageShows.length < 1) && !messageShowLoading ? (
                <div className="user-notify-list-wrap">
                    <ListEmpty />
                </div>
            ) : (
                <div className="user-notify-list-wrap">
                    <List
                        loading={messageShowLoading}
                        loadMore={loadMoreMessageShowRender}
                        dataSource={messageShows}
                        emptyContent={<ListEmpty />}
                        renderItem={(item) => (
                            <List.Item
                                style={{ padding: 5 }}
                                header={
                                    <Badge dot={!item.isRead}>
                                        <Avatar size="small" src={item.avatar} />
                                    </Badge>
                                }
                                main={
                                    <div>
                                        <Text
                                            strong
                                            link={
                                                item.link.length > 1 && {
                                                    href: item.link,
                                                    target: '_blank',
                                                }
                                            }
                                            onClick={() =>
                                                item.isRead
                                                    ? () => {}
                                                    : handleReadMessageClick(item.messageId)
                                            }
                                        >
                                            {item.title}
                                        </Text>
                                        {item.content.length > 1 && (
                                            <Paragraph
                                                ellipsis={{
                                                    rows: 2,
                                                    expandable: true,
                                                    collapsible: true,
                                                    collapseText: '收起',
                                                }}
                                                style={{ width: 280, marginLeft: 10 }}
                                            >
                                                {item.content}
                                            </Paragraph>
                                        )}
                                        <div
                                            style={{
                                                marginTop: 10,
                                                alignItems: 'center',
                                            }}
                                        >
                                            <Text type="tertiary" style={{ float: 'right' }}>
                                                {format(item.date, 'yyyy-MM-dd HH:mm')}
                                            </Text>
                                        </div>
                                    </div>
                                }
                            />
                        )}
                    />
                </div>
            )}
        </>
    );

    return (
        <Tabs
            size="small"
            defaultActiveKey={tabActive.current.toString()}
            onChange={handleTabChange}
            tabBarExtraContent={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Text onClick={handleAllReadClick} link>
                        全部已读
                    </Text>
                    {/* <Button onClick={handleAllReadClick}>全部已读</Button> */}
                </div>
            }
        >
            <TabPane
                tab={tabTitleRender(MessageType.Comment, '评论', unreadNum.comment)}
                itemKey={MessageType.Comment.toString()}
            >
                {listContentRender}
            </TabPane>
            <TabPane
                tab={tabTitleRender(MessageType.Like, '点赞', unreadNum.like)}
                itemKey={MessageType.Like.toString()}
            >
                {listContentRender}
            </TabPane>
            <TabPane
                tab={tabTitleRender(MessageType.User, '消息', unreadNum.user)}
                itemKey={MessageType.User.toString()}
            >
                {listContentRender}
            </TabPane>
        </Tabs>
    );
};

export default Index;
