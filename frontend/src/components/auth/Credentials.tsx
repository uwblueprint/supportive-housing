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
              <Input 
                variant="login"
                position="absolute"
                placeholder="Your email address"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </Box>
            <Box>
              <Input 
                  variant="login"
                  type="password"
                  position="absolute"
                  placeholder="Your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
            </Box>
            <Box>
              <Button
                variant="login"
                position="absolute"
                disabled={email === '' || password === ''}
                type="button"
                onClick={onLogInClick}
                
              >
                Log In
              </Button>
            </Box>
          </Flex>
          <Flex
            top="70%"
            left="6%"
            direction="row"
            position="absolute"
            width="100%"
            alignContent="center"
          >
            <Text
            fontWeight="400"
            fontSize="18px"
            lineHeight="23.44px"
            paddingRight="1.1%"
            color="#535353"
            >
                Not a member yet?
            </Text>
            <Text
              fontWeight="500"
              fontSize="18px"
              lineHeight="23.44px"
              color="#285E61"
              onClick={onSignUpClick}
            >
              Sign Up Now
            </Text>
          </Flex>
        </Box>
        <Box flex="1" bg="#285E61">
          {/* Green Background */}
        </Box>
      </Flex>
  );
  }
  return <></>;
};

export default Credentials;