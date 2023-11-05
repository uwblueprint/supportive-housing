import React, { useContext } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { Box, Button, Flex, Input, Text } from "@chakra-ui/react";
import authAPIClient from "../../APIClients/AuthAPIClient";
import { HOME_PAGE, LOGIN_PAGE } from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";
import commonApiClient from "../../APIClients/CommonAPIClient";
import AUTHENTICATED_USER_KEY from "../../constants/AuthConstants";

type SignupProps = {
  email: string;
  setEmail: (email: string) => void;
  firstName: string;
  setFirstName: (firstName: string) => void;
  lastName: string;
  setLastName: (lastName: string) => void;
  password: string;
  setPassword: (password: string) => void;
  toggle: boolean;
  setToggle: (toggle: boolean) => void;
};

const Signup = ({
  email,
  setEmail,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  password,
  setPassword,
  toggle,
  setToggle,
}: SignupProps): React.ReactElement => {
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
  const history = useHistory();

  const onSignupClick = async () => {
    const isInvited = await commonApiClient.isUserInvited(email);
    if (isInvited) {
      const registerResponse = await authAPIClient.register(
        firstName,
        lastName,
        email,
        password,
      );
      if (registerResponse) {
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
      // TODO: make this alert better and also differentiate between
      // when a user is not invited and when a user's account already exists
      // eslint-disable-next-line no-alert
      window.alert("user not invited");
    }
  };

  const onLogInClick = () => {
    history.push(LOGIN_PAGE);
  };

  if (authenticatedUser) {
    return <Redirect to={HOME_PAGE} />;
  }

  if (toggle) {   
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
              <Input
                variant="login"
                position="absolute"
                placeholder="Your email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </Box>
            <Box>
              <Input
                variant="login"
                type="password"
                position="absolute"
                placeholder="Your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </Box>
            <Box>
              <Button
                variant="login"
                position="absolute"
                disabled={
                  email === "" ||
                  password === "" ||
                  firstName === "" ||
                  lastName === ""
                }
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
            width="64%"
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
  }
  return <></>;
};

export default Signup;
