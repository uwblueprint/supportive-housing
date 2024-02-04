import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Input,
  Spinner,
  Text,
} from "@chakra-ui/react";
import AuthAPIClient from "../../../APIClients/AuthAPIClient";
import { isErrorResponse } from "../../../helper/error";
import { LOGIN_PAGE } from "../../../constants/Routes";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const ResetPasswordPage = (): React.ReactElement => {
  const history = useHistory();

  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<boolean>(false);
  const [emailErrorStr, setEmailErrorStr] = useState<string>("");

  const [resetPasswordClicked, setResetPasswordClicked] = useState<boolean>(
    false,
  );

  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value as string;
    setEmail(inputValue);

    if (resetPasswordClicked) {
      if (emailRegex.test(inputValue)) {
        setEmailErrorStr("");
        setEmailError(false);
      } else {
        setEmailErrorStr("Please enter a valid email.");
        setEmailError(true);
      }
    }
  };

  const handleResetPassword = async () => {
    setResetPasswordClicked(true);

    if (emailError) {
      return;
    }

    if (!emailRegex.test(email)) {
      setEmailErrorStr("Please enter a valid email.");
      setEmailError(true);
      return;
    }

    setIsLoading(true);
    const res = await AuthAPIClient.resetPassword(email);
    if (isErrorResponse(res)) {
      setEmailError(true);
      setEmailErrorStr(res.errMessage);
      setIsLoading(false);
    } else {
      setEmailSent(true);
      setIsLoading(false);
    }
  };

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
          {!emailSent ? (
            <>
              <Box w="80%" textAlign="left">
                <Text variant="login">Forgot your password?</Text>
              </Box>

              <Box w="80%" textAlign="left">
                <Text variant="loginSecondary">
                  Enter your email address below to recieve an email to reset
                  your password.
                </Text>
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
                {isLoading ? (
                  <Flex flexDirection="column" alignItems="center">
                    <Spinner
                      thickness="4px"
                      speed="0.65s"
                      emptyColor="gray.200"
                      size="lg"
                      margin="0 auto"
                      textAlign="center"
                    />
                  </Flex>
                ) : (
                  <Button
                    variant="login"
                    onClick={handleResetPassword}
                    _hover={{
                      background: "teal.500",
                      transition:
                        "transition: background-color 0.5s ease !important",
                    }}
                  >
                    Send Reset Password Email
                  </Button>
                )}
              </Box>
              <Box w="80%">
                <Flex gap="10px">
                  <Text variant="loginSecondary">
                    Remembered your password?
                  </Text>
                  <Text
                    variant="loginTertiary"
                    onClick={() => history.push(LOGIN_PAGE)}
                  >
                    Log In Now
                  </Text>
                </Flex>
              </Box>
            </>
          ) : (
            <>
              <Box w="80%" textAlign="left">
                <Text variant="login">Success!</Text>
              </Box>

              <Box w="80%" textAlign="left">
                <Text variant="loginSecondary">
                  {`A password reset email has been sent to ${email}. Click the link in the email and after completion, 
                    you'll be able to sign in with your new password. If you did not receive an email, please try again.`}
                </Text>
              </Box>

              <Box w="80%">
                <Button
                  variant="login"
                  onClick={() => history.push(LOGIN_PAGE)}
                  _hover={{
                    background: "teal.500",
                    transition:
                      "transition: background-color 0.5s ease !important",
                  }}
                >
                  Back To Login
                </Button>
              </Box>
            </>
          )}
        </Flex>
      </Box>

      <Box flex="1" bg="teal.400">
        {/* Background */}
      </Box>
    </Flex>
  );
};

export default ResetPasswordPage;
