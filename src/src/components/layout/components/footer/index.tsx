import { useEffect, useState } from 'react';
import { IconGithubLogo, IconKanban, IconMoon, IconSun } from '@douyinfe/semi-icons';

import { Tooltip, Button, Avatar } from '@douyinfe/semi-ui';

import UserAvatar from './components/user-avatar';

import { shallow } from 'zustand/shallow';
import useTheme, { ThemeMode } from '@src/stores/useTheme';

import './index.scss';

const Index = () => {
    const theme = useTheme((state) => state.theme, shallow);
    const setTheme = useTheme((state) => state.setTheme);

    const [isLight, setIsLight] = useState<boolean>(false);

    const switchMode = () => {
        let mode: ThemeMode = theme == 'light' ? 'dark' : 'light';
        setThemeMode(mode);
    };

    const setThemeMode = (mode: ThemeMode) => {
        setTheme(mode);
        setIsLight(mode == 'light');
    };

    useEffect(() => {
        setThemeMode(theme);
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
