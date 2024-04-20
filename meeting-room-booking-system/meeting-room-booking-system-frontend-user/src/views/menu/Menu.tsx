import { Outlet, useLocation } from "react-router-dom";
import { Menu as AntdMenu, MenuProps } from 'antd';
import './menu.css';
import { MenuClickEventHandler } from "rc-menu/lib/interface";
import { router } from "../../router";
import { useMemo } from "react";

const enum MenuItemKeyMap {
  MEETING_ROOM_LIST = 'meetingRoomList',
  BOOKING_HISTORY = 'bookingHistory',
};
const enum MenuItemKeyToPathMap {
  MEETING_ROOM_LIST = '/meeting_room_list',
  BOOKING_HISTORY = '/booking_history',
};
const MenuItemPathToKeyMap = {
  [MenuItemKeyToPathMap.MEETING_ROOM_LIST]: MenuItemKeyMap.MEETING_ROOM_LIST,
  [MenuItemKeyToPathMap.BOOKING_HISTORY]: MenuItemKeyMap.BOOKING_HISTORY,
};

const items: MenuProps['items'] = [
  {
    key: MenuItemKeyMap.MEETING_ROOM_LIST,
    label: "会议室列表"
  },
  {
    key: MenuItemKeyMap.BOOKING_HISTORY,
    label: "预定历史"
  }
];

const handleMenuItemClick: MenuClickEventHandler = (info) => {
  let path = '';
  switch (info.key) {
    case MenuItemKeyMap.MEETING_ROOM_LIST:
      path = MenuItemKeyToPathMap.MEETING_ROOM_LIST;
      break;
    case MenuItemKeyMap.BOOKING_HISTORY:
      path = MenuItemKeyToPathMap.BOOKING_HISTORY;
      break;
  }

  router.navigate(path);
}


export function Menu() {
  const location = useLocation();
  const defaultSelectedKeys = useMemo(() => {
    const path = location.pathname as string;
    const selectedKeys = (MenuItemPathToKeyMap as Record<string, MenuItemKeyMap>)[path] ? [(MenuItemPathToKeyMap as Record<string, MenuItemKeyMap>)[path]] : [MenuItemKeyToPathMap.MEETING_ROOM_LIST];
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
