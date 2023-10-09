import React, { useContext, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Input,
  Text,
} from "@chakra-ui/react";
import { Redirect } from "react-router-dom";

import authAPIClient from "../../APIClients/AuthAPIClient";
import { HOME_PAGE } from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";
import { AuthenticatedUser } from "../../types/AuthTypes";
import commonApiClient from "../../APIClients/CommonAPIClient";

const Signup = (): React.ReactElement => {
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [passwordError, setPasswordError]

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
    } else {
      // TODO: make this alert better and also differentiate between
      // when a user is not invited and when a user's account already exists
      // eslint-disable-next-line no-alert
      window.alert("user not invited");
    }
  };

  if (authenticatedUser) {
    return <Redirect to={HOME_PAGE} />;
  }

  return (
    <Box>
      {/* init */}
    </Box>
  );
};

export default Signup;
