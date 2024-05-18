import { Outlet, useLocation } from "react-router-dom";
import { Menu as AntdMenu, MenuProps } from 'antd';
import './menu.css';
import { useCallback, useMemo } from "react";
import router from "../../router";
const enum MenuItemKeyMap {
  MEETING_ROOM_MANAGE = 'meetingRoomManage',
  BOOKING_MANAGE = 'bookingManage',
  USER_MANAGE = 'userManage',
  STATISTICS = 'statistics',
};
const enum MenuItemKeyToPathMap {
  MEETING_ROOM_MANAGE = '/meeting_room_manage',
  BOOKING_MANAGE = '/booking_manage',
  USER_MANAGE = '/user_manage',
  STATISTICS = '/statistics',
};
const MenuItemPathToKeyMap = {
  [MenuItemKeyToPathMap.MEETING_ROOM_MANAGE]: MenuItemKeyMap.MEETING_ROOM_MANAGE,
  [MenuItemKeyToPathMap.BOOKING_MANAGE]: MenuItemKeyMap.BOOKING_MANAGE,
  [MenuItemKeyToPathMap.USER_MANAGE]: MenuItemKeyMap.USER_MANAGE,
  [MenuItemKeyToPathMap.STATISTICS]: MenuItemKeyMap.STATISTICS,
};
const items: MenuProps['items'] = [
  {
    key: MenuItemKeyMap.MEETING_ROOM_MANAGE,
    label: "会议室管理"
  },
  {
    key: MenuItemKeyMap.BOOKING_MANAGE,
    label: "预定管理"
  },
  {
    key: MenuItemKeyMap.USER_MANAGE,
    label: "用户管理"
  },
  {
    key: MenuItemKeyMap.STATISTICS,
    label: "统计"
  }
];
type ItemType = MenuProps['items'] extends Array<infer T> ? T : Record<string, any>;

// MenuClickEventHandler
export function Menu() {
  const handleMenuItemClick = useCallback((info: ItemType) => {
    let path = '';
    switch (info.key) {
      case MenuItemKeyMap.MEETING_ROOM_MANAGE:
        path = MenuItemKeyToPathMap.MEETING_ROOM_MANAGE;
        break;
      case MenuItemKeyMap.BOOKING_MANAGE:
        path = MenuItemKeyToPathMap.BOOKING_MANAGE;
        break;
      case MenuItemKeyMap.USER_MANAGE:
        path = MenuItemKeyToPathMap.USER_MANAGE;
        break;
      case MenuItemKeyMap.STATISTICS:
        path = MenuItemKeyToPathMap.STATISTICS;
        break;
    }
    router.navigate(path);
  }, []);
  const location = useLocation();
  const defaultSelectedKeys = useMemo(() => {
    const path = location.pathname as string;
    const selectedKeys = (MenuItemPathToKeyMap as Record<string, MenuItemKeyMap>)[path] ? [(MenuItemPathToKeyMap as Record<string, MenuItemKeyMap>)[path]] : [MenuItemKeyToPathMap.MEETING_ROOM_MANAGE];
    return selectedKeys;
  }, [location]);

  return <div id="menu-container">
    <div className="menu-area">
      <AntdMenu
        defaultSelectedKeys={defaultSelectedKeys}
        items={items}
        onClick={handleMenuItemClick}
      />
    </div>
    <div className="content-area">
      <Outlet></Outlet>
    </div>
  </div>
}
