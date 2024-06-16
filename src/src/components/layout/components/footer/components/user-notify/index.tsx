import { FC, useState } from 'react';
import { format } from 'date-fns';
import {
    Tooltip,
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

import './index.scss';
import { UserNotifyModel } from '@src/common/model';

interface ComProps {}

const { Text } = Typography;

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

const Index: FC<ComProps> = ({}) => {
    const [notifyActiveKey, setNotifyActiveKey] = useState<string>('1');

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
                            type={notifyActiveKey == '1' ? 'primary' : 'tertiary'}
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
                                header={<Avatar size="small">{item.avatar}</Avatar>}
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
            </TabPane>
            <TabPane tab="点赞" itemKey="2">
                <div className="user-notify-list-wrap">{emptyRender}</div>
            </TabPane>
            <TabPane tab="通知" itemKey="3">
                <div className="user-notify-list-wrap">{emptyRender}</div>
            </TabPane>
        </Tabs>
    );
};

export default Index;
