import React, { Suspense } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import MainLayout from "../layout";

import CheckLoginRoute from "./CheckLoginRoute";
import ProtectRoute from "./ProtectRoute";
import LoadingRoute from "../components/LoadingRoute";

const Menu = React.lazy(() => import("../pages/Menu"));
const Employee = React.lazy(() => import("../pages/Employee"));
const Main = React.lazy(() => import("../pages/Main"));
const Order = React.lazy(() => import("../pages/Order"));
const Table = React.lazy(() => import("../pages/Table"));
const Booking = React.lazy(() => import("../pages/Booking"));
const Login = React.lazy(() => import("../pages/Login"));
const ManagerTable = React.lazy(() => import("../pages/ManagerTable"));

const Routes = () => {
  const privateRoute = [
    { path: "/", component: Main, name: "Trang chủ" },
    { path: "/order", component: Order, name: "Đặt món" },
    { path: "/table", component: Table, name: "Bàn ăn" },
    { path: "/employee", component: Employee, name: "Nhân viên" },
    { path: "/booking", component: Booking, name: "Đặt bàn" },
    {
      path: "/manager/table",
      component: ManagerTable,
      name: "Đặt bàn",
    },
  ];

  const NoLayoutRoute = [{ path: "/menu", component: Menu, name: "Thực đơn" }];
  const publicRoute = [{ path: "/login", component: Login, name: "Đăng nhập" }];

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* if you not login, you can't use any page in `privateRoute` */}
        <Route element={<ProtectRoute />}>
          <Route element={<MainLayout />}>
            {privateRoute.map((e, key) => (
              <Route
                key={key}
                path={e.path}
                element={
                  <Suspense fallback={<LoadingRoute />}>
                    <e.component />
                  </Suspense>
                }
              ></Route>
            ))}
          </Route>
          {/* This route don't use layout */}
          <Route>
            {NoLayoutRoute.map((e, key) => (
              <Route
                key={key}
                path={e.path}
                element={
                  <Suspense fallback={<LoadingRoute />}>
                    <e.component />
                  </Suspense>
                }
              ></Route>
            ))}
          </Route>
        </Route>

        {/* Check if you're login, go can't go to login page anymore */}
        {/* expect you logout */}
        <Route element={<CheckLoginRoute />}>
          {publicRoute.map((e, key) => (
            <Route
              key={key}
              path={e.path}
              element={
                <Suspense fallback={<LoadingRoute />}>
                  <e.component />
                </Suspense>
              }
            ></Route>
          ))}
        </Route>
      </>
    )
  );

  return <RouterProvider router={router} />;
};

export default Routes;
