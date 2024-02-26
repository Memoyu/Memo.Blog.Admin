import { IconMoon, IconSun } from '@douyinfe/semi-icons';
import { Tooltip, Button, Dropdown, Avatar } from '@douyinfe/semi-ui';
import { useEffect, useState } from 'react';
import { setLocalStorage, getLocalStorage } from '@src/utils/storage';
import './index.scss';

const body = document.body;

const Index = () => {
    const [isLight, setIsLight] = useState<boolean>(false);
    const [mode, setMode] = useState<string>(getLocalStorage('theme-mode') as string);

    const switchMode = () => {
        let theme = mode == 'light' ? 'dark' : 'light';
        setThemeMode(theme);
    };

    const setThemeMode = (mode: string) => {
        if (mode == 'light') {
            body.removeAttribute('theme-mode');
        } else {
            body.setAttribute('theme-mode', mode);
        }

        setIsLight(mode == 'light');
        setMode(mode);
        setLocalStorage('theme-mode', mode);
    };

    useEffect(() => {
        setThemeMode(mode);
    }, []);

    return (
        <div className="footer-btn">
            <Tooltip content={`${isLight ? '暗色' : '亮色'}`}>
                <Button
                    type={'tertiary'}
                    style={{ borderRadius: '50%' }}
                    theme={isLight ? 'solid' : 'light'}
                    icon={isLight ? <IconMoon /> : <IconSun />}
                    onClick={switchMode}
                />
            </Tooltip>
            <Dropdown
                position={'top'}
                render={
                    <Dropdown.Menu>
                        <Dropdown.Item>退出登录</Dropdown.Item>
                    </Dropdown.Menu>
                }
            >
                <Avatar className="avatar" color="orange" size="small">
                    semi
                </Avatar>
            </Dropdown>
        </div>
    );
};

export default Index;
