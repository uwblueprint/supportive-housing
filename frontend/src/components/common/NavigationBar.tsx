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

import SHOW_LOGO from "../../images/SHOW-Logo.png"

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
      <Box
        bg="#1A202C"
        color={useColorModeValue('gray', 'gray.800')}
        h='97px'
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle='solid'
        borderColor={useColorModeValue('gray.200', 'gray.900')}
        display='flex'
        justifyContent='center'
        alignItems='center' >
        <Box 
        mx="auto" 
        my={2} 
        w="1108px" 
        h="65px"
        display='flex'
        alignItems='center'>
          <Image src={SHOW_LOGO} />
        <Stack
          flex={{ base: 1, md: "auto" }}
          justify='flex-end'
          direction='row'
          spacing={6}
          alignItems="center">
          <Button
            variant='link'
            className='navbar-text'>
            Home
          </Button>
          <Button
            variant='link'
            marginLeft="48px"
            className='navbar-text'>
            Resident Directory
          </Button>
          <Button
            variant='link'
            marginLeft="48px"
            className='navbar-text'>
            Employee Directory
          </Button>
          <Button
            variant='link'
            marginLeft="48px"
            className='navbar-text'>
            Logout
          </Button>
        </Stack>
        </Box>
      </Box>
    </div >
  );
};

export default NavigationBar;