import React, { useContext } from "react";
import {
  Box,
  Button,
  Flex,
  Input,
  Text,
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
import { LoginResponse } from "../../types/AuthTypes";
import commonApiClient from "../../APIClients/CommonAPIClient";

type GoogleResponse = GoogleLoginResponse | GoogleLoginResponseOffline;

type GoogleErrorResponse = {
  error: string;
  details: string;
};

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

  const onGoogleLoginSuccess = async (tokenId: string) => {
    setToken(tokenId);
    const loginResponse: LoginResponse = await authAPIClient.loginWithGoogle(
      tokenId,
    );
    if (loginResponse) {
      const { requiresTwoFa, authUser } = loginResponse;
      if (requiresTwoFa) {
        setToggle(!toggle);
      }
      localStorage.setItem(AUTHENTICATED_USER_KEY, JSON.stringify(authUser));
      setAuthenticatedUser(authUser);
    }
    // Otherwise we can display some sort of error
  };

  if (authenticatedUser) {
    return <Redirect to={HOME_PAGE} />;
  }

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
              <Text variant="login">
                Log In
              </Text>
            </Box>
            <Box w="80%">
              <Input 
                variant="login"
                placeholder="Your email address"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </Box>
            <Box w="80%">
              <Input 
                variant="login"
                type="password"
                placeholder="Your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                />
            </Box>
            <Box w="80%">
              <Button
                variant="login"
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
            <Box w="80%">
              <Flex gap="10px">
                <Text variant="loginSecondary">
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

export default Credentials;