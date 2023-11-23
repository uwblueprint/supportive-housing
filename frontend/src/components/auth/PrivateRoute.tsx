import React, { useContext, useState, useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import authAPIClient from "../../APIClients/AuthAPIClient";
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
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);

  useEffect(() => {
    const checkVerification = async () => {
      if (authenticatedUser) {
        const authUser = authenticatedUser;
        if (authUser.verified === false) {
          authUser.verified = await authAPIClient.isVerified();
          setAuthenticatedUser(authUser);
        }
      }
    };
    checkVerification();
  }, []);

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
