import React, { useState, useContext } from "react";
import { Redirect, useHistory } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Input,
  Spinner,
  Text,
  Image,
} from "@chakra-ui/react";
import authAPIClient from "../../APIClients/AuthAPIClient";
import { HOME_PAGE, LOGIN_PAGE } from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";
import AUTHENTICATED_USER_KEY from "../../constants/AuthConstants";
import { isAuthErrorResponse, isErrorResponse } from "../../helper/error";
import UserAPIClient from "../../APIClients/UserAPIClient";
import { UserStatus } from "../../types/UserTypes";
import SHOW_LOGO from "../../images/show-logo-colour.png";

type SignupProps = {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  toggle: boolean;
  setToggle: (toggle: boolean) => void;
};

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const Signup = ({
  email,
  setEmail,
  password,
  setPassword,
  toggle,
  setToggle,
}: SignupProps): React.ReactElement => {
  const [signupClicked, setSignupClicked] = useState<boolean>(false);

  const [emailError, setEmailError] = useState<boolean>(false);
  const [emailErrorStr, setEmailErrorStr] = useState<string>("");

  const [generalError, setGeneralError] = useState<boolean>(false);
  const [generalErrorStr, setGeneralErrorStr] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
  const history = useHistory();
  
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value as string;
    setEmail(inputValue);

    if (signupClicked) {
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

    if (signupClicked) {
      if (inputValue.length >= 6) {
        setGeneralErrorStr("");
        setGeneralError(false);
      } else {
        setGeneralErrorStr("Password must be at least 6 characters long.");
        setGeneralError(true);
      }
    }
  };

  const onSignupClick = async () => {
    setSignupClicked(true);

    if (emailError || generalError) {
      return;
    }

    if (!emailRegex.test(email)) {
      setEmailErrorStr("Please enter a valid email.");
      setEmailError(true);
      return;
    }

    if (password.length < 6) {
      setGeneralErrorStr("Password must be at least 6 characters long.");
      setGeneralError(true);
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
    } else if (res === UserStatus.ACTIVE) {
      setGeneralError(true);
      setGeneralErrorStr("This email address is already active. Log in now!");
      setIsLoading(false);
    } else if (res === UserStatus.INVITED) {
      const registerResponse = await authAPIClient.register(
        email,
        password,
      );
      if (isAuthErrorResponse(registerResponse)) {
        setGeneralErrorStr(registerResponse.errMessage);
        setGeneralError(true);
        setIsLoading(false);
      } else {
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
      setGeneralError(true);
      setGeneralErrorStr("Unable to sign up. Please try again.");
      setIsLoading(false);
    }
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
            <Box w="80%" textAlign="center">
              <Flex flexDirection="column" alignItems="center">
                <Image src={SHOW_LOGO} h="100px" />
              </Flex>
            </Box>
            <Box w="80%" textAlign="left">
              <Text variant="login">Sign Up</Text>
            </Box>
            <Box w="80%">
              <FormControl isRequired isInvalid={emailError}>
                <Input
                  variant="login"
                  placeholder="Your email"
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
                  _hover={{
                    background: "teal.500",
                    transition:
                      "transition: background-color 0.5s ease !important",
                  }}
                  onClick={onSignupClick}
                >
                  Create Account
                </Button>
              )}
            </Box>
            <Box w="80%">
              <Flex gap="10px">
                <Text variant="loginSecondary">Already have an account?</Text>
                <Text
                  variant="loginTertiary"
                  onClick={() => history.push(LOGIN_PAGE)}
                >
                  Log In Now
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

export default Signup;
