import { useState, useEffect } from 'react';
import * as signalR from '@microsoft/signalr';
import { useOnMountUnsafe } from './useOnMountUnsafe';

const baseURL = import.meta.env.VITE_BASE_API;

export function useSignalR(endpoint: string) {
    const [hubConnection, setHubConnection] = useState<signalR.HubConnection | null>(null);

    useOnMountUnsafe(() => {
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl(baseURL + endpoint)
            .withAutomaticReconnect()
            .build();

        setHubConnection(newConnection);
    });

    useEffect(() => {
        if (hubConnection) {
            hubConnection
                .start()
                .then(() => {
                    console.log('SignalR Connected!');
                })
                .catch((err) => {
                    console.log('SignalR Connection Error: ', err);
                });
        }

        return () => {
            if (hubConnection) {
                hubConnection
                    .stop()
                    .then(() => {
                        console.log('SignalR Disconnected!');
                    })
                    .catch((err) => {
                        console.log('SignalR Disconnection Error: ', err);
                    });
            }
        };
    }, [hubConnection]);

    return hubConnection;
}
