import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { Box, Button, Flex, Spinner, Text } from "@chakra-ui/react";
import CreateToast from "../../common/Toasts";
import AuthContext from "../../../contexts/AuthContext";
import { HOME_PAGE } from "../../../constants/Routes";
import AUTHENTICATED_USER_KEY from "../../../constants/AuthConstants";
import { AuthenticatedUser } from "../../../types/AuthTypes";
import AuthAPIClient from "../../../APIClients/AuthAPIClient";

const VerificationPage = (): React.ReactElement => {
  const newToast = CreateToast();
  const history = useHistory();
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);

  const [isVerifyLoading, setIsVerifyLoading] = useState<boolean>(false);
  const [isResendLoading, setIsResendLoading] = useState<boolean>(false);

  const handleVerification = async () => {
    if (authenticatedUser) {
      setIsVerifyLoading(true);
      const isVerified = await AuthAPIClient.isVerified();

      if (isVerified === false) {
        setIsVerifyLoading(false);
        newToast(
          "Not Verified",
          "Please check your email for the verification email.",
          "error",
        );
      } else {
        const newAuthenticatedUser: AuthenticatedUser = {
          ...authenticatedUser,
          verified: true,
        };

        localStorage.setItem(
          AUTHENTICATED_USER_KEY,
          JSON.stringify(newAuthenticatedUser),
        );
        setAuthenticatedUser(newAuthenticatedUser);

        history.push(HOME_PAGE);
      }
    }
  };

  const resendVerify = async () => {
    if (authenticatedUser) {
      const { email } = authenticatedUser;
      setIsResendLoading(true);

      const success = await AuthAPIClient.resendVerify(email);

      if (success) {
        newToast("Success", `An email has been resent to ${email}.`, "success");
      } else {
        newToast(
          "Error",
          `Unable to resend an email to ${email}. Please try again.`,
          "error",
        );
      }
      setIsResendLoading(false);
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
          <Box w="80%" textAlign="left">
            <Text variant="login">Verification</Text>
          </Box>

          <Box w="80%" textAlign="left">
            <Text variant="loginSecondary">
              To verify your email address, a verification link has been sent to
              your inbox. After clicking the link in the email, click the button
              below to proceed.
            </Text>
          </Box>

          <Box w="80%">
            {isVerifyLoading ? (
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
                onClick={handleVerification}
                _hover={{
                  background: "teal.500",
                  transition:
                    "transition: background-color 0.5s ease !important",
                }}
              >
                Verify Email Address
              </Button>
            )}
          </Box>

          <Box w="80%">
            <Flex gap="10px">
              <Text variant="loginSecondary">
                Didn&apos;t recieve an email?
              </Text>
              <Text variant="loginTertiary" onClick={() => resendVerify()}>
                Click here to resend
              </Text>
              {isResendLoading && (
                <Spinner
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  size="md"
                />
              )}
            </Flex>
          </Box>
        </Flex>
      </Box>

      <Box flex="1" bg="teal.400">
        {/* Background */}
      </Box>
    </Flex>
  );
};

export default VerificationPage;
