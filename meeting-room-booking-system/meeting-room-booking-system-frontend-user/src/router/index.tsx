import { createBrowserRouter } from 'react-router-dom';
import { BookingHistory } from '../views/booking-history/BookingHistory';
import { UpdateInfo } from '../views/update-info/UpdateInfo';
import { Index } from '../views/index/Index';
import { MeetingRoomList } from '../views/meeting-room-list/MeetingRoomList';
import { Register } from '../views/register/Register';
import { Login } from '../views/login/Login';
import { UpdatePassword } from '../views/update-password/UpdatePassword';
import { ErrorPage } from '../views/error/ErrorPage';
import { Menu } from '../views/menu/Menu';

const routes = [
  {
    path: "/",
    element: <Index />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'update-info',
        element: <UpdateInfo />
      },
      {
        path: '/',
        element: <Menu />,
        children: [
          {
            path: '/',
            element: <MeetingRoomList />
          },
          {
            path: 'meeting_room_list',
            element: <MeetingRoomList />
          },
          {
            path: 'booking_history',
            element: <BookingHistory />
          }
        ]
      }

    ]
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "register",
    element: <Register />,
  },
  {
    path: "update_password",
    element: <UpdatePassword />,
  }
];

export const router = createBrowserRouter(routes);
