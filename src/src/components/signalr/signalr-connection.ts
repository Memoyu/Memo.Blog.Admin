import * as signalR from '@microsoft/signalr';
import { store } from '@redux/store';
import { NOTIFICATION_HUB_ENDPOINT } from '@common/constant';
import { MessageType } from '../../common/model';
import { HubConnectionState } from '@microsoft/signalr';
const baseURL = import.meta.env.VITE_BASE_API;

class Connector {
    // private connection: signalR.HubConnection;
    // public receivedNotification: (
    //     onReceivedNotification: (title: MessageType, content: string) => void
    // ) => void;

    static instance: Connector;
    constructor() {
        // this.connection = new signalR.HubConnectionBuilder()
        //     .withUrl(baseURL + NOTIFICATION_HUB_ENDPOINT, {
        //         accessTokenFactory: () => {
        //             const token = store.getState().userLogin?.token;
        //             return token;
        //         },
        //     })
        //     .withAutomaticReconnect()
        //     .build();
        // this.connection.start().catch((err) => console.log('signalr 启动失败：', err));
        // console.log('构建连接');
        // this.receivedNotification = (onReceivedNotification) => {
        //     console.log('注册消息提醒');
        //     this.connection.on('ReceivedNotification', (type, content) => {
        //         onReceivedNotification(type, content);
        //         console.log('触发消息提醒');
        //     });
        // };
    }

    // public start = () => {
    //     this.connection.start().catch((err) => console.log('signalr 启动失败：', err));
    // };

    // public stop = () => {
    //     // console.log('停止连接');
    //     this.connection.off('ReceivedNotification');
    //     this.connection.stop().catch((err) => console.log('signalr 停止失败：', err));
    // };

    // public sendAllMessage = (messages: string) => {
    //     this.connection.send('sendAllMessage', messages).then((x) => console.log('sent'));
    // };

    // public sendUserMessage = (to: number, messages: string) => {
    //     this.connection.send('sendUserMessage', to, messages).then((x) => console.log('sent'));
    // };

    // public static getInstance(): Connector {
    //     if (!Connector.instance) Connector.instance = new Connector();
    //     return Connector.instance;
    // }
}

// export default Connector.getInstance;
