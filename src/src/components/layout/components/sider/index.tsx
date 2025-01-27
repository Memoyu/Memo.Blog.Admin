import { FC, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { Layout, Nav, Image } from '@douyinfe/semi-ui';
import configMenus, { MenuItem } from '@src/config/menus';

import './index.scss';
import logo from '@assets/logo.png';

const { Sider } = Layout;

function renderIcon(icon: any) {
    if (!icon) {
        return null;
    }
    return icon.render();
}

function findMenuByPath(menus: MenuItem[], path: string, keys: any[]): any {
    for (const menu of menus) {
        if (menu.path === path) {
            return [...keys, menu.itemKey];
        }
        if (menu.items && menu.items.length > 0) {
            const result = findMenuByPath(menu.items, path, [...keys, menu.itemKey]);
            if (result.length === 0) {
                continue;
            }
            return result;
        }
    }
    return [];
}

const Index: FC = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

    const menus = useMemo(() => {
        return configMenus.map((e) => {
            return {
                ...e,
                icon: e?.icon ? renderIcon(e.icon) : null,
                items: e?.items
                    ? e.items.map((m) => {
                          return {
                              ...m,
                              text: m.text,
                              icon: m.icon ? renderIcon(m.icon) : null,
                          };
                      })
                    : [],
            };
        });
    }, [configMenus]);

    const onSelect = (menu: MenuItem) => {
        setSelectedKeys([menu.itemKey]);
        navigate(menu.path as string);
    };
    const onCollapseChange = (isCollapsed: boolean) => {
        setIsCollapsed(isCollapsed);
    };

    function getNavItem(menu: MenuItem) {
        return (
            <Nav.Item
                indent={true}
                style={{ fontWeight: 'bold', fontSize: 15 }}
                key={menu.itemKey}
                itemKey={menu.itemKey}
                text={menu.text}
                icon={menu.icon}
                onClick={() => onSelect(menu)}
            ></Nav.Item>
        );
    }

    // setSelectedKeys 和 path 双向绑定
    useEffect(() => {
        const keys: string[] = findMenuByPath(configMenus, pathname, []);
        setSelectedKeys([keys.pop() as string]);
    }, [pathname]);

    return (
        <Sider className="layout-sider">
            <Nav
                className="layout-sider-navs"
                selectedKeys={selectedKeys}
                onCollapseChange={onCollapseChange}
            >
                <Nav.Header
                    className="layout-sider-navs-header"
                    logo={
                        <div className="layout-sider-navs-header-logo">
                            <Image preview={false} height={24} src={logo} />
                        </div>
                    }
                />
                <div className="layout-sider-navs-content">
                    {menus.map((sub: MenuItem) => (
                        <div key={sub.itemKey}>
                            {sub.path ? (
                                getNavItem(sub)
                            ) : isCollapsed ? (
                                <></>
                            ) : (
                                <div className="nav-sub">{sub.text}</div>
                            )}
                            {sub?.items?.map((item: MenuItem) => getNavItem(item))}
                        </div>
                    ))}
                </div>
                <Nav.Footer
                    className="layout-sider-navs-footer"
                    collapseButton={true}
                    collapseText={(isCollapsed) => <span>{isCollapsed ? '展开' : '收起'}</span>}
                />
            </Nav>
        </Sider>
    );
};

export default Index;
