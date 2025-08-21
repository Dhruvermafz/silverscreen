import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = () => {
  const { isAuthenticated } = useSelector((state) => state.user);

  // Check if the user is authenticated and has the required permission

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  // If authenticated and has permission, render the route
  return <Outlet />;
};

export default PrivateRoute;
