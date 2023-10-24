import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Divider,
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
  ModalFooter,
  Radio,
  RadioGroup,
  Text,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import commonApiClient from "../../APIClients/CommonAPIClient";
import { INVITE_EMPLOYEE_ERROR } from "../../constants/ErrorMessages";
import CreateToast from "../common/Toasts";

type Props = {
  userPageNum: number;
  numUsers: number;
  getRecords: (pageNumber: number) => Promise<void>;
  setUserPageNum: React.Dispatch<React.SetStateAction<number>>;
  setNumUsers: React.Dispatch<React.SetStateAction<number>>;
}
const RoleOptions = ["Relief Staff", "Admin", "Regular Staff"];

const CreateEmployee = ({
  userPageNum,
  numUsers,
  getRecords,
  setUserPageNum,
  setNumUsers,
}: Props): React.ReactElement => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const newToast = CreateToast();

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
    const inputValue = e.target.value as string;
    if (/^[a-z]{0,}$/i.test(inputValue)) {
      setInvitedFirstName(inputValue);
      setInvitedFirstNameError(false);
    }
  };

  const handleLastNameChange = (e: { target: { value: unknown } }) => {
    const inputValue = e.target.value as string;
    if (/^[a-z]{0,}$/i.test(inputValue)) {
      setInvitedLastName(inputValue);
      setInvitedLastNameError(false);
    }
  };

  const handleInvitedEmailChange = (e: { target: { value: unknown } }) => {
    const inputValue = e.target.value as string;
    setInvitedEmail(inputValue);
    setInvitedEmailError(false);
  };

  const handleAdminStatusChange = (inputValue: string) => {
    setinvitedAdminStatus(inputValue);

    // If admin is selected, uncheck the 2FA checkbox
    if (inputValue === "1") {
      setIsTwoFactorAuthenticated(false);
    }
    setInvitedAdminStatusError(false);
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
    getRecords(userPageNum);
  };

  const onInviteEmployee = async (
    isEmailError: boolean,
    isFirstNameError: boolean,
    isLastNameError: boolean,
    isAdminStatusError: boolean,
  ) => {
    if (
      !isEmailError &&
      !isFirstNameError &&
      !isLastNameError &&
      !isAdminStatusError
    ) {
      let hasInvitedUser: string | undefined;
      let roleOptionIndex: number | undefined;

      if (invitedAdminStatus === "1") {
        roleOptionIndex = 1;
      } else if (invitedAdminStatus === "2" && isTwoFactorAuthenticated) {
        roleOptionIndex = 0;
      } else if (invitedAdminStatus === "2" && !isTwoFactorAuthenticated) {
        roleOptionIndex = 2;
      }

      if (roleOptionIndex !== undefined) {
        hasInvitedUser = await commonApiClient.inviteUser(
          invitedEmail,
          RoleOptions[roleOptionIndex],
          invitedFirstName,
          invitedLastName,
        );
      }
      if (hasInvitedUser === "Request failed with status code 409") {
        newToast("Employee already exists", INVITE_EMPLOYEE_ERROR, "error");
      } else if (hasInvitedUser === "Success") {
        newToast(
          "Invite sent",
          `Your invite has been sent to ${invitedFirstName} ${invitedLastName}`,
          "success",
        );
        handleClose();
      } else {
        newToast("Error inviting employee", INVITE_EMPLOYEE_ERROR, "error");
      }
    }
  };

  const handleSubmit = () => {
    const isEmailError = !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
      invitedEmail,
    );
    const onlyLetters = /^[A-Za-z]+$/;
    const isFirstNameError = !(
      invitedFirstName && onlyLetters.test(invitedFirstName)
    );
    const isLastNameError = !(
      invitedLastName && onlyLetters.test(invitedLastName)
    );
    const isAdminStatusError = invitedAdminStatus === "";

    setInvitedEmailError(isEmailError);
    setInvitedFirstNameError(isFirstNameError);
    setInvitedLastNameError(isLastNameError);
    setInvitedAdminStatusError(isAdminStatusError);
    onInviteEmployee(
      isEmailError,
      isFirstNameError,
      isLastNameError,
      isAdminStatusError,
    );
    setUserPageNum(1);
    setNumUsers(numUsers + 1)
  };

  return (
    <>
      <Button variant="primary" onClick={handleOpen}>
        <AddIcon boxSize="16px" marginRight="8px" />
        Add Employee
      </Button>
      <Modal isOpen={isOpen} onClose={handleClose} isCentered>
        <ModalOverlay />
        <ModalContent minW="513px" maxW="513px" minH="484px" borderRadius="8px">
          <Box>
            <ModalHeader>Add Employee</ModalHeader>
            <ModalCloseButton mt="5px" margin="inherit" size="lg" />
          </Box>
          <ModalBody>
            <Divider />
            <Box pt="16px" pb="8px">
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
                    onChange={handleInvitedEmailChange}
                    maxLength={254}
                  />
                  <FormErrorMessage>
                    A valid email is required.
                  </FormErrorMessage>
                </FormControl>
              </Box>
            </Box>
            <Box pt="16px" pb="16px">
              <FormControl isRequired isInvalid={invitedAdminStatusError}>
                <RadioGroup
                  value={invitedAdminStatus}
                  onChange={handleAdminStatusChange}
                  pb="24px"
                >
                  <Flex>
                    <Box marginRight="24px">
                      <Radio size="lg" colorScheme="teal" value="1">
                        <Text fontWeight="medium" color="#1B2A2C">
                          Admin
                        </Text>
                      </Radio>
                    </Box>
                    <Box>
                      <Radio size="lg" colorScheme="teal" value="2">
                        <Text fontWeight="medium" color="#1B2A2C">
                          Non Admin
                        </Text>
                      </Radio>
                    </Box>
                  </Flex>
                  <FormErrorMessage>A selection is required.</FormErrorMessage>
                </RadioGroup>
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
                <Text fontWeight="medium" color="#1B2A2C">
                  Require Two Factor Authentication
                </Text>
              </Checkbox>
              <Text fontSize="12px" color="#1B2A2C">
                Requiring Two Factor Authentication means the employee will only
                be able to access the platform while physically in the main
                building.
              </Text>
            </Box>
            <Divider />
          </ModalBody>
          <ModalFooter>
            <Button variant="primary" type="submit" onClick={handleSubmit}>
              Invite
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateEmployee;
