import React from "react";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import { HOME_PAGE } from "../../../constants/Routes";

const Login = (): React.ReactElement => {
  const history = useHistory();

  const onHomeClick = () => {
    history.push(HOME_PAGE);
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
            <Text variant="login">Page Not Found</Text>
          </Box>
          <Box w="80%" textAlign="left">
            <Text variant="loginSecondary">
              The page you are looking for does not exist.
            </Text>
          </Box>
          <Box w="80%">
            <Button variant="login" onClick={onHomeClick}>
              Back To Home
            </Button>
          </Box>
        </Flex>
      </Box>
      <Box flex="1" bg="teal.400">
        {/* Background */}
      </Box>
    </Flex>
  );
};

export default Login;
