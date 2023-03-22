import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectRoute = () => {
  let value;
  document.cookie
    .split(";")
    .map((e) => e.split("="))
    .forEach((e) =>
      e[0].trim() === "token" ? (value = e[1]) : (value = undefined)
    );

  return <>{value ? <Outlet /> : <Navigate to="/login" />}</>;
};

export default ProtectRoute;
