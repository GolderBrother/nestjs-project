import { Outlet, useLocation } from "react-router-dom";
import { Menu as AntdMenu, MenuProps } from 'antd';
import './menu.css';
import router from '../../router/index';
import { useCallback, useEffect, useRef, useState } from "react";
interface MenuClickEventHandler {
	(info: Record<string, any>): void;
}
const items: MenuProps['items'] = [
	{
		key: 'infoModify',
		label: "信息修改"
	},
	{
		key: 'passwordModify',
		label: "密码修改"
	}
];


export function ModifyMenu() {
	const handleMenuItemClick: MenuClickEventHandler = useCallback((info) => {
		switch (info.key) {
			case 'infoModify':
				router.navigate('/user/info_modify');
				break;
			case 'passwordModify':
				router.navigate('/user/password_modify');
				break;
		}
	}, []);
	const location = useLocation();

	return <div id="menu-container">
		<div className="menu-area">
			<AntdMenu
				defaultSelectedKeys={location.pathname === '/user/info_modify' ? ['infoModify'] : ['passwordModify']}
				items={items}
				onClick={handleMenuItemClick}
			/>
		</div>
		<div className="content-area">
			<Outlet></Outlet>
		</div>
	</div>
}
