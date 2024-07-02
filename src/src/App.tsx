import { LocaleProvider, Notification } from '@douyinfe/semi-ui';
import { BrowserRouter } from 'react-router-dom';
import RenderRouter from './router';
import Connector from '@components/signalr/signalr-connection';
import { useConnectionStore } from '@components/signalr/useSignalR';

import './App.scss';

function App() {
    // const { receivedNotification } = Connector();
    // receivedNotification((type, content) => {
    //     // 推送通知
    //     Notification.info({
    //         title: 'test',
    //         content: 'test-content',
    //         duration: 0,
    //     });
    // });

    const start = useConnectionStore((state) => state.start);
    start();

    return (
        <LocaleProvider>
            <BrowserRouter>
                <RenderRouter />
            </BrowserRouter>
        </LocaleProvider>
    );
}

export default App;
