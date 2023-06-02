import { Outlet, createBrowserRouter } from "react-router-dom";
import Disposal from "./Disposal";
import Login from "./Login";
import Menu from "./Menu";
import NotFoundPage from "./NotFoundPage";
import PrivateRoute2 from "./PrivateRoute2";
import Provision from "./Provision";
import Pws from "./Pws";
import Return from "./Return";

const HeaderLayout = () => {
    return (
        <>
            <Menu />
            <Outlet />
        </>
    );
}

export const RouterInfo = createBrowserRouter([

    {
        element: <HeaderLayout />,

        children: [
            {
                path: "/login",
                element: <Login />,
            },
            {
                element: <PrivateRoute2 authentication={true} />,
                children: [
                    {
                        path: "/",
                        element: <Pws />,
                    },

                    {
                        path: "/provision",
                        element: <Provision />,
                    },
                    {
                        path: "/return",
                        element: <Return />,
                    },
                    {
                        path: "/disposal",
                        element: <Disposal />,
                    },
                ],
            },
            {
                path: "/*",
                element: <NotFoundPage />,
            },
        ],
    }
])