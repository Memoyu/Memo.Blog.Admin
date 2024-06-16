import * as signalR from '@microsoft/signalr';
import { NOTIFICATION_HUB_ENDPOINT } from '@common/constant';
const baseURL = import.meta.env.VITE_BASE_API;

class Connector {
    private connection: signalR.HubConnection;
    public events: (onMessageReceived: (title: string, content: string) => void) => void;
    static instance: Connector;
    constructor() {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(baseURL + NOTIFICATION_HUB_ENDPOINT)
            .withAutomaticReconnect()
            .build();
        this.connection.start().catch((err) => document.write(err));

        this.events = (onMessageReceived) => {
            // this.connection.off('NewNotification');

            this.connection.on('NewNotification', (title, content) => {
                console.log(this.events);
                onMessageReceived(title, content);
            });
        };
    }

    public sendMessage = (messages: string) => {
        this.connection.send('sendMessage', messages).then((x) => console.log('sent'));
    };

    public static getInstance(): Connector {
        if (!Connector.instance) Connector.instance = new Connector();
        return Connector.instance;
    }
}

export default Connector.getInstance;
