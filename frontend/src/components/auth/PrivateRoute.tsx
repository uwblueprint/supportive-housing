import React, { useContext, useState, useEffect } from "react";
import { Route, Redirect, useLocation } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";
import { EMPLOYEE_DIRECTORY_PAGE, HOME_PAGE, LOGIN_PAGE, SIGN_IN_LOGS_PAGE, TAGS_PAGE, VERIFICATION_PAGE } from "../../constants/Routes";
import { UserRole } from "../../types/UserTypes";

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

  if (!authenticatedUser) {
    return <Redirect to={LOGIN_PAGE} />;
  }

  if (authenticatedUser.verified === false) {
    if (!currentPath.endsWith(VERIFICATION_PAGE)) {
      return <Redirect to={VERIFICATION_PAGE} />;
    }
  }

  if (authenticatedUser.role !== UserRole.ADMIN && (
     currentPath.endsWith(EMPLOYEE_DIRECTORY_PAGE) || 
     currentPath.endsWith(SIGN_IN_LOGS_PAGE) || 
     currentPath.endsWith(TAGS_PAGE)
  )) {
    return <Redirect to={HOME_PAGE} />;
  }

  console.log(path, currentPath)

  return <Route path={path} exact={exact} component={component} />;
};

export default PrivateRoute;
