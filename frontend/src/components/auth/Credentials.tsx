import React, { useContext, useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input
} from '@chakra-ui/react'
import authAPIClient from "../../APIClients/AuthAPIClient";
import AUTHENTICATED_USER_KEY from "../../constants/AuthConstants";
import { HOME_PAGE, SIGNUP_PAGE } from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";
import { LoginErrorResponse, LoginResponse } from "../../types/AuthTypes";
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

const isLoginErrorResponse = (res: LoginResponse) : res is LoginErrorResponse => {
  return (res !== null && 'errCode' in res);
}

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
  const [emailError, setEmailError] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [passwordErrorStr, setPasswordErrStr] = useState<string>("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value as string;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (emailRegex.test(inputValue)) {
      setEmailError(false)
    } else {
      setEmailError(true)
    }
    setEmail(inputValue)
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value as string;
    setPassword(inputValue)
    setPasswordError(false)
    setPasswordErrStr("");
  };

  const onLogInClick = async () => {
    const isInvited = await commonApiClient.isUserInvited(email);
    if (isInvited) {
      const loginResponse: LoginResponse = await authAPIClient.login(
        email,
        password,
      );
      if (isLoginErrorResponse(loginResponse)) {
        setPasswordError(true);
        setPasswordErrStr(loginResponse.errMessage);
      }
      else if (loginResponse) {
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
            <FormControl isRequired isInvalid={emailError}>
              <Input 
                type="email" 
                value={email} 
                onChange={handleEmailChange} 
                placeholder="Your email address"
              /> 
              <FormErrorMessage>Please enter a valid email.</FormErrorMessage>
            </FormControl>
          </div>

          <div>
            <FormControl isRequired isInvalid={passwordError}>
              <Input 
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Your password"
              />
              <FormErrorMessage>{passwordErrorStr}</FormErrorMessage>
            </FormControl>
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
