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
  const { authenticatedUser } = useContext(AuthContext);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);

  useEffect(() => {
    const checkVerification = async () => {
      const verify = await authAPIClient.isVerified();
      setIsVerified(verify);
    };
    checkVerification();
  }, [isVerified]);

  if (authenticatedUser === null) {
    return (
      <Redirect to={LOGIN_PAGE} />
    )
  }

  if (!isVerified) {
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
