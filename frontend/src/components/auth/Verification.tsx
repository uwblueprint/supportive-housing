import React, { useState, useEffect } from "react";
import { Redirect, useHistory } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  Text,
  VStack
} from "@chakra-ui/react";
import authAPIClient from "../../APIClients/AuthAPIClient";
import { HOME_PAGE } from "../../constants/Routes";

const Verification = (): React.ReactElement => {
  const history = useHistory();
  const [isVerified, setIsVerified] = useState<boolean | null>(null);

  const handleVerification = async () => {
    const verify = await authAPIClient.isVerified();
    setIsVerified(verify);
    if (!verify) {
      alert("ADD toast message");
    }
  };

  const checkVerification = async () => {
    const verify = await authAPIClient.isVerified();
    setIsVerified(verify);
  };

  useEffect(() => {
    if (isVerified) {
      history.push(HOME_PAGE);
    }
  }, [isVerified]);

  useEffect(() => {
    checkVerification();
  }, []);

  if (isVerified === null || isVerified === true) {
    return (
      <></>
    );
  }

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
