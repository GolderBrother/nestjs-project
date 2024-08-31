import { Link, Outlet } from "react-router-dom";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { UpdatePassword } from "../pages/UpdatePassword";

export function Aaa() {
    return <div>aaa</div>;
}

export function Bbb() {
    return <div>bbb</div>;
}

export function Layout() {
    return <div>
        <div><Link to="/aaa">to aaa</Link></div>
        <div><Link to="/bbb">to bbb</Link></div>
        <div>
            <Outlet />
        </div>
    </div>
}

export const ROUTES = [
    {
      path: "/",
      element: <div>index</div>,
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