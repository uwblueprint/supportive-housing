import React, { useContext, useState, useRef } from "react";
import { Redirect } from "react-router-dom";
import { Box, Button, Flex, Input, Text, VStack } from "@chakra-ui/react";
import authAPIClient from "../../APIClients/AuthAPIClient";
import AUTHENTICATED_USER_KEY from "../../constants/AuthConstants";
import { HOME_PAGE } from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";
import { AuthenticatedUser } from "../../types/AuthTypes";

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
  const [error, setError] = useState("");
  const [authCode, setAuthCode] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  const onAuthySubmit = async () => {
    let authUser: AuthenticatedUser | null;

    if (token) {
      authUser = await authAPIClient.twoFaWithGoogle(authCode, token);
    } else {
      authUser = await authAPIClient.twoFa(authCode, email, password);
    }

    if (authUser) {
      localStorage.setItem(AUTHENTICATED_USER_KEY, JSON.stringify(authUser));
      setAuthenticatedUser(authUser);
    } else {
      setError("Error: Invalid token");
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
                In order to protect your account, please enter the authorization
                code from the Twilio Authy application.
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
              <Button
                variant="login"
                disabled={authCode.length < 6}
                _hover={{
                  background: "teal.500",
                  transition:
                    "transition: background-color 0.5s ease !important",
                }}
              >
                Authenticate
              </Button>
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

export default Authy;
