import React, { useContext, useState } from "react";
import {
  GoogleLogin,
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from "react-google-login";
import { Redirect, useHistory } from "react-router-dom";
import authAPIClient from "../../APIClients/AuthAPIClient";
import { HOME_PAGE, SIGNUP_PAGE } from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";
import { AuthenticatedUser } from "../../types/AuthTypes";

type GoogleResponse = GoogleLoginResponse | GoogleLoginResponseOffline;

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
    console.log("test");
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
