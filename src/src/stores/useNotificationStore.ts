import { createWithEqualityFn } from 'zustand/traditional';
import { subscribeWithSelector } from 'zustand/middleware';
import { UnreadMessageNum, MessageType, NotificationStore } from '@src/common/model';

interface NotificationState {
    notifications: Array<NotificationStore>;
    unreadNum: UnreadMessageNum;
    setUnreadNum: (unreadNum: UnreadMessageNum) => void;
    setTypeUnreadNum: (type: MessageType, num: number) => void; // 覆盖指定type 的 num
    incrementTypeUnreadNum: (type: MessageType, num: number) => void; // 增加指定type 的 num
    Notification: (type: MessageType, messageId: string, content: string) => void; // 推送通知
}

const useNotificationStore = createWithEqualityFn<NotificationState>()(
    subscribeWithSelector((set, get) => ({
        notifications: [],
        unreadNum: { total: 0, user: 0, comment: 0, like: 0 },
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
        Notification: (type: MessageType, messageId: string, content: string) => {
            console.log('推送通知');
            let notifications = [];
            get().incrementTypeUnreadNum(type, 1);
            notifications.unshift({ type, messageId, content });
            set({ notifications: notifications });
        },
    }))
);

export default useNotificationStore;
