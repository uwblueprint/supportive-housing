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
            h="70%"
            marginTop="15%"
            direction="column"
            justify="center"
            justifyContent="space-between"
            align="center"
          >
            <Box mr="58%">
              <Text variant="login">
                Sign Up
              </Text>
            </Box>
            <Box w="80%">
              <Input
                variant="login"
                placeholder="Your first name"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
              />
            </Box>
            <Box w="80%">
              <Input
                variant="login"
                placeholder="Your last name"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
              />
            </Box>
            <Box w="80%">
              <Input
                variant="login"
                placeholder="Your email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </Box>
            <Box w="80%">
              <Input
                variant="login"
                type="password"
                placeholder="Your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </Box>
            <Box w="80%">
              <Button
                variant="login"
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
          
            <Flex 
            width="80%"
            direction="row"
            alignContent="center"
            marginTop="3%"
            >
              <Text variant="loginSecondary" paddingRight="1.1vw">
                Already have an account?
              </Text>
              <Text variant="loginTertiary" onClick={onLogInClick}>
                Log In Now
              </Text>
            </Flex>
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
