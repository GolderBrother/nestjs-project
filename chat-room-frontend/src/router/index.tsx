import { createBrowserRouter, Link, Outlet } from 'react-router-dom';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { UpdatePassword } from '../pages/UpdatePassword';
import { Index } from '../pages/Index';
import { UpdateInfo } from '../pages/UpdateInfo';
import { Menu } from '@/pages/Menu';
import { Friendship } from '@/pages/Friendship';
import { Group } from '@/pages/Group';
import { Chat } from '@/pages/Chat/index.tsx';
import { Collection } from '@/pages/Collection';
import { Notification } from '@/pages/Notification';

const routes = [
  {
    path: "/",
    element: <Index />,
    children: [
      {
        path: 'update_info',
        element: <UpdateInfo />
      },
      {
        path: '/',
        // element: () => import('@/pages/Menu/index.tsx'),
        element: <Menu />,
        children: [
          {
            path: '/',
            element: <Friendship />,
          },
          {
            path: '/group',
            element: <Group />,
          },
          {
            path: 'chat',
            element: <Chat />,
          },
          {
            path: 'collection',
            element: <Collection />,
          },
          {
            path: 'notification',
            element: <Notification />,
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
const router = createBrowserRouter(routes);
export default router;
