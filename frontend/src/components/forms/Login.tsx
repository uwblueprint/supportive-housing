import React, { useContext, useState, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  Text,
  FormControl,
  FormErrorMessage,
  Input,
  Spinner,
} from "@chakra-ui/react";
import { Redirect, useHistory } from "react-router-dom";
import authAPIClient from "../../APIClients/AuthAPIClient";
import AUTHENTICATED_USER_KEY from "../../constants/AuthConstants";
import {
  HOME_PAGE,
  SIGNUP_PAGE,
  VERIFICATION_PAGE,
} from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";
import { isAuthErrorResponse, isErrorResponse } from "../../helper/error";
import UserAPIClient from "../../APIClients/UserAPIClient";
import { UserStatus } from "../../types/UserTypes";

type CredentialsProps = {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  setToken: (token: string) => void;
  toggle: boolean;
  setToggle: (toggle: boolean) => void;
};

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const Login = ({
  email,
  setEmail,
  password,
  setPassword,
  setToken,
  toggle,
  setToggle,
}: CredentialsProps): React.ReactElement => {
  const { setAuthenticatedUser } = useContext(AuthContext);
  const history = useHistory();

  const [emailError, setEmailError] = useState<boolean>(false);
  const [emailErrorStr, setEmailErrorStr] = useState<string>("");

  const [generalError, setGeneralError] = useState<boolean>(false);
  const [generalErrorStr, setGeneralErrorStr] = useState<string>("");

  const [loginClicked, setLoginClicked] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value as string;
    setEmail(inputValue);

    if (loginClicked) {
      if (emailRegex.test(inputValue)) {
        setEmailErrorStr("");
        setEmailError(false);
      } else {
        setEmailErrorStr("Please enter a valid email.");
        setEmailError(true);
      }

      // Clear general error on changing the email
      setGeneralError(false);
      setGeneralErrorStr("");
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value as string;
    setPassword(inputValue);

    if (loginClicked) {
      if (inputValue.length === 0) {
        setGeneralError(true);
        setGeneralErrorStr("Password is required.");
      } else {
        setGeneralError(false);
        setGeneralErrorStr("");
      }
    }
  };

  const onLoginClick = async () => {
    setLoginClicked(true);

    if (emailError || generalError) {
      return;
    }

    if (!emailRegex.test(email)) {
      setEmailErrorStr("Please enter a valid email.");
      setEmailError(true);
      return;
    }

    if (password.length === 0) {
      setGeneralError(true);
      setGeneralErrorStr("Password is required.");
      return;
    }

    setIsLoading(true);
    const res = await UserAPIClient.getUserStatus(email);
    if (isErrorResponse(res)) {
      setGeneralError(true);
      setGeneralErrorStr(res.errMessage);
      setIsLoading(false);
    } else if (res === UserStatus.DEACTIVATED) {
      setGeneralError(true);
      setGeneralErrorStr(
        "This email address has been deactivated. Please try again with another email.",
      );
      setIsLoading(false);
    } else if (res === UserStatus.INVITED) {
      setGeneralError(true);
      setGeneralErrorStr(
        "This email address has been invited. Sign up first to make an account!",
      );
      setIsLoading(false);
    } else if (res === UserStatus.ACTIVE) {
      const loginResponse = await authAPIClient.login(email, password);
      if (isAuthErrorResponse(loginResponse)) {
        setGeneralError(true);
        setGeneralErrorStr(loginResponse.errMessage);
        setIsLoading(false);
      } else {
        const { authUser, requiresTwoFa } = loginResponse;
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
      setGeneralError(true);
      setGeneralErrorStr("Unable to login. Please try again.");
      setIsLoading(false);
    }
  };

  const onSignUpClick = () => {
    history.push(SIGNUP_PAGE);
  };

  if (toggle) {
    return (
      <Flex h="100vh">
        <Box w="47%">
          <Flex
            h="100%"
            direction="column"
            justifyContent="center"
            alignItems="center"
            gap="28px"
          >
            <Box w="80%" textAlign="left">
              <Text variant="login">Log In</Text>
            </Box>
            <Box w="80%">
              <FormControl isRequired isInvalid={emailError}>
                <Input
                  variant="login"
                  placeholder="Your email address"
                  value={email}
                  onChange={handleEmailChange}
                />
                <FormErrorMessage>{emailErrorStr}</FormErrorMessage>
              </FormControl>
            </Box>
            <Box w="80%">
              <FormControl isRequired isInvalid={generalError}>
                <Input
                  variant="login"
                  type="password"
                  placeholder="Your password"
                  value={password}
                  onChange={handlePasswordChange}
                />
                <FormErrorMessage>{generalErrorStr}</FormErrorMessage>
              </FormControl>
            </Box>
            <Box w="80%">
              {isLoading ? (
                <Flex flexDirection="column" alignItems="center">
                  <Spinner
                    thickness="4px"
                    speed="0.65s"
                    emptyColor="gray.200"
                    size="lg"
                  />
                </Flex>
              ) : (
                <Button
                  variant="login"
                  _hover={
                    email && password
                      ? {
                          background: "teal.500",
                          transition:
                            "transition: background-color 0.5s ease !important",
                        }
                      : {}
                  }
                  onClick={onLoginClick}
                >
                  Log In
                </Button>
              )}
            </Box>
            <Box w="80%">
              <Flex gap="10px">
                <Text variant="loginSecondary" paddingRight="17px">
                  Not a member yet?
                </Text>
                <Text variant="loginTertiary" onClick={onSignUpClick}>
                  Sign Up Now
                </Text>
              </Flex>
            </Box>
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
