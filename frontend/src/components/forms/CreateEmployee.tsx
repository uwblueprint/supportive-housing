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
  Spinner,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import CreateToast from "../common/Toasts";
import UserAPIClient from "../../APIClients/UserAPIClient";
import { isErrorResponse } from "../../helper/error";

type Props = {
  getRecords: (pageNumber: number) => Promise<void>;
  setUserPageNum: React.Dispatch<React.SetStateAction<number>>;
  countUsers: () => Promise<void>;
};
const RoleOptions = ["Relief Staff", "Admin", "Regular Staff"];

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const CreateEmployee = ({
  getRecords,
  setUserPageNum,
  countUsers,
}: Props): React.ReactElement => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const [invitedEmail, setInvitedEmail] = useState<string>("");
  const [invitedFirstName, setInvitedFirstName] = useState<string>("");
  const [invitedLastName, setInvitedLastName] = useState<string>("");
  const [invitedAdminStatus, setInvitedAdminStatus] = useState<string>("");
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

  const [loading, setLoading] = useState(false);
  const newToast = CreateToast();

  useEffect(() => {
    if (invitedAdminStatus === "1") {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [invitedAdminStatus]);

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value as string;
    setInvitedFirstName(inputValue);
    setInvitedFirstNameError(false);
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value as string;
    setInvitedLastName(inputValue);
    setInvitedLastNameError(false);
  };

  const handleInvitedEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value as string;
    setInvitedEmail(inputValue);
    setInvitedEmailError(false);
  };

  const handleAdminStatusChange = (inputValue: string) => {
    setInvitedAdminStatus(inputValue);

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
    setInvitedAdminStatus("");
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
    let roleOptionIndex: number | undefined;

    if (invitedAdminStatus === "1") {
      roleOptionIndex = 1;
    } else if (invitedAdminStatus === "2" && isTwoFactorAuthenticated) {
      roleOptionIndex = 0;
    } else if (invitedAdminStatus === "2" && !isTwoFactorAuthenticated) {
      roleOptionIndex = 2;
    }

    if (roleOptionIndex !== undefined) {
      setLoading(true);
      const res = await UserAPIClient.inviteUser(
        invitedEmail,
        RoleOptions[roleOptionIndex],
        invitedFirstName,
        invitedLastName,
      );

      if (isErrorResponse(res)) {
        newToast("Error inviting user", res.errMessage, "error");
      } else if (res) {
        newToast(
          "Invite sent",
          `An invite has been sent to ${invitedEmail}.`,
          "success",
        );
        getRecords(1);
        setUserPageNum(1);
        countUsers();
        handleClose();
      }
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (invitedFirstName === "") {
      setInvitedFirstNameError(true);
      return;
    }
    if (invitedLastName === "") {
      setInvitedLastNameError(true);
      return;
    }
    if (!emailRegex.test(invitedEmail)) {
      setInvitedEmailError(true);
      return;
    }
    if (invitedAdminStatus === "") {
      setInvitedAdminStatusError(true);
      return;
    }

    onInviteEmployee();
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
                    <FormErrorMessage>First name is required.</FormErrorMessage>
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
                    <FormErrorMessage>Last name is required.</FormErrorMessage>
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
            <Box pt="16px">
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
                Enabling two factor authentication means the employee will only
                be able to access the platform while physically in the main
                building.
              </Text>
            </Box>
          </ModalBody>
          <ModalFooter>
            {loading && (
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                size="md"
                marginRight="10px"
              />
            )}
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
