import React, { useContext, useState, useEffect } from "react";
import { Route, Redirect, useLocation } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";
import { LOGIN_PAGE, VERIFICATION_PAGE } from "../../constants/Routes";

type PrivateRouteProps = {
  component: React.FC;
  path: string;
  exact: boolean;
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  component,
  exact,
  path,
}: PrivateRouteProps) => {
  const { authenticatedUser } = useContext(AuthContext);
  const location = useLocation();
  const currentPath = location.pathname;

  if (authenticatedUser === null) {
    return (
      <Redirect to={LOGIN_PAGE} />
    )
  }

  if (authenticatedUser.verified === false) {
    if (!currentPath.endsWith("/verification")) {
      return (
        <Redirect to={VERIFICATION_PAGE} />
      )
    }
  }

  return (
    <Route path={path} exact={exact} component={component} />
  )
};

export default PrivateRoute;
