import React, { useContext, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Input,
  Text,
} from "@chakra-ui/react";
import { Redirect, useHistory } from "react-router-dom";
import authAPIClient from "../../APIClients/AuthAPIClient";
import { HOME_PAGE, LOGIN_PAGE } from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";
import { AuthenticatedUser } from "../../types/AuthTypes";
import commonApiClient from "../../APIClients/CommonAPIClient";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input
} from '@chakra-ui/react'

const Signup = (): React.ReactElement => {
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();
  // const [passwordError, setPasswordError]

  const [emailError, setEmailError] = useState<boolean>(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value as string;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (emailRegex.test(inputValue)) {
      setEmailError(false)
    } else {
      setEmailError(true)
    }
    setEmail(inputValue)
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value as string;
    setPassword(inputValue)
  }

  const onSignupClick = async () => {
    const isInvited = await commonApiClient.isUserInvited(email);
    if (isInvited) {
      const user: AuthenticatedUser | null = await authAPIClient.register(
        firstName,
        lastName,
        email,
        password,
      );
      setAuthenticatedUser(user);
    }
  };

  const onLogInClick = () => {
    history.push(LOGIN_PAGE);
  }; 

  if (authenticatedUser) {
    return <Redirect to={HOME_PAGE} />;
  }
  // Lock scroll
  document.body.style.overflow = "hidden"
  return (
    <Flex h="100vh">
        <Box w="47%">
          <Flex
            display="flex"  
            alignItems="flex-start"
            position="absolute"
            top="17.5%"
            left="6%"
            w="100%"
          >
            <Text variant="login" position="absolute">
              Sign Up
            </Text>
          </Flex>
          <Flex
            h="40%"
            w="36%"
            top="28%"
            left="6%"
            direction="column"
            position="absolute"
            justifyContent="space-between"
          >
            <Box>
              <Input 
                variant="login"
                position="absolute"
                placeholder="Your first name"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
              />
            </Box>
            <Box>
              <Input 
                variant="login"
                position="absolute"
                placeholder="Your last name"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
              />
            </Box>
            <Box>
              <FormControl isRequired isInvalid={emailError}>
                <Input 
                  variant="login"
                  position="absolute"
                  placeholder="Your email"
                  value={email}
                  onChange={handleEmailChange}
                />
                <FormErrorMessage>Please enter a valid email.</FormErrorMessage>
              </FormControl>
            </Box>
            <Box>
              <FormControl isRequired>
                <Input 
                  variant="login"
                  type="password"
                  position="absolute"
                  placeholder="Your password"
                  value={password}
                  onChange={handlePasswordChange}
                />
              </FormControl>
            </Box>
            <Box>
              <Button
                variant="login"
                position="absolute"
                disabled={email === '' || password === '' || firstName === '' || lastName === ''}
                _hover={
                  email && password && firstName && lastName
                    ? {
                        background: "teal.500",
                        transition:
                          "transition: background-color 0.5s ease !important",
                      }
                    : {}
                }
                onClick={onSignupClick}
              >
                Create Account
              </Button>
            </Box>
          </Flex>
          <Flex
            top="80%"
            left="6%"
            width="100%"
            direction="row"
            position="absolute"
            alignContent="center"
          >
            <Text variant="loginSecondary" paddingRight="1.1%">
              Already have an account?
            </Text>
            <Text variant="loginTertiary" onClick={onLogInClick}>
              Log In Now
            </Text>
          </Flex>
        </Box>
        <Box flex="1" bg="teal.400">
          {/* Background */}
        </Box>
    </Flex>
  );
};

export default Signup;
