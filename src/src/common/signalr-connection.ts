import * as signalR from '@microsoft/signalr';
import { store } from '@redux/store';
import { NOTIFICATION_HUB_ENDPOINT } from '@common/constant';
import { MessageType } from './model';
const baseURL = import.meta.env.VITE_BASE_API;

class Connector {
    private connection: signalR.HubConnection;
    public receivedNotification: (
        onReceivedNotification: (title: MessageType, content: string) => void
    ) => void;

    static instance: Connector;
    constructor() {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(baseURL + NOTIFICATION_HUB_ENDPOINT, {
                accessTokenFactory: () => {
                    const token = store.getState().userLogin?.token;
                    return token;
                },
            })
            .withAutomaticReconnect()
            .build();
        this.connection.start().catch((err) => console.log(err));

        this.receivedNotification = (onReceivedNotification) => {
            // this.connection.off('ReceivedNotification');
            console.log('注册消息提醒');
            this.connection.on('ReceivedNotification', (type, content) => {
                onReceivedNotification(type, content);
                console.log('触发消息提醒');
            });
        };
    }

    public sendAllMessage = (messages: string) => {
        this.connection.send('sendAllMessage', messages).then((x) => console.log('sent'));
    };

    public sendUserMessage = (to: number, messages: string) => {
        this.connection.send('sendUserMessage', to, messages).then((x) => console.log('sent'));
    };

    public static getInstance(): Connector {
        if (!Connector.instance) Connector.instance = new Connector();
        return Connector.instance;
    }
}

export default Connector.getInstance;
