import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const CheckLoginRoute = () => {
  let value;
  document.cookie
    .split(";")
    .map((e) => e.split("="))
    .forEach((e) => {
      if (e[0].trim() === "token") {
        value = e[1];
      }
    });

  return <>{value ? <Navigate to="/" /> : <Outlet />}</>;
};

export default CheckLoginRoute;
