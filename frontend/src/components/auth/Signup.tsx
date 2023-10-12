import React, { useContext, useState } from "react";
import { Redirect } from "react-router-dom";

import authAPIClient from "../../APIClients/AuthAPIClient";
import { HOME_PAGE } from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";
import { RegisterResponse, AuthenticatedUser } from "../../types/AuthTypes";
import commonApiClient from "../../APIClients/CommonAPIClient";
import Authy from "./Authy";
import AUTHENTICATED_USER_KEY from "../../constants/AuthConstants";

const Signup = (): React.ReactElement => {
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
  const [toggle, setToggle] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSignupClick = async () => {
    const isInvited = await commonApiClient.isUserInvited(email);
    if (isInvited) {
      const registerResponse: RegisterResponse = await authAPIClient.register(
        firstName,
        lastName,
        email,
        password,
      );
      if (registerResponse) {
        const { requiresTwoFa, authUser } = registerResponse;
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
    } else {
      // TODO: make this alert better and also differentiate between
      // when a user is not invited and when a user's account already exists
      // eslint-disable-next-line no-alert
      window.alert("user not invited");
    }
  };

  if (authenticatedUser) {
    return <Redirect to={HOME_PAGE} />;
  }

  if (toggle) {
    return (
      <div style={{ textAlign: "center" }}>
        <h1>Signup</h1>
        <form>
          <div>
            <input
              type="text"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              placeholder="first name"
            />
          </div>
          <div>
            <input
              type="text"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              placeholder="last name"
            />
          </div>
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
              onClick={onSignupClick}
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    );
  }
  return (<Authy email={email} password={password} token="" toggle={!toggle} />);
};

export default Signup;
