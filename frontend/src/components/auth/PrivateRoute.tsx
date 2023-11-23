import React, { useContext, useState, useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
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

  if (authenticatedUser === null) {
    return (
      <Redirect to={LOGIN_PAGE} />
    )
  }

  if (authenticatedUser.verified === false) {
    if (!window.location.pathname.endsWith("/verification")) {
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
