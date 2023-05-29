import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectRole = ({}) => {
  const roleNotAllowed = useSelector((state) => state.role.roleNotAllowed);

  let value = true;

  if (roleNotAllowed.find((e) => e.path === location.pathname)) {
    value = false;
  } else value = true;

  return <>{value ? <Outlet /> : <Navigate to="/403" />}</>;
};

export default ProtectRole;
