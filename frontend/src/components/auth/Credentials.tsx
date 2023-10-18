import React, { useContext, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Text,
  FormControl,
  FormErrorMessage,
  Input
} from "@chakra-ui/react";
import {
  GoogleLogin,
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from "react-google-login";
import { Redirect, useHistory } from "react-router-dom";
import authAPIClient from "../../APIClients/AuthAPIClient";
import AUTHENTICATED_USER_KEY from "../../constants/AuthConstants";
import { HOME_PAGE, SIGNUP_PAGE } from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";
import { ErrorResponse, LoginResponse } from "../../types/AuthTypes";
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

const isLoginErrorResponse = (res: LoginResponse | ErrorResponse) : res is ErrorResponse => {
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

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value as string;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (emailRegex.test(inputValue)) {
      setEmailError(false)
    } else {
      setEmailError(true)
    }
    setEmail(inputValue)
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value as string;
    setPassword(inputValue)
    setPasswordError(false)
    setPasswordErrStr("");
  };

  const onLogInClick = async () => {
    const isInvited = await commonApiClient.isUserInvited(email);
    if (isInvited) {
      const loginResponse: LoginResponse | ErrorResponse = await authAPIClient.login(
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
    document.body.style.overflow = "hidden"
    return (
      <Flex h="100vh">
        <Box w="47%">
          <Flex
            h="30%"
            w="36%"
            top="27%"
            left="6%"
            direction="column"
            position="absolute"
            justifyContent="space-between"
          >
            <Box display="flex"  alignItems="flex-start">
              <Text variant="login" position="absolute">
                Log In
              </Text>
            </Box>
            <Box>
              <FormControl isRequired isInvalid={emailError}>
                <Input 
                  variant="login"
                  position="absolute"
                  placeholder="Your email address"
                  value={email}
                  onChange={handleEmailChange}
                />
                <FormErrorMessage>Please enter a valid email.</FormErrorMessage>
              </FormControl>
            </Box>
            <Box>
              <FormControl isRequired isInvalid={passwordError}>
                <Input 
                  variant="login"
                  type="password"
                  position="absolute"
                  placeholder="Your password"
                  value={password}
                  onChange={handlePasswordChange}
                />
                <FormErrorMessage>{passwordErrorStr}</FormErrorMessage>
                </FormControl>
            </Box>
            <Box>
              <Button
                variant="login"
                position="absolute"
                disabled={email === '' || password === ''}
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
            </Box>
          </Flex>
          <Flex
            top="70%"
            left="6%"
            width="100%"
            direction="row"
            position="absolute"
            alignContent="center"
          >
            <Text variant="loginSecondary" paddingRight="1.1%">
              Not a member yet?
            </Text>
            <Text variant="loginTertiary" onClick={onSignUpClick}>
              Sign Up Now
            </Text>
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

export default Credentials;