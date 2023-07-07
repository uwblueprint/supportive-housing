import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
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

const InviteEmployeesModal = (): React.ReactElement => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const [invitedEmail, setInvitedEmail] = useState<string>("");
  const [invitedFirstName, setInvitedFirstName] = useState<string>("");
  const [invitedLastName, setInvitedLastName] = useState<string>("");
  const [invitedAdminStatus, setinvitedAdminStatus] = useState<string>("");
  const [
    isTwoFactorAuthenticated,
    setIsTwoFactorAuthenticated,
  ] = useState<boolean>(false);

  const [invitedEmailError, setInvitedEmailError] = useState<boolean>(false);
  const [invitedFirstNameError, setInvitedFirstNameError] = useState<boolean>(
    false,
  );
  const [invitedLastNameError, setInvitedLastNameError] = useState<boolean>(
    false,
  );
  const [
    invitedAdminStatusError,
    setInvitedAdminStatusError,
  ] = useState<boolean>(false);

  useEffect(() => {
    if (invitedAdminStatus === "1") {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [invitedAdminStatus]);

  const handleFirstNameChange = (e: { target: { value: unknown } }) => {
    const inputValue: string = e.target.value as string;
    setInvitedFirstName(inputValue);
    if (inputValue) {
      setInvitedFirstNameError(false);
    } else {
      setInvitedFirstNameError(true);
    }
  };

  const handleLastNameChange = (e: { target: { value: unknown } }) => {
    const inputValue: string = e.target.value as string;
    setInvitedLastName(inputValue);
    if (inputValue) {
      setInvitedLastNameError(false);
    } else {
      setInvitedLastNameError(true);
    }
  };

  const handleEmailChange = (e: { target: { value: unknown } }) => {
    const inputValue: string = e.target.value as string;
    setInvitedEmail(inputValue);
    if (inputValue.endsWith("@supportivehousing.com")) {
      setInvitedEmailError(false);
    } else {
      setInvitedEmailError(true);
    }
  };

  const handleAdminChange = (inputValue: string) => {
    setinvitedAdminStatus(inputValue);
    if (invitedAdminStatus !== "") {
      setInvitedAdminStatusError(false);
    } else {
      setInvitedAdminStatusError(true);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    setInvitedEmail("");
    setInvitedFirstName("");
    setInvitedLastName("");
    setinvitedAdminStatus("");
    setIsTwoFactorAuthenticated(false);

    setInvitedEmailError(false);
    setInvitedFirstNameError(false);
    setInvitedLastNameError(false);
    setInvitedAdminStatusError(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const onInviteEmployee = async () => {
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
      // TO DO: add toast for error and success
      if (!hasInvitedUser) {
        console.log("error");
      } else {
        handleClose();
      }
    }
  };

  const handleSubmit = () => {
    setInvitedEmailError(invitedEmail === "");
    setInvitedFirstNameError(invitedFirstName === "");
    setInvitedLastNameError(invitedLastName === "");
    setInvitedAdminStatusError(invitedAdminStatus === "");

    if (
      !invitedEmailError &&
      !invitedFirstNameError &&
      !invitedLastNameError &&
      !setInvitedAdminStatusError
    ) {
      onInviteEmployee();
    }
  };

  return (
    <>
      <Button size="lg" variant="solid" colorScheme="pink" onClick={handleOpen}>
        Test Invite Employee Form Modal
      </Button>
      <Modal isOpen={isOpen} onClose={handleClose} isCentered>
        <ModalOverlay />
        <ModalContent minW="513px" maxW="513px" minH="484px" borderRadius="8px">
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
                  <FormControl isRequired isInvalid={invitedFirstNameError}>
                    <FormLabel>First Name</FormLabel>
                    <Input
                      placeholder="Enter first name"
                      value={invitedFirstName}
                      onChange={handleFirstNameChange}
                      maxLength={50}
                    />
                    <FormErrorMessage>First Name is required.</FormErrorMessage>
                  </FormControl>
                </Box>

                <Box w="46%">
                  <FormControl isRequired isInvalid={invitedLastNameError}>
                    <FormLabel>Last Name</FormLabel>
                    <Input
                      placeholder="Enter last name"
                      value={invitedLastName}
                      onChange={handleLastNameChange}
                      maxLength={50}
                    />
                    <FormErrorMessage>Last Name is required.</FormErrorMessage>
                  </FormControl>
                </Box>
              </Box>
              <Box display="flex" flexDirection="row" mt="16px">
                <FormControl isRequired isInvalid={invitedEmailError}>
                  <FormLabel>SHOW Email</FormLabel>
                  <Input
                    placeholder="Enter SHOW email"
                    value={invitedEmail}
                    onChange={handleEmailChange}
                    maxLength={254}
                  />
                  <FormErrorMessage>A SHOW email is required.</FormErrorMessage>
                </FormControl>
              </Box>
            </Box>
            <Box
              pt="17px"
              pb="7px"
              pl="24px"
              pr="24px"
              borderBottom="1px solid #EBECF0"
            >
              <FormControl isRequired isInvalid={invitedAdminStatusError}>
                <RadioGroup
                  value={invitedAdminStatus}
                  onChange={handleAdminChange}
                  pb="24px"
                >
                  <Flex>
                    <Box marginRight="24px">
                      <Radio
                        size="lg"
                        colorScheme="teal"
                        color="black"
                        value="1"
                      >
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
                <FormErrorMessage>A selection is required.</FormErrorMessage>
              </FormControl>
              <Checkbox
                size="lg"
                colorScheme="teal"
                borderRadius="40px"
                isChecked={isTwoFactorAuthenticated}
                isDisabled={isDisabled}
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
              <Button variant="primary" type="submit" onClick={handleSubmit}>
                Invite
              </Button>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default InviteEmployeesModal;
