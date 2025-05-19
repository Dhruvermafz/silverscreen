import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ requiredPermission }) => {
  const { isAuthenticated, permissions } = useSelector((state) => state.user);

  const hasPermission = requiredPermission
    ? permissions.includes(requiredPermission)
    : true;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredPermission && !hasPermission) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
