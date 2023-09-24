import React, { useContext } from "react";
import { Redirect, useHistory } from "react-router-dom";
import authAPIClient from "../../APIClients/AuthAPIClient";
import AUTHENTICATED_USER_KEY from "../../constants/AuthConstants";
import { HOME_PAGE, SIGNUP_PAGE } from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";
import { LoginResponse } from "../../types/AuthTypes";
import commonApiClient from "../../APIClients/CommonAPIClient";

type CredentialsProps = {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  setToken: (token: string) => void;
  toggle: boolean;
  setToggle: (toggle: boolean) => void;
};

const Credentials = ({
  email,
  setEmail,
  password,
  setPassword,
  setToken,
  toggle,
  setToggle,
}: CredentialsProps): React.ReactElement => {
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
  const history = useHistory();

  const onLogInClick = async () => {
    const isInvited = await commonApiClient.isUserInvited(email);
    if (isInvited) {
      const loginResponse: LoginResponse = await authAPIClient.login(
        email,
        password,
      );
      if (loginResponse) {
        const { requiresTwoFa, authUser } = loginResponse;
        if (requiresTwoFa) {
          setToggle(!toggle);
        } else {
          localStorage.setItem(
            AUTHENTICATED_USER_KEY,
            JSON.stringify(authUser),
          );
          setAuthenticatedUser(authUser);
        }
      }
      // Otherwise we can display some sort of error
    } else {
      // eslint-disable-next-line no-alert
      window.alert("user not invited");
    }
  };

  const onSignUpClick = () => {
    history.push(SIGNUP_PAGE);
  };

  if (authenticatedUser) {
    return <Redirect to={HOME_PAGE} />;
  }

  if (toggle) {
    return (
      <div style={{ textAlign: "center" }}>
        <h1>Login</h1>
        <form>
          <div>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="username@domain.com"
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="password"
            />
          </div>
          <div>
            <button
              className="btn btn-primary"
              type="button"
              onClick={onLogInClick}
            >
              Log In
            </button>
          </div>
        </form>
        <div>
          <button
            className="btn btn-primary"
            type="button"
            onClick={onSignUpClick}
          >
            Sign Up
          </button>
        </div>
      </div>
    );
  }
  return <></>;
};

export default Credentials;
