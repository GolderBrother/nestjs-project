import { createBrowserRouter } from 'react-router-dom';
import { Index } from '../pages/Index/Index';
import { ErrorPage } from '../pages/ErrorPage/ErrorPage';
import { UserManage } from '../pages/UserManage/UserManage';
import { Login } from '../pages/Login/Login';
import { Menu } from '../pages/Menu/Menu';
import { InfoModify } from '../pages/InfoModify/InfoModify';
import { ModifyMenu } from '../pages/ModifyMenu/ModifyMenu';
import { PasswordModify } from '../pages/PasswordModify/PasswordModify';
import { BookingManage } from '../pages/BookingManage/BookingManage';
import { MeetingRoomManage } from '../pages/MeetingRoomManage/MeetingRoomManage';
import { Statistics } from '../pages/Statistics/Statistics';

export const routes = [
  {
    path: "/",
    element: <Index />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Menu />,
        children: [
          {
            path: 'user_manage',
            element: <UserManage />
          },
          {
            path: 'booking_manage',
            element: <BookingManage />
          },
          {
            path: 'meeting_room_manage',
            element: <MeetingRoomManage />
          },
          {
            path: 'statistics',
            element: <Statistics />
          },
        ]
      },
      {
        path: "/user",
        element: <ModifyMenu />,
        children: [
          {
            path: 'info_modify',
            element: <InfoModify />
          },
          {
            path: 'password_modify',
            element: <PasswordModify />
          },
        ]
      },
    ]
  },
  {
    path: "login",
    element: <Login />,
  }
];


const router = createBrowserRouter(routes);
export default router;