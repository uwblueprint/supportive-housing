import React, { useContext, useState, useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import authAPIClient from "../../APIClients/AuthAPIClient";
import AuthContext from "../../contexts/AuthContext";
import { LOGIN_PAGE, VERIFICATION_PAGE } from "../../constants/Routes";
import Verification from "./Verification";

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
  const [isVerified, setIsVerified] = useState<boolean>(false);

  useEffect(() => {
    const checkVerification = async () => {
      const verify = await authAPIClient.isVerified();
      setIsVerified(verify);
    };
    checkVerification();
  }, []);

  if (authenticatedUser === null) {
    return (
      <Redirect to={LOGIN_PAGE} />
    )
  }

  if (!isVerified) {
    return (
      <Route path={VERIFICATION_PAGE} exact component={Verification} />
    )
  }

  return (
    <Route path={path} exact={exact} component={component} />
  )
};

export default PrivateRoute;
