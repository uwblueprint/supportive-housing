import React, { useContext } from "react";
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
  const { authenticatedUser } = useContext(AuthContext);

  if (authenticatedUser === null) {
    return (
      <Redirect to={LOGIN_PAGE} />
    )
  }

  const isVerified = authAPIClient.isVerified();
  if (isVerified) {
    return (
      <Route path={path} exact={exact} component={component} />
    )
  }

  return (
    <Redirect to={VERIFICATION_PAGE} />
  )
};

export default PrivateRoute;
