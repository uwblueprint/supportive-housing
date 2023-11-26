import React, { useState, useContext } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { 
  Box, 
  Button, 
  Flex, 
  FormControl, 
  FormErrorMessage,
  Input, 
  Text 
} from "@chakra-ui/react";
import authAPIClient from "../../APIClients/AuthAPIClient";
import { HOME_PAGE, LOGIN_PAGE } from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";
import commonApiClient from "../../APIClients/CommonAPIClient";
import AUTHENTICATED_USER_KEY from "../../constants/AuthConstants";
import { isAuthErrorResponse } from "../../helper/authError";

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

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

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
  const [signupClicked, setSignupClicked] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<boolean>(false);
  const [emailErrorStr, setEmailErrorStr] = useState<string>("");
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [passwordErrorStr, setPasswordErrorStr] = useState<string>("");

  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
  const history = useHistory();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value as string;
    if (signupClicked) {
      if (emailRegex.test(inputValue)) {
        setEmailErrorStr("")
        setEmailError(false)
      } else {
        setEmailErrorStr("Please enter a valid email.")
        setEmailError(true)
      }
    }
    setEmail(inputValue)
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value as string;
    setPassword(inputValue)

    if (signupClicked) {
      if (inputValue.length >= 6) {
        setPasswordErrorStr("")
        setPasswordError(false)
      }
      else {
        setPasswordErrorStr("Password must be 6 characters long.")
        setPasswordError(true)
      }
    }
  }

  const onSignupClick = async () => {
    setSignupClicked(true)

    if (!emailRegex.test(email)) {
      setEmailErrorStr("Please enter a valid email.")
      setEmailError(true)
      return
    }

    if (password.length < 6) {
      setPasswordErrorStr("Password must be 6 characters long.")
      setPasswordError(true)
      return
    }
    
    const isInvited = await commonApiClient.isUserInvited(email);
    if (isInvited !== "Not Invited") {
      if (isAuthErrorResponse(isInvited)) {
        setEmailErrorStr(isInvited.errMessage)
        setEmailError(true)
      }
      else {
        const registerResponse = await authAPIClient.register(
          firstName,
          lastName,
          email,
          password,
        );
        if (registerResponse) {
          if (isAuthErrorResponse(registerResponse)) {
            setEmailErrorStr(registerResponse.errMessage)
            setEmailError(true)
          }
          else {
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
        }
      }
    }
  };

  const isCreateAccountBtnDisabled = () => 
    emailError || passwordError || email === '' || password === '' || firstName === '' || lastName === ''

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
            marginTop="172px" 
            display="flex" 
            align="center" 
            justify="center"
          >
            <Flex
              width="76%"
              align="flex-start"
              direction="column"
              gap="28px"
            >
              <Text variant="login" paddingBottom="12px">
                Sign Up
              </Text>
              <Input
                variant="login"
                placeholder="Your first name"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
              />
              <Input
                variant="login"
                placeholder="Your last name"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
              />
              <FormControl isRequired isInvalid={emailError}>
                <Input
                  variant="login"
                  placeholder="Your email"
                  value={email}
                  onChange={handleEmailChange}
                />
                <FormErrorMessage>{emailErrorStr}</FormErrorMessage>
              </FormControl>
              <FormControl isRequired isInvalid={passwordError}>
                <Input
                  variant="login"
                  type="password"
                  placeholder="Your password"
                  value={password}
                  onChange={handlePasswordChange}
                />
                <FormErrorMessage>{passwordErrorStr}</FormErrorMessage>
              </FormControl>
              <Button
                variant="login"
                disabled={isCreateAccountBtnDisabled()}
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
              <Flex
                paddingTop="29px"
                alignContent="center"
              >
                <Text variant="loginSecondary" paddingRight="17px">
                  Already have an account?
                </Text>
                <Text variant="loginTertiary" onClick={onLogInClick}>
                  Log In Now
                </Text>
              </Flex>
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
