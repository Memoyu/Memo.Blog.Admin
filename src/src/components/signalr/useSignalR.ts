import { create } from 'zustand';
import * as signalR from '@microsoft/signalr';
import { Notification } from '@douyinfe/semi-ui';
import { NOTIFICATION_HUB_ENDPOINT, NOTIFICATION_METHOD_NAME } from '@common/constant';
import { HubConnection } from '@microsoft/signalr';

import { store } from '@redux/store';

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
                const token = store.getState().userLogin?.token;
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
        connect.on(NOTIFICATION_METHOD_NAME, (type, content) => {
            console.log('消息提醒触发');
            Notification.info({
                title: 'test',
                content: 'test-content',
                duration: 0,
            });
        });
    },
    stop: () => {
        let connect = get().connect;
        connect.off(NOTIFICATION_METHOD_NAME);
        connect.stop().catch((err) => console.log('signalr 停止失败：', err));
    },
}));
