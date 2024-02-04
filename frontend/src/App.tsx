import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { ChakraProvider } from "@chakra-ui/react";

import LoginPage from "./components/pages/Auth/LoginPage";
import SignupPage from "./components/pages/Auth/SignupPage";
import PrivateRoute from "./components/auth/PrivateRoute";
import HomePage from "./components/pages/HomePage/HomePage";
import NotFound from "./components/pages/Errors/NotFound";
import * as Routes from "./constants/Routes";
import AUTHENTICATED_USER_KEY from "./constants/AuthConstants";
import AuthContext from "./contexts/AuthContext";
import { getLocalStorageObj } from "./utils/LocalStorageUtils";
import ResidentDirectory from "./components/pages/ResidentDirectory/ResidentDirectory";

import { AuthenticatedUser } from "./types/AuthTypes";

import customTheme from "./theme";
import EmployeeDirectoryPage from "./components/pages/AdminControls/EmployeeDirectory";
import SignInLogsPage from "./components/pages/AdminControls/SignInLogs";
import TagsPage from "./components/pages/AdminControls/Tags";
import VerificationPage from "./components/pages/Auth/VerificationPage";
import ResetPasswordPage from "./components/pages/Auth/ResetPasswordPage";

const App = (): React.ReactElement => {
  const currentUser: AuthenticatedUser | null = getLocalStorageObj<AuthenticatedUser>(
    AUTHENTICATED_USER_KEY,
  );

  const [
    authenticatedUser,
    setAuthenticatedUser,
  ] = useState<AuthenticatedUser | null>(currentUser);

  return (
    <ChakraProvider theme={customTheme}>
      <AuthContext.Provider value={{ authenticatedUser, setAuthenticatedUser }}>
        <Router>
          <Switch>
            <Route exact path={Routes.LOGIN_PAGE} component={LoginPage} />
            <Route exact path={Routes.SIGNUP_PAGE} component={SignupPage} />
            <Route
              exact
              path={Routes.RESET_PASSWORD_PAGE}
              component={ResetPasswordPage}
            />
            <PrivateRoute
              exact
              path={Routes.VERIFICATION_PAGE}
              component={VerificationPage}
            />
            <PrivateRoute exact path={Routes.HOME_PAGE} component={HomePage} />
            <PrivateRoute
              exact
              path={Routes.RESIDENT_DIRECTORY_PAGE}
              component={ResidentDirectory}
            />
            <PrivateRoute
              exact
              path={Routes.EMPLOYEE_DIRECTORY_PAGE}
              component={EmployeeDirectoryPage}
            />
            <PrivateRoute
              exact
              path={Routes.SIGN_IN_LOGS_PAGE}
              component={SignInLogsPage}
            />
            <PrivateRoute exact path={Routes.TAGS_PAGE} component={TagsPage} />

            <Route exact path="*" component={NotFound} />
          </Switch>
        </Router>
      </AuthContext.Provider>
    </ChakraProvider>
  );
};

export default App;
