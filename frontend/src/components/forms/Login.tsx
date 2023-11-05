import React, { useContext, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Text,
  FormControl,
  FormErrorMessage,
  Input,
} from "@chakra-ui/react";
import { Redirect, useHistory } from "react-router-dom";
import authAPIClient from "../../APIClients/AuthAPIClient";
import AUTHENTICATED_USER_KEY from "../../constants/AuthConstants";
import { HOME_PAGE, SIGNUP_PAGE } from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";
import { ErrorResponse, AuthTokenResponse } from "../../types/AuthTypes";
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

const isLoginErrorResponse = (
  res: AuthTokenResponse | ErrorResponse,
): res is ErrorResponse => {
  return res !== null && "errCode" in res;
};

const Login = ({
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
  const [loginClicked, setLoginClicked] = useState<boolean>(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value as string;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (loginClicked) {
      if (emailRegex.test(inputValue)) {
        setEmailError(false);
      } else {
        setEmailError(true);
      }
    }
    setEmail(inputValue);

    // Clear password error on changing the email
    setPasswordError(false);
    setPasswordErrStr("");
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value as string;
    setPassword(inputValue);

    // Clear password error on changing the password
    setPasswordError(false);
    setPasswordErrStr("");
  };

  const onLogInClick = async () => {
    setLoginClicked(true);
    const isInvited = await commonApiClient.isUserInvited(email);
    if (isInvited) {
      const loginResponse:
        | AuthTokenResponse
        | ErrorResponse = await authAPIClient.login(email, password);
      if (isLoginErrorResponse(loginResponse)) {
        setPasswordError(true);
        setPasswordErrStr(loginResponse.errMessage);
      } else if (loginResponse) {
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
    }
  };

  const onSignUpClick = () => {
    history.push(SIGNUP_PAGE);
  };

  if (authenticatedUser) {
    return <Redirect to={HOME_PAGE} />;
  }

  if (toggle) {
    // Lock scroll
    document.body.style.overflow = "hidden";
    return (
      <Flex h="100vh">
        <Box w="47%">
          <Flex
            marginTop="270px"
            display="flex"
            align="center"
            justify="center"
          >
            <Flex width="76%" align="flex-start" direction="column" gap="28px">
              <Text variant="login" paddingBottom="12px">
                Log In
              </Text>
              <FormControl isRequired isInvalid={emailError}>
                <Input
                  variant="login"
                  placeholder="Your email address"
                  value={email}
                  onChange={handleEmailChange}
                />
                <FormErrorMessage>Please enter a valid email.</FormErrorMessage>
              </FormControl>
              <FormControl isRequired isInvalid={passwordError}>
                <Input
                  variant="login"
                  type="password"
                  placeholder="Your password"
                  value={password}
                  onChange={handlePasswordChange}
                />
                <FormErrorMessage>{passwordErrorStr}</FormErrorMessage>
              </FormControl>
              <Button
                variant="login"
                disabled={email === "" || password === ""}
                _hover={
                  email && password
                    ? {
                        background: "teal.500",
                        transition:
                          "transition: background-color 0.5s ease !important",
                      }
                    : {}
                }
                onClick={onLogInClick}
              >
                Log In
              </Button>
              <Flex paddingTop="29px" alignContent="center">
                <Text variant="loginSecondary" paddingRight="17px">
                  Not a member yet?
                </Text>
                <Text variant="loginTertiary" onClick={onSignUpClick}>
                  Sign Up Now
                </Text>
              </Flex>
            </Flex>
          </Flex>
        </Box>
        <Box flex="1" bg="teal.400">
          {/* Background */}
        </Box>
      </Flex>
    );
  }
  return <></>;
};

export default Login;
