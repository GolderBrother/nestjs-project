import { Outlet, useLocation } from "react-router-dom";
import { Menu as AntdMenu, MenuProps } from 'antd';
import './index.css';
import { MenuClickEventHandler } from "rc-menu/lib/interface";
import router from "../../router";
import { useMemo } from "react";

// 定义路径常量
const PATHS = {
    FRIENDS: '/',
    GROUP: '/group',
    CHAT: '/chat',
    COLLECTION: '/collection',
    NOTIFICATION: '/notification'
};

// 定义枚举
const MenuKeys = {
    FRIENDS: '1',
    GROUP: '2',
    CHAT: '3',
    COLLECTION: '4',
    NOTIFICATION: '5'
};

const items: MenuProps['items'] = [
    { key: MenuKeys.FRIENDS, label: "好友" },
    { key: MenuKeys.GROUP, label: "群聊" },
    { key: MenuKeys.CHAT, label: "聊天" },
    { key: MenuKeys.COLLECTION, label: "收藏" },
    { key: MenuKeys.NOTIFICATION, label: "通知" }
];

const handleMenuItemClick: MenuClickEventHandler = (info) => {
    const pathMap = {
        [MenuKeys.FRIENDS]: PATHS.FRIENDS,
        [MenuKeys.GROUP]: PATHS.GROUP,
        [MenuKeys.CHAT]: PATHS.CHAT,
        [MenuKeys.COLLECTION]: PATHS.COLLECTION,
        [MenuKeys.NOTIFICATION]: PATHS.NOTIFICATION
    };
    const path = pathMap[info.key];
    if (path) {
        router.navigate(path);
    }
};

export function Menu() {
    const location = useLocation();

    const selectedKeys = useMemo(() => {
        const pathMap = {
            [PATHS.GROUP]: MenuKeys.GROUP,
            [PATHS.CHAT]: MenuKeys.CHAT,
            [PATHS.COLLECTION]: MenuKeys.COLLECTION,
            [PATHS.NOTIFICATION]: MenuKeys.NOTIFICATION
        };
        return [pathMap[location.pathname] || MenuKeys.FRIENDS];
    }, [location.pathname]);

    return (
        <div id="menu-container">
            <div className="menu-area">
                <AntdMenu
                    selectedKeys={selectedKeys}
                    items={items}
                    onClick={handleMenuItemClick}
                />
            </div>
            <div className="content-area">
                <Outlet />
            </div>
        </div>
    );
}