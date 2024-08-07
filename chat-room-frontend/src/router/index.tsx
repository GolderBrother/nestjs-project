import { createBrowserRouter, Link, Outlet } from 'react-router-dom';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { UpdatePassword } from '../pages/UpdatePassword';
import { Index } from '../pages/Index';
import { UpdateInfo } from '../pages/UpdateInfo';

const routes = [
  {
    path: "/",
    element: <Index />,
    children: [
      {
        path: 'aaa',
        element: <div>aaa</div>
      },
      {
        path: 'bbb',
        element: <div>bbb</div>
      },
      {
        path: 'update_info',
        element: <UpdateInfo/>
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
