import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import masterRoutes from "./routes";
import PrivateRoute from "./PrivateRoute";

const RouteWithHelmet = ({ element, name }) => {
  return (
    <>
      {name && (
        <Helmet>
          <title>{`Cinenotes - ${name}`}</title>
        </Helmet>
      )}
      {element}
    </>
  );
};

const renderRoutes = (routes) => {
  return routes.flatMap(
    ({ path, name, element, requiredPermission, submenu }) => {
      const mainRoute =
        path && element ? (
          <Route
            key={path}
            path={path}
            element={
              requiredPermission ? (
                <PrivateRoute requiredPermission={requiredPermission}>
                  <RouteWithHelmet element={element} name={name} />
                </PrivateRoute>
              ) : (
                <RouteWithHelmet element={element} name={name} />
              )
            }
          />
        ) : null;

      const subRoutes = submenu ? renderRoutes(submenu) : [];

      return mainRoute ? [mainRoute, ...subRoutes] : subRoutes;
    }
  );
};

const CustomRouter = () => {
  return (
    <Routes>
      {renderRoutes(masterRoutes)}
      <Route
        path="*"
        element={
          <RouteWithHelmet element={<Navigate to="/404" />} name="Not Found" />
        }
      />
    </Routes>
  );
};

export default CustomRouter;
