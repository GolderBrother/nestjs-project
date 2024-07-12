import { UserOutlined } from "@ant-design/icons";
import { Outlet, Link } from "react-router-dom";
import cookies from 'js-cookies';
import './index.css';
import { useEffect } from "react";

export function Index() {
  useEffect(() => {
    const userInfo = cookies.get('userInfo');
    const accessToken = cookies.get('accessToken');
    const refreshToken = cookies.get('refreshToken');

    if (userInfo && accessToken && refreshToken) {
      localStorage.setItem('user_info', userInfo);
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);

      cookies.remove('userInfo');
      cookies.remove('accessToken');
      cookies.remove('refreshToken');
    }
  }, []);

  return <div id="index-container">
    <div className="header">
      <h1>会议室预定系统</h1>
      <Link to={"/update-info"}><UserOutlined className="icon" /></Link>
    </div>
    <div className="body">
      <Outlet></Outlet>
    </div>
  </div>
}
