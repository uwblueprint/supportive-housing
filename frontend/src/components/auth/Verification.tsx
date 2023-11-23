import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  Text,
  VStack
} from "@chakra-ui/react";
import authAPIClient from "../../APIClients/AuthAPIClient";
import AuthContext from "../../contexts/AuthContext";
import { HOME_PAGE } from "../../constants/Routes";

const Verification = (): React.ReactElement => {
  const history = useHistory();
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);

  const handleVerification = async () => {
    if (authenticatedUser) {
      const authUser = authenticatedUser;
      console.log(authUser.verified);
      authUser.verified = await authAPIClient.isVerified();
      setAuthenticatedUser(authUser);
      console.log(authenticatedUser);
      
      if (authenticatedUser.verified === false) {
        alert("ADD toast message");
      } else {
        history.push(HOME_PAGE);
      }
    }
  };

  return (
    <>
      <Box bg="teal.400" height="100vh">
        <Flex bg="white" height="100vh" width="47%" justifyContent="center" alignItems="center">
          <VStack width="75%" align="flex-start" gap="3vh">
            <Text variant="login">Verification</Text>
            <Text variant="loginSecondary">In order to start using your SHOW account, you need to confirm your email address.</Text>
            <Button
              variant="login"
              onClick={handleVerification}
              _hover={
                {
                  background: "teal.500",
                  transition:
                    "transition: background-color 0.5s ease !important",
                }
              }
            >
              Verify Email Address
            </Button>
          </VStack>
        </Flex>
      </Box>
    </>
  );
};

export default Verification;
