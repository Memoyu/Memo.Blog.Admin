import { useEffect, useState } from 'react';
import { IconGithubLogo, IconKanban, IconMoon, IconSun } from '@douyinfe/semi-icons';

import { Tooltip, Button, Avatar } from '@douyinfe/semi-ui';

import UserAvatar from './components/user-avatar';

import { setLocalStorage, getLocalStorage } from '@src/utils/storage';
import { THEME_MODE } from '@common/constant';

import './index.scss';

const body = document.body;

const Index = () => {
    const [isLight, setIsLight] = useState<boolean>(false);
    const [mode, setMode] = useState<string>(getLocalStorage(THEME_MODE) || 'light');

    const switchMode = () => {
        let theme = mode == 'light' ? 'dark' : 'light';
        setThemeMode(theme);
    };

    const setThemeMode = (mode: string) => {
        if (mode == 'light') {
            body.removeAttribute(THEME_MODE);
        } else {
            body.setAttribute(THEME_MODE, mode);
        }

        setIsLight(mode == 'light');
        setMode(mode);
        setLocalStorage(THEME_MODE, mode);
    };

    useEffect(() => {
        setThemeMode(mode);
    }, []);

    return (
        <div className="footer-btn">
            <UserAvatar />

            <Tooltip content={`${isLight ? '暗色' : '亮色'}`}>
                <Button
                    className="other"
                    type={'tertiary'}
                    style={{ borderRadius: '50%' }}
                    theme={isLight ? 'solid' : 'light'}
                    icon={isLight ? <IconMoon /> : <IconSun />}
                    onClick={switchMode}
                />
            </Tooltip>

            <Tooltip content="客户端">
                <Avatar
                    className="other"
                    color="purple"
                    size="small"
                    onClick={() => window.open('http://blog.memoyu.com', '_blank')}
                >
                    <IconKanban />
                </Avatar>
            </Tooltip>

            <Tooltip content="开源">
                <Avatar
                    className="other"
                    color="orange"
                    size="small"
                    onClick={() =>
                        window.open('https://github.com/Memoyu/Memo.Blog.Admin', '_blank')
                    }
                >
                    <IconGithubLogo />
                </Avatar>
            </Tooltip>
        </div>
    );
};

export default Index;
