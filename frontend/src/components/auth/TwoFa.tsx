import React, { useContext, useState, useRef } from "react";
import { Redirect } from "react-router-dom";
import {
  Box,
  Button,
  Center,
  Flex,
  Input,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import authAPIClient from "../../APIClients/AuthAPIClient";
import AUTHENTICATED_USER_KEY from "../../constants/AuthConstants";
import { HOME_PAGE } from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";
import { AuthenticatedUser } from "../../types/AuthTypes";
import CreateToast from "../common/Toasts";
import { isErrorResponse } from "../../helper/error";

type TwoFaProps = {
  email: string;
  password: string;
  token: string;
  toggle: boolean;
};

const TwoFa = ({
  email,
  password,
  token,
  toggle,
}: TwoFaProps): React.ReactElement => {
  const newToast = CreateToast();
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
  const [authCode, setAuthCode] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const twoFaSubmit = async () => {
    // Uncomment this if Google/Outlook sign in is ever needed
    // authUser = await authAPIClient.twoFaWithGoogle(authCode, token);

    if (authCode.length < 6) {
      newToast(
        "Authentication Failed",
        "Please enter a 6 digit authentication code.",
        "error",
      );
      return;
    }

    setIsLoading(true);
    const authUser = await authAPIClient.twoFa(authCode, email, password);

    if (isErrorResponse(authUser)) {
      setIsLoading(false);
      newToast("Authentication Failed", authUser.errMessage, "error");
    } else {
      localStorage.setItem(AUTHENTICATED_USER_KEY, JSON.stringify(authUser));
      setAuthenticatedUser(authUser);
    }
  };

  const handleAuthCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAuthCode = e.target.value;
    if (newAuthCode !== null && /^[0-9]{0,6}$/.test(newAuthCode)) {
      setAuthCode(newAuthCode);
    }
  };

  const handleFocus = () => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus();
    }
  };

  if (authenticatedUser) {
    return <Redirect to={HOME_PAGE} />;
  }

  const boxIndexes = [0, 1, 2, 3, 4, 5];

  if (toggle) {
    return (
      <>
        <Box bg="teal.400" height="100vh" onClick={handleFocus}>
          <Flex
            bg="white"
            height="100vh"
            width="47%"
            justifyContent="center"
            alignItems="center"
          >
            <VStack width="75%" align="flex-start" gap="3vh">
              <Text variant="login">One last step!</Text>
              <Text variant="loginSecondary">
                In order to protect your account, please enter the 6 digit
                authentication code from the Authenticator extension.
              </Text>
              <Flex direction="row" width="100%" justifyContent="space-between">
                {boxIndexes.map((boxIndex) => {
                  return (
                    <Flex
                      key={boxIndex}
                      width="56px"
                      height="56px"
                      border="1px solid #A7A7A7"
                      borderRadius="4px"
                      justify="center"
                      align="center"
                    >
                      <Text variant="authyDigit" textAlign="center">
                        {authCode.length > boxIndex ? authCode[boxIndex] : " "}
                      </Text>
                    </Flex>
                  );
                })}
              </Flex>
              {isLoading ? (
                <Flex width="100%">
                  <Spinner
                    thickness="4px"
                    speed="0.65s"
                    emptyColor="gray.200"
                    size="lg"
                    margin="0 auto"
                    textAlign="center"
                  />{" "}
                </Flex>
              ) : (
                <Button
                  variant="login"
                  _hover={{
                    background: "teal.500",
                    transition:
                      "transition: background-color 0.5s ease !important",
                  }}
                  onClick={twoFaSubmit}
                >
                  Authenticate
                </Button>
              )}
              <Input
                ref={inputRef}
                autoFocus
                position="absolute"
                left="-999999px"
                value={authCode}
                onChange={handleAuthCode}
              />
            </VStack>
          </Flex>
        </Box>
      </>
    );
  }
  return <></>;
};

export default TwoFa;
