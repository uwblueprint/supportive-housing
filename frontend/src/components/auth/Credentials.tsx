import React, { useContext } from "react";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Radio,
  RadioGroup,
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
      <Flex>
        <Box>
          {/* BOX */}
        </Box>
      </Flex>
  );
  }
  return <></>;
};

export default Credentials;
