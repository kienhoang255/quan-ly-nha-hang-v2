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
import ProtectRole from "./ProtectRole";

const User = React.lazy(() => import("../pages/User"));
const Menu = React.lazy(() => import("../pages/Menu"));
const Main = React.lazy(() => import("../pages/Main"));
const Order = React.lazy(() => import("../pages/Order"));
const Table = React.lazy(() => import("../pages/Table"));
const Login = React.lazy(() => import("../pages/Login"));
const Booking = React.lazy(() => import("../pages/Booking"));
const Employee = React.lazy(() => import("../pages/Employee"));
const ManagerTable = React.lazy(() => import("../pages/ManagerTable"));
const ManagerEmployee = React.lazy(() => import("../pages/ManagerEmployee"));
const ErrorPage = React.lazy(() => import("../pages/403"));
const BillHistory = React.lazy(() => import("../pages/BillHistory"));
const ManagerMenu = React.lazy(() => import("../pages/ManagerMenu"));

const Routes = () => {
  const privateRoute = [
    { path: "/", component: Main, name: "Trang chủ" },
    { path: "/me", component: User, name: "Trang cá nhân" },
    { path: "/order", component: Order, name: "Đặt món" },
    { path: "/table", component: Table, name: "Bàn ăn" },
    { path: "/employee", component: Employee, name: "Nhân viên" },
    { path: "/booking", component: Booking, name: "Đặt bàn" },
    {
      path: "/bill-history",
      component: BillHistory,
      name: "Lịch sử giao dịch",
    },
    {
      path: "/manager/table",
      component: ManagerTable,
      name: "Quản lý bàn",
    },
    {
      path: "/manager/employee",
      component: ManagerEmployee,
      name: "Đặt nhân viên",
    },
    {
      path: "/manager/menu",
      component: ManagerMenu,
      name: "Cài đặt thực đơn",
    },
  ];

  const NoLayoutRoute = [{ path: "/menu", component: Menu, name: "Thực đơn" }];

  const publicRoute = [{ path: "/login", component: Login, name: "Đăng nhập" }];

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* if you not login, you can't use any page in `privateRoute` */}
        <Route element={<ProtectRoute />}>
          <Route element={<ProtectRole />}>
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
          <Route
            path="403"
            element={
              <Suspense fallback={<LoadingRoute />}>
                <ErrorPage />
              </Suspense>
            }
          ></Route>
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
