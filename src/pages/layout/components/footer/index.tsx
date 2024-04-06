import { IconMoon, IconSun } from '@douyinfe/semi-icons';
import { Tooltip, Button, Dropdown, Avatar } from '@douyinfe/semi-ui';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setLocalStorage, getLocalStorage } from '@src/utils/storage';
import { THEME_MODE } from '@common/constant';
import './index.scss';
import { useDispatch } from 'react-redux';
import { logout, toggleUserShow } from '@redux/slices/userSlice';
import { useTypedSelector } from '@src/hooks/useTypedSelector';

const body = document.body;

const Index = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const nickname = useTypedSelector((state) => state.userInfo.nickname);
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

    // 展示用户信息
    const handelShowUser = async () => {
        dispatch(toggleUserShow(true));
    };

    // 退出登录
    const handelLogout = () => {
        dispatch(logout());
        navigate(`/login`, { replace: true });
    };
    return (
        <div className="footer-btn">
            <Dropdown
                position={'top'}
                render={
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={handelShowUser}>{nickname}</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={handelLogout}>退出登录</Dropdown.Item>
                    </Dropdown.Menu>
                }
            >
                <Avatar className="avatar" color="orange" size="small">
                    semi
                </Avatar>
            </Dropdown>

            <Tooltip content={`${isLight ? '暗色' : '亮色'}`}>
                <Button
                    type={'tertiary'}
                    style={{ borderRadius: '50%' }}
                    theme={isLight ? 'solid' : 'light'}
                    icon={isLight ? <IconMoon /> : <IconSun />}
                    onClick={switchMode}
                />
            </Tooltip>
        </div>
    );
};

export default Index;
