import { createWithEqualityFn } from 'zustand/traditional';
import { subscribeWithSelector } from 'zustand/middleware';
import { UnreadMessageNum, MessageType, NotificationStore } from '@src/common/model';
import { messageRead } from '@src/utils/request';

interface NotificationState {
    notifications: Array<NotificationStore>;
    unreadNum: UnreadMessageNum;
    readMessageId: string; // 当前要已读消息Id
    setUnreadNum: (unreadNum: UnreadMessageNum) => void;
    setTypeUnreadNum: (type: MessageType, num: number) => void; // 覆盖指定type 的 num
    incrementTypeUnreadNum: (type: MessageType, num: number) => void; // 增加指定type 的 num
    reduceTypeUnreadNum: (type: MessageType, num: number) => void; // 减少指定type 的 num
    readMessage: (type: MessageType, messageId: string) => void; // 查看消息详情
    Notification: (type: MessageType, messageId: string, content: string) => void; // 推送通知
}

const useNotificationStore = createWithEqualityFn<NotificationState>()(
    subscribeWithSelector((set, get) => ({
        notifications: [],
        unreadNum: { total: 0, user: 0, comment: 0, like: 0 },
        readMessageId: '',
        setUnreadNum: (unreadNum: UnreadMessageNum) => set({ unreadNum: unreadNum }),
        setTypeUnreadNum: (type: MessageType, num: number) => {
            let unreadNum = get().unreadNum;
            switch (type) {
                case MessageType.User:
                    unreadNum.user = num;
                    break;
                case MessageType.Comment:
                    unreadNum.comment = num;
                    break;
                case MessageType.Like:
                    unreadNum.like = num;
                    break;
            }

            unreadNum.total = unreadNum.user + unreadNum.comment + unreadNum.like;
            set({ unreadNum: unreadNum });
        },
        incrementTypeUnreadNum: (type: MessageType, num: number) => {
            let unreadNum = get().unreadNum;
            switch (type) {
                case MessageType.User:
                    unreadNum.user += num;
                    break;
                case MessageType.Comment:
                    unreadNum.comment += num;
                    break;
                case MessageType.Like:
                    unreadNum.like += num;
                    break;
            }
            unreadNum.total += num;
            set({ unreadNum: unreadNum });
        },
        reduceTypeUnreadNum: (type: MessageType, num: number) => {
            let unreadNum = get().unreadNum;
            switch (type) {
                case MessageType.User:
                    unreadNum.user -= num;
                    break;
                case MessageType.Comment:
                    unreadNum.comment -= num;
                    break;
                case MessageType.Like:
                    unreadNum.like -= num;
                    break;
            }
            unreadNum.total -= num;
            set({ unreadNum: unreadNum });
        },
        readMessage: (type: MessageType, messageId: string) => {
            messageRead({ messageIds: [messageId] }).then((_res) => {
                get().reduceTypeUnreadNum(type, 1);
                set({ readMessageId: messageId });
                // if (res.isSuccess) console.log('消息已读成功');
                // else console.log(res.message);
            });
        },
        Notification: (type: MessageType, messageId: string, content: string) => {
            // console.log('推送通知');
            let notifications = [];
            get().incrementTypeUnreadNum(type, 1);
            notifications.unshift({ type, messageId, content });
            set({ notifications: notifications });
        },
    }))
);

export default useNotificationStore;
