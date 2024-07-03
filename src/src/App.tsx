import { LocaleProvider, Notification } from '@douyinfe/semi-ui';
import { BrowserRouter } from 'react-router-dom';
import RenderRouter from './router';

import './App.scss';

function App() {
    return (
        <LocaleProvider>
            <BrowserRouter>
                <RenderRouter />
            </BrowserRouter>
        </LocaleProvider>
    );
}

export default App;
