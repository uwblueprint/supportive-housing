import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Box,
  Image,
  Button,
  Stack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";

import {
  HOME_PAGE,
  RESIDENT_DIRECTORY_PAGE,
  EMPLOYEE_DIRECTORY_PAGE,
  SIGN_IN_LOGS_PAGE,
  TAGS_PAGE,
} from "../../constants/Routes";

import authAPIClient from "../../APIClients/AuthAPIClient";
import AuthContext from "../../contexts/AuthContext";

import SHOW_LOGO from "../../images/SHOW-Logo.png";

const NavigationBar = (): React.ReactElement => {
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);

  const history = useHistory();
  const navigateToHome = () => history.push(HOME_PAGE);
  const navigateToResidentDirectory = () =>
    history.push(RESIDENT_DIRECTORY_PAGE);

  const navigateToEmployeeDirectory = () =>
    history.push(EMPLOYEE_DIRECTORY_PAGE);

  const navigateToSignInLogs = () => history.push(SIGN_IN_LOGS_PAGE);

  const navigateToTags = () => history.push(TAGS_PAGE);

  const handleLogout = async () => {
    const success = await authAPIClient.logout(authenticatedUser?.id);
    if (success) {
      setAuthenticatedUser(null);
      navigateToHome();
    }
  };

  const [isMenuOpen, setMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setMenuOpen(!isMenuOpen);
  };

  return (
    <div>
      <Box
        bg="#1B2A2C"
        h="71px"
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle="solid"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Box
          mx="auto"
          my={2}
          w="1108px"
          h="65px"
          display="flex"
          alignItems="center"
        >
          <Image src={SHOW_LOGO} w="128px" h="51.61px" />

          <Stack
            flex={{ base: 1, md: "auto" }}
            justify="flex-end"
            direction="row"
            spacing={6}
            alignItems="center"
          >
            <Button variant="link button-navbar" onClick={navigateToHome}>
              Home
            </Button>

            <Button
              variant="link button-navbar"
              onClick={navigateToResidentDirectory}
            >
              Resident Directory
            </Button>

            {authenticatedUser?.role === "Admin" && (
              <Menu>
                <MenuButton
                  as={Button}
                  variant="link button-navbar"
                  onClick={handleMenuToggle}
                >
                  Admin Controls
                </MenuButton>
                {isMenuOpen && (
                  <MenuList>
                    <MenuItem onClick={navigateToEmployeeDirectory}>
                      Employee Directory
                    </MenuItem>
                    <MenuItem onClick={navigateToSignInLogs}>
                      Sign In Logs
                    </MenuItem>
                    <MenuItem onClick={navigateToTags}>Tags</MenuItem>
                  </MenuList>
                )}
              </Menu>
            )}

            <Button variant="link button-navbar" onClick={handleLogout}>
              Logout
            </Button>
          </Stack>
        </Box>
      </Box>
    </div>
  );
};

export default NavigationBar;
