import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useReducer } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { ChakraProvider } from "@chakra-ui/react";

import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import PrivateRoute from "./components/auth/PrivateRoute";
import CreatePage from "./components/pages/CreatePage";
import DisplayPage from "./components/pages/DisplayPage";
import NotFound from "./components/pages/NotFound";
import UpdatePage from "./components/pages/UpdatePage";
import * as Routes from "./constants/Routes";
import AUTHENTICATED_USER_KEY from "./constants/AuthConstants";
import AuthContext from "./contexts/AuthContext";
import { getLocalStorageObj } from "./utils/LocalStorageUtils";
import SampleContext, {
  DEFAULT_SAMPLE_CONTEXT,
} from "./contexts/SampleContext";
import sampleContextReducer from "./reducers/SampleContextReducer";
import SampleContextDispatcherContext from "./contexts/SampleContextDispatcherContext";
import EditTeamInfoPage from "./components/pages/EditTeamPage";
import HooksDemo from "./components/pages/HooksDemo";
import LogRecords from "./components/pages/LogRecords";
import TeamMembers from "./components/pages/TeamMembers";
import ResidentDirectory from "./components/pages/ResidentDirectory";
import EmployeeDirectory from "./components/pages/EmployeeDirectory";
import { AuthenticatedUser } from "./types/AuthTypes";

const App = (): React.ReactElement => {
  const currentUser: AuthenticatedUser | null =
    getLocalStorageObj<AuthenticatedUser>(AUTHENTICATED_USER_KEY);

  const [authenticatedUser, setAuthenticatedUser] =
    useState<AuthenticatedUser | null>(currentUser);

  // Some sort of global state. Context API replaces redux.
  // Split related states into different contexts as necessary.
  // Split dispatcher and state into separate contexts as necessary.
  const [sampleContext, dispatchSampleContextUpdate] = useReducer(
    sampleContextReducer,
    DEFAULT_SAMPLE_CONTEXT,
  );

  return (
    <ChakraProvider>
      <SampleContext.Provider value={sampleContext}>
        <SampleContextDispatcherContext.Provider
          value={dispatchSampleContextUpdate}
        >
          <AuthContext.Provider
            value={{ authenticatedUser, setAuthenticatedUser }}
          >
            <Router>
              <Switch>
                <Route exact path={Routes.LOGIN_PAGE} component={Login} />
                <Route exact path={Routes.SIGNUP_PAGE} component={Signup} />
                <PrivateRoute
                  exact
                  path={Routes.HOME_PAGE}
                  component={LogRecords}
                />
                <PrivateRoute
                  exact
                  path={Routes.TEAM_MEMBERS}
                  component={TeamMembers}
                />
                <PrivateRoute
                  exact
                  path={Routes.CREATE_ENTITY_PAGE}
                  component={CreatePage}
                />
                <PrivateRoute
                  exact
                  path={Routes.UPDATE_ENTITY_PAGE}
                  component={UpdatePage}
                />
                <PrivateRoute
                  exact
                  path={Routes.DISPLAY_ENTITY_PAGE}
                  component={DisplayPage}
                />
                <PrivateRoute
                  exact
                  path={Routes.EDIT_TEAM_PAGE}
                  component={EditTeamInfoPage}
                />
                <PrivateRoute
                  exact
                  path={Routes.HOOKS_PAGE}
                  component={HooksDemo}
                />
                <PrivateRoute
                  exact
                  path={Routes.RESIDENT_DIRECTORY_PAGE}
                  component={ResidentDirectory}
                />
                <PrivateRoute
                  exact
                  path={Routes.EMPLOYEE_DIRECTORY_PAGE}
                  component={EmployeeDirectory}
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
