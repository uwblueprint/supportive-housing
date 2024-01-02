import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useReducer } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { ChakraProvider } from "@chakra-ui/react";

import LoginPage from "./components/pages/LoginPage";
import SignupPage from "./components/pages/SignupPage";
import PrivateRoute from "./components/auth/PrivateRoute";
import Verification from "./components/auth/Verification";
import HomePage from "./components/pages/HomePage/HomePage";
import NotFound from "./components/pages/NotFound";
import * as Routes from "./constants/Routes";
import AUTHENTICATED_USER_KEY from "./constants/AuthConstants";
import AuthContext from "./contexts/AuthContext";
import { getLocalStorageObj } from "./utils/LocalStorageUtils";
import SampleContext, {
  DEFAULT_SAMPLE_CONTEXT,
} from "./contexts/SampleContext";
import sampleContextReducer from "./reducers/SampleContextReducer";
import SampleContextDispatcherContext from "./contexts/SampleContextDispatcherContext";
import ResidentDirectory from "./components/pages/ResidentDirectory/ResidentDirectory";

import { AuthenticatedUser } from "./types/AuthTypes";

import customTheme from "./theme";
import EmployeeDirectoryPage from "./components/pages/AdminControls/EmployeeDirectory";
import SignInLogsPage from "./components/pages/AdminControls/SignInLogs";
import TagsPage from "./components/pages/AdminControls/Tags";

const App = (): React.ReactElement => {
  const currentUser: AuthenticatedUser | null = getLocalStorageObj<AuthenticatedUser>(
    AUTHENTICATED_USER_KEY,
  );

  const [
    authenticatedUser,
    setAuthenticatedUser,
  ] = useState<AuthenticatedUser | null>(currentUser);

  // Some sort of global state. Context API replaces redux.
  // Split related states into different contexts as necessary.
  // Split dispatcher and state into separate contexts as necessary.
  const [sampleContext, dispatchSampleContextUpdate] = useReducer(
    sampleContextReducer,
    DEFAULT_SAMPLE_CONTEXT,
  );

  return (
    <ChakraProvider theme={customTheme}>
      <SampleContext.Provider value={sampleContext}>
        <SampleContextDispatcherContext.Provider
          value={dispatchSampleContextUpdate}
        >
          <AuthContext.Provider
            value={{ authenticatedUser, setAuthenticatedUser }}
          >
            <Router>
              <Switch>
                <Route exact path={Routes.LOGIN_PAGE} component={LoginPage} />
                <Route exact path={Routes.SIGNUP_PAGE} component={SignupPage} />
                <PrivateRoute
                  exact
                  path={Routes.VERIFICATION_PAGE}
                  component={Verification}
                />
                <PrivateRoute
                  exact
                  path={Routes.HOME_PAGE}
                  component={HomePage}
                />
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
                <PrivateRoute
                  exact
                  path={Routes.TAGS_PAGE}
                  component={TagsPage}
                />

                <Route exact path="*" component={NotFound} />
              </Switch>
            </Router>
          </AuthContext.Provider>
        </SampleContextDispatcherContext.Provider>
      </SampleContext.Provider>
    </ChakraProvider>
  );
};

export default App;
