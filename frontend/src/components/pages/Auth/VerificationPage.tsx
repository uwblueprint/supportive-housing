import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { Box, Button, Flex, Spinner, Text } from "@chakra-ui/react";
import authAPIClient from "../../../APIClients/AuthAPIClient";
import CreateToast from "../../common/Toasts";
import AuthContext from "../../../contexts/AuthContext";
import { HOME_PAGE } from "../../../constants/Routes";
import AUTHENTICATED_USER_KEY from "../../../constants/AuthConstants";
import { AuthenticatedUser } from "../../../types/AuthTypes";

const VerificationPage = (): React.ReactElement => {
  const newToast = CreateToast();
  const history = useHistory();
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleVerification = async () => {
    if (authenticatedUser) {
      setIsLoading(true);
      const isVerified = await authAPIClient.isVerified();

      if (isVerified === false) {
        setIsLoading(false);
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
              In order to start using your SHOW account, you need to confirm
              your email address.
            </Text>
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
        </Flex>
      </Box>

      <Box flex="1" bg="teal.400">
        {/* Background */}
      </Box>
    </Flex>
  );
};

export default VerificationPage;
