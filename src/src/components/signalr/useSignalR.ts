import { create } from 'zustand';
import * as signalR from '@microsoft/signalr';
import { NOTIFICATION_HUB_ENDPOINT, NOTIFICATION_METHOD_NAME } from '@common/constant';
import { HubConnection } from '@microsoft/signalr';
import useUserStore from '@stores/useUserStore';
import useNotificationStore from '@stores/useNotificationStore';
import { MessageType } from '@src/common/model';

export interface SignalRConnection {
    connect: HubConnection;
    start: () => void;
    stop: () => void;
}

const baseURL = import.meta.env.VITE_BASE_API;
export const useConnectionStore = create<SignalRConnection>((set, get) => ({
    connect: new signalR.HubConnectionBuilder()
        .withUrl(baseURL + NOTIFICATION_HUB_ENDPOINT, {
            accessTokenFactory: () => {
                const token = useUserStore.getState().token;
                return token;
            },
        })
        .withAutomaticReconnect()
        .build(),
    start: () => {
        let connect = get().connect;

        console.log('链接状态：', connect.state);
        if (connect.state != signalR.HubConnectionState.Disconnected) return;
        console.log('启动链接');
        connect.start().catch((err) => console.log('signalr 启动失败：', err));

        console.log('添加监听');
        connect.on(
            NOTIFICATION_METHOD_NAME,
            (type: MessageType, messageId: string, content: string) => {
                console.log('消息提醒触发', messageId);
                useNotificationStore.getState().Notification(type, messageId, content);
            }
        );
    },
    stop: () => {
        let connect = get().connect;
        connect.off(NOTIFICATION_METHOD_NAME);
        connect.stop().catch((err) => console.log('signalr 停止失败：', err));
    },
}));
