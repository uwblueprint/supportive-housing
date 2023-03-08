import React, { useContext, useState } from "react";
import { Redirect } from "react-router-dom";
import authAPIClient from "../../APIClients/AuthAPIClient";
import AUTHENTICATED_USER_KEY from "../../constants/AuthConstants";
import { HOME_PAGE } from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";
import { AuthenticatedUser } from "../../types/AuthTypes";

type AuthyProps = {
  email: string;
  password: string;
  token: string;
  toggle: boolean;
};

const Authy = ({
  email,
  password,
  token,
  toggle,
}: AuthyProps): React.ReactElement => {
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
  const [passcode, setPasscode] = useState("");

  const onAuthyClick = async () => {
    let authUser: AuthenticatedUser | null;

    if (token) {
      authUser = await authAPIClient.twoFaWithGoogle(passcode, token);
    } else {
      authUser = await authAPIClient.twoFa(passcode, email, password);
    }

    if (authUser) {
      localStorage.setItem(AUTHENTICATED_USER_KEY, JSON.stringify(authUser));
      setAuthenticatedUser(authUser);
    }
  };

  if (authenticatedUser) {
    return <Redirect to={HOME_PAGE} />;
  }

  if (toggle) {
    return (
      <div style={{ textAlign: "center" }}>
        <h1>Authy</h1>
        <form>
          <div>
            <p>Enter token from Authy App</p>
            <input
              type="text"
              value={passcode}
              onChange={(event) => setPasscode(event.target.value)}
              placeholder="passcode"
            />
          </div>
          <div>
            <button
              className="btn btn-primary"
              type="button"
              onClick={onAuthyClick}
            >
              Verify
            </button>
          </div>
        </form>
      </div>
    );
  }
  return <></>;
};

export default Authy;
