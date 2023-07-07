import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Radio,
  RadioGroup,
  Text,
} from "@chakra-ui/react";
import commonApiClient from "../../APIClients/CommonAPIClient";
import RoleOptions from "../common/types/Roles";

interface InviteEmployeesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InviteEmployeesModal = ({
  isOpen,
  onClose,
}: InviteEmployeesModalProps): React.ReactElement => {
  const [invitedEmail, setInvitedEmail] = useState<string>("");
  const [invitedFirstName, setInvitedFirstName] = useState<string>("");
  const [invitedLastName, setInvitedLastName] = useState<string>("");
  const [invitedAdminStatus, setinvitedAdminStatus] = useState<string>("");
  const [
    isTwoFactorAuthenticated,
    setIsTwoFactorAuthenticated,
  ] = useState<boolean>(false);

  const onInviteEmployee = async () => {
    console.log("invitedEmail", invitedEmail);
    console.log("invitedFirstName", invitedFirstName);
    console.log("invitedLastName", invitedLastName);
    console.log("invitedAdminStatus", invitedAdminStatus);
    console.log("isTwoFactorAuthenticated", isTwoFactorAuthenticated);

    if (
      invitedEmail !== "" &&
      invitedFirstName !== "" &&
      invitedLastName !== "" &&
      invitedAdminStatus !== ""
    ) {
      let hasInvitedUser = false;
      if (invitedAdminStatus === "1") {
        hasInvitedUser = await commonApiClient.inviteUser(
          invitedEmail,
          RoleOptions[1],
          invitedFirstName,
          invitedLastName,
        );
      } else if (invitedAdminStatus === "2" && isTwoFactorAuthenticated) {
        hasInvitedUser = await commonApiClient.inviteUser(
          invitedEmail,
          RoleOptions[0],
          invitedFirstName,
          invitedLastName,
        );
      } else if (invitedAdminStatus === "2" && !isTwoFactorAuthenticated) {
        hasInvitedUser = await commonApiClient.inviteUser(
          invitedEmail,
          RoleOptions[2],
          invitedFirstName,
          invitedLastName,
        );
      }
      if (!hasInvitedUser) {
        console.log("error");
      } else {
        onClose();
        setInvitedEmail("");
        setInvitedFirstName("");
        setInvitedLastName("");
        setinvitedAdminStatus("");
        setIsTwoFactorAuthenticated(false);
        console.log("done");
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent
        minW="513px"
        maxW="513px"
        minH="484px"
        maxH="484px"
        borderRadius="8px"
      >
        <Box
          pl="24px"
          pr="16px"
          mt="10px"
          mb="10px"
          ml="10px"
          mr="10px"
          borderBottom="1px solid #EBECF0"
        >
          <ModalHeader>Add Employee</ModalHeader>
          <ModalCloseButton mt="5px" margin="inherit" size="lg" />
        </Box>
        <ModalBody>
          <Box pt="7px" pb="7px" pl="16px" pr="16px">
            <Box
              display="flex"
              flexDirection="row"
              alignItems="flex-start"
              justifyContent="space-between"
            >
              <Box w="46%">
                <Box display="flex" flexDirection="row">
                  <Heading size="xsm">First Name</Heading>
                </Box>
                <Input
                  mt="8px"
                  textStyle="body"
                  placeholder="Enter your first name"
                  maxLength={50}
                  value={invitedFirstName}
                  onChange={(event) => setInvitedFirstName(event.target.value)}
                />
              </Box>

              <Box w="46%">
                <Box display="flex" flexDirection="row">
                  <Heading size="xsm">Last Name</Heading>
                  <Text color="red" ml={1} mt={-2} fontSize="1em">
                    *
                  </Text>
                </Box>
                <Input
                  mt="8px"
                  textStyle="body"
                  placeholder="Enter your last name"
                  maxLength={50}
                  value={invitedLastName}
                  onChange={(event) => setInvitedLastName(event.target.value)}
                />
              </Box>
            </Box>
            <Box display="flex" flexDirection="row" mt="16px">
              <Heading size="xsm">SHOW Email</Heading>
              <Text color="red" ml={1} mt={-2} fontSize="1em">
                *
              </Text>
            </Box>
            <Input
              mt="8px"
              textStyle="body"
              placeholder="Enter your email"
              maxLength={254}
              value={invitedEmail}
              onChange={(event) => setInvitedEmail(event.target.value)}
            />
            <FormErrorMessage>Resident is required.</FormErrorMessage>
          </Box>
          <Box
            pt="17px"
            pb="7px"
            pl="24px"
            pr="24px"
            borderBottom="1px solid #EBECF0"
          >
            <RadioGroup
              value={invitedAdminStatus}
              onChange={setinvitedAdminStatus}
              pb="24px"
            >
              <Flex>
                <Box marginRight="24px">
                  <Radio size="lg" colorScheme="teal" color="black" value="1">
                    Admin
                  </Radio>
                </Box>
                <Box>
                  <Radio size="lg" colorScheme="teal" value="2">
                    Non Admin
                  </Radio>
                </Box>
              </Flex>
            </RadioGroup>
            <Checkbox
              size="lg"
              colorScheme="teal"
              borderRadius="40px"
              isChecked={isTwoFactorAuthenticated}
              onChange={(event) =>
                setIsTwoFactorAuthenticated(event.target.checked)
              }
            >
              Require Two Factor Authentication
            </Checkbox>
            <Text fontSize="xs">
              Requiring Two Factor Authentication means the employee will only
              be able to access the platform while physically in the main
              building
            </Text>
          </Box>
          <Box
            pt="10px"
            pb="10px"
            pl="16px"
            pr="16px"
            display="flex"
            justifyContent="flex-end"
          >
            <Button
              variant="primary"
              type="submit"
              onClick={() => {
                onInviteEmployee();
              }}
            >
              Invite
            </Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default InviteEmployeesModal;
