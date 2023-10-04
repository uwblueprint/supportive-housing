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
import { UPDATE_EMPLOYEE_ERROR } from "../../constants/ErrorMessages";
import CreateToast from "../common/Toasts";
import { User, UserRole } from "../../types/UserTypes";
import UserAPIClient from "../../APIClients/UserAPIClient";

const RoleOptions = [
  UserRole.RELIEF_STAFF,
  UserRole.ADMIN,
  UserRole.REGULAR_STAFF,
];

type Props = {
  employee: User;
  isOpen: boolean;
  toggleClose: () => void;
};

const EditEmployee = ({
  employee,
  isOpen,
  toggleClose,
}: Props): React.ReactElement => {
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const newToast = CreateToast();

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [adminStatus, setAdminStatus] = useState<string>("");
  const [
    isTwoFactorAuthenticated,
    setIsTwoFactorAuthenticated,
  ] = useState<boolean>(false);

  const [firstNameError, setFirstNameError] = useState<boolean>(false);
  const [lastNameError, setLastNameError] = useState<boolean>(false);
  const [adminStatusError, setAdminStatusError] = useState<boolean>(false);

  const mapRoleToState = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        setAdminStatus("1");
        setIsTwoFactorAuthenticated(false);
        break;
      case UserRole.REGULAR_STAFF:
        setAdminStatus("2");
        setIsTwoFactorAuthenticated(false);
        break;
      case UserRole.RELIEF_STAFF:
        setAdminStatus("2");
        setIsTwoFactorAuthenticated(true);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (adminStatus === "1") {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [adminStatus]);

  useEffect(() => {
    setFirstName(employee.firstName);
    setLastName(employee.lastName);
    mapRoleToState(employee.role);
  }, [employee]);

  const handleFirstNameChange = (e: { target: { value: unknown } }) => {
    const inputValue = e.target.value as string;
    if (/^[a-z]{0,}$/i.test(inputValue)) {
      setFirstName(inputValue);
      setFirstNameError(false);
    }
  };

  const handleLastNameChange = (e: { target: { value: unknown } }) => {
    const inputValue = e.target.value as string;
    if (/^[a-z]{0,}$/i.test(inputValue)) {
      setLastName(inputValue);
      setLastNameError(false);
    }
  };

  const handleAdminStatusChange = (inputValue: string) => {
    setAdminStatus(inputValue);

    // If admin is selected, uncheck the 2FA checkbox
    if (inputValue === "1") {
      setIsTwoFactorAuthenticated(false);
    }
    setAdminStatusError(false);
  };

  const handleClose = () => {
    toggleClose();

    setFirstName(employee.firstName);
    setLastName(employee.lastName);
    mapRoleToState(employee.role);

    setFirstNameError(false);
    setLastNameError(false);
    setAdminStatusError(false);
  };

  const onInviteEmployee = async (
    isFirstNameError: boolean,
    isLastNameError: boolean,
    isAdminStatusError: boolean,
  ) => {
    if (!isFirstNameError && !isLastNameError && !isAdminStatusError) {
      let roleOptionIndex: number | undefined;

      if (adminStatus === "1") {
        roleOptionIndex = 1;
      } else if (adminStatus === "2" && isTwoFactorAuthenticated) {
        roleOptionIndex = 0;
      } else if (adminStatus === "2" && !isTwoFactorAuthenticated) {
        roleOptionIndex = 2;
      }

      if (roleOptionIndex !== undefined) {
        const statusCode = await UserAPIClient.updateUser({
          id: employee.id,
          firstName,
          lastName,
          role: RoleOptions[roleOptionIndex],
        });
        if (statusCode === 201) {
          newToast(
            "Employee updated",
            "Employee has been successfully updated",
            "success",
          );
          handleClose();
        } else {
          newToast("Error updating employee", UPDATE_EMPLOYEE_ERROR, "error");
        }
      } else {
        newToast("Error updating employee", UPDATE_EMPLOYEE_ERROR, "error");
      }
    }
  };

  const handleSubmit = () => {
    const onlyLetters = /^[A-Za-z]+$/;
    const isFirstNameError = !(firstName && onlyLetters.test(firstName));
    const isLastNameError = !(lastName && onlyLetters.test(lastName));
    const isAdminStatusError = adminStatus === "";

    setFirstNameError(isFirstNameError);
    setLastNameError(isLastNameError);
    setAdminStatusError(isAdminStatusError);
    onInviteEmployee(isFirstNameError, isLastNameError, isAdminStatusError);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose} isCentered>
        <ModalOverlay />
        <ModalContent minW="513px" maxW="513px" minH="410px" borderRadius="8px">
          <Box>
            <ModalHeader>Edit Employee</ModalHeader>
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
                  <FormControl isRequired isInvalid={firstNameError}>
                    <FormLabel>First Name</FormLabel>
                    <Input
                      placeholder="Enter first name"
                      value={firstName}
                      onChange={handleFirstNameChange}
                      maxLength={50}
                    />
                    <FormErrorMessage>First Name is required.</FormErrorMessage>
                  </FormControl>
                </Box>

                <Box w="46%">
                  <FormControl isRequired isInvalid={lastNameError}>
                    <FormLabel>Last Name</FormLabel>
                    <Input
                      placeholder="Enter last name"
                      value={lastName}
                      onChange={handleLastNameChange}
                      maxLength={50}
                    />
                    <FormErrorMessage>Last Name is required.</FormErrorMessage>
                  </FormControl>
                </Box>
              </Box>
            </Box>
            <Box pt="16px" pb="16px">
              <FormControl isRequired isInvalid={adminStatusError}>
                <RadioGroup
                  value={adminStatus}
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
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditEmployee;
