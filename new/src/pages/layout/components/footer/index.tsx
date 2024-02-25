import { IconDesktop, IconMoon, IconSun } from '@douyinfe/semi-icons';
import { Button } from '@douyinfe/semi-ui';
import { useEffect, useState } from 'react';
import './index.scss';

const body = document.body;

const Index = () => {
    const [mode, setMode] = useState<string>(body.getAttribute('theme-mode') as string);
    const [mounted, setMounted] = useState(false);

    const switchMode = (mode: string) => {
        body.setAttribute('theme-mode', mode);
        setMode(mode);
    };
    // 避免按钮闪烁的问题
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <div className="footer-btn">
            <Button
                style={{ borderRadius: '50%' }}
                icon={<IconSun />}
                type={'tertiary'}
                theme={mode === 'light' ? 'solid' : 'borderless'}
                aria-label="浅色模式"
                onClick={() => switchMode('light')}
            ></Button>
            <Button
                type={'tertiary'}
                style={{ borderRadius: '50%' }}
                icon={<IconMoon />}
                theme={mode === 'dark' ? 'solid' : 'borderless'}
                aria-label="深色模式"
                onClick={() => switchMode('dark')}
            ></Button>
            <Button
                type={'tertiary'}
                style={{ borderRadius: '50%' }}
                icon={<IconDesktop />}
                theme={mode === 'system' ? 'solid' : 'borderless'}
                aria-label="系统设置"
                onClick={() => switchMode('system')}
            ></Button>
        </div>
    );
};

export default Index;
