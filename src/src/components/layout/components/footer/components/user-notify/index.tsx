import { FC, useRef, useState } from 'react';
import { format } from 'date-fns';
import {
    Button,
    Avatar,
    Badge,
    Tabs,
    TabPane,
    Empty,
    List,
    Typography,
    Toast,
} from '@douyinfe/semi-ui';

import { IllustrationIdle, IllustrationIdleDark } from '@douyinfe/semi-illustrations';

import { useOnMountUnsafe } from '@src/hooks/useOnMountUnsafe';
import { useData } from '@src/hooks/useData';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '@src/hooks/useTypedSelector';
import { setTypeNum } from '@redux/slices/notificationSlice';

import { messagePage, messageRead } from '@src/utils/request';

import {
    MessageType,
    UserMessageResult,
    CommentMessageResult,
    LikeMessageResult,
    MessagePageModel,
    MessagePageRequest,
    MessageReadRequest,
} from '@src/common/model';

import './index.scss';

interface MessageShowModel {
    messageId: string;
    isRead: boolean;
    avatar: string;
    title: string;
    content: string;
    date: Date;
}

interface ComProps {}

const { Text, Paragraph } = Typography;

const Index: FC<ComProps> = ({}) => {
    const dispatch = useDispatch();
    const [tabActiveKey, setTabActiveKey] = useState<string>(MessageType.Comment.toString());
    const unreadMessageNum = useTypedSelector((state) => state.unreadMessageNum);

    const pageSize = 15;
    const [messageShows, messageShowLoading, setMessageShows, setMessageShowLoading] =
        useData<Array<MessageShowModel>>();
    const messageShowNoMoreRef = useRef<boolean>(true);
    const messageShowPageRef = useRef<number>(1);

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
                    messageShowPageRef.current == 1 ? [] : messageShows ?? [];
                items.forEach((m) => {
                    messages.push(getMessageShow(m));
                });
                messageShowNoMoreRef.current = messages.length >= res.data.total;
                setMessageShows(messages);
                dispatch(setTypeNum({ num: res.data.unReads, type: request.type }));
            })
            .finally(() => setMessageShowLoading(false));
    };

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
                break;
            case MessageType.Like:
                let likeMessage: LikeMessageResult = JSON.parse(message.content);
                show.avatar = likeMessage.visitorAvatar;
                show.title = `${likeMessage.visitorNickname} 点赞文章: [${likeMessage.title}]`;
                break;
        }
        return show;
    };

    // tab 切换
    const handleTabChange = (key: string) => {
        setTabActiveKey(key);
        let type: MessageType = Number(key);
        messageShowPageRef.current = 1;
        messageShowNoMoreRef.current = false;
        getMessagePage(type);
    };

    // 【全部已读】触发，已读当前选选中的类型消息
    const handleAllReadClick = () => {
        let type: MessageType = Number(tabActiveKey);
        let request: MessageReadRequest = {
            type: type,
        };

        messageRead(request).then((res) => {
            if (!res.isSuccess) {
                Toast.error('操作失败：' + res.message);
                return;
            }

            Toast.success('已全部已读');
            getMessagePage(type);
        });
    };

    const emptyRender = (
        <div className="empty">
            <Empty
                image={<IllustrationIdle />}
                darkModeImage={<IllustrationIdleDark />}
                description={'空空如也！'}
            />
        </div>
    );

    const tabTitleRender = (key: MessageType, title: string, num: number) => (
        <Badge count={num == 0 ? undefined : num}>
            <Text
                strong={tabActiveKey == key.toString()}
                type={tabActiveKey == key.toString() ? 'primary' : 'tertiary'}
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
                        let type: MessageType = Number(tabActiveKey);
                        getMessagePage(type);
                    }}
                >
                    显示更多
                </Button>
            </div>
        ) : null;

    const listContentRender = (
        <>
            {!messageShows || messageShows.length < 1 ? (
                <div className="user-notify-list-wrap">{emptyRender}</div>
            ) : (
                <div className="user-notify-list-wrap">
                    <List
                        loading={messageShowLoading}
                        loadMore={loadMoreMessageShowRender}
                        dataSource={messageShows}
                        emptyContent={emptyRender}
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
                                        <Text strong>{item.title}</Text>
                                        <Paragraph ellipsis={true} style={{ width: 260 }}>
                                            {item.content}
                                        </Paragraph>

                                        <div
                                            style={{
                                                marginTop: 10,
                                                // display: 'flex',
                                                // justifyContent: 'space-between',
                                                alignItems: 'center',
                                            }}
                                        >
                                            {/* {!item.isRead && (
                                                <Button
                                                    style={{ float: 'left' }}
                                                    size="small"
                                                    theme="borderless"
                                                    onClick={() => {}}
                                                >
                                                    标为已读
                                                </Button>
                                            )} */}
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
            activeKey={tabActiveKey}
            onChange={handleTabChange}
            tabBarExtraContent={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Button onClick={handleAllReadClick}>全部已读</Button>
                </div>
            }
        >
            <TabPane
                tab={tabTitleRender(MessageType.Comment, '评论', unreadMessageNum.comment)}
                itemKey={MessageType.Comment.toString()}
            >
                {listContentRender}
            </TabPane>
            <TabPane
                tab={tabTitleRender(MessageType.Like, '点赞', unreadMessageNum.like)}
                itemKey={MessageType.Like.toString()}
            >
                {listContentRender}
            </TabPane>
            <TabPane
                tab={tabTitleRender(MessageType.User, '消息', unreadMessageNum.user)}
                itemKey={MessageType.User.toString()}
            >
                {listContentRender}
            </TabPane>
        </Tabs>
    );
};

export default Index;
