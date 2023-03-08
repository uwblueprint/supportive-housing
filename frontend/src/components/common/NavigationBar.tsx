import React from "react";
import {
  Box,
  Flex,
  HStack,
  Link,
  IconButton,
  Image,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
} from "@chakra-ui/react";

import avatarImage from "../../images/avatar.png";
import Logo from "../../images/Logo.png"

type NavigationItemProps = {
  onClick: () => void;
  text: string;
};

const NavigationItem: React.FC<NavigationItemProps> = ({ onClick, text }: NavigationItemProps) => {
  return (
    <button type="button" onClick={onClick}>
      {text}
    </button>
  );
};

const NavigationBar = (): React.ReactElement => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div className="Navigation Bar">
      <Box position="fixed" top={0} left={0} right={0} bg='#285E61' px={4}>
        <Flex h={16} alignItems="center" justifyContent="space-between">
          <IconButton
            size="md"
            aria-label="Open Menu"
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems="center">
            <HStack
              as="nav"
              spacing={4}
              display={{ base: "none", md: "flex" }}
            />
            <Image
                  src={Logo}
                />
            <NavigationItem onClick={() => console.log('Home clicked')} text="Home" />
            <NavigationItem onClick={() => console.log('About clicked')} text="Resident Directory" />
            <NavigationItem onClick={() => console.log('Contact clicked')} text="Admin" />
          </HStack>
          <Flex alignItems="center">
            <Menu>
              <MenuButton
                as={Button}
                rounded="full"
                variant="link"
                cursor="pointer"
                minW={0}
              >
                <Image
                  borderRadius='full'
                  boxSize='50px'
                  src={avatarImage}
                />
              </MenuButton>
              <MenuList>
                <MenuItem>Sign Out</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as="nav" spacing={4} />
          </Box>
        ) : null}
      </Box>

      <Box p={4}>Main Content Here</Box>
    </div>
  );
};

export default NavigationBar;
