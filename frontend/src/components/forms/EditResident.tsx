import React, { useEffect, useState } from "react";
import Select, { SingleValue } from "react-select";

import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalOverlay,
  ModalFooter,
  Text,
  ScaleFade,
  Divider,
  InputGroup,
  IconButton,
  InputRightElement,
} from "@chakra-ui/react";
import { SmallCloseIcon } from "@chakra-ui/icons";
import { SingleDatepicker } from "chakra-dayzed-datepicker";
import { Col, Row } from "react-bootstrap";
import ResidentAPIClient from "../../APIClients/ResidentAPIClient";
import { Resident } from "../../types/ResidentTypes";
import { selectStyle } from "../../theme/forms/selectStyles";
import { singleDatePickerStyle } from "../../theme/forms/datePickerStyles";
import CreateToast from "../common/Toasts";
import { convertToDate, convertToString } from "../../helper/dateHelpers";
import { isErrorResponse } from "../../helper/error";
import { SelectLabel } from "../../types/SharedTypes";

type Props = {
  buildingOptions: SelectLabel[];
  resident: Resident;
  isOpen: boolean;
  userPageNum: number;
  toggleClose: () => void;
  getRecords: (pageNumber: number) => Promise<void>;
};

const EditResident = ({
  buildingOptions,
  resident,
  isOpen,
  userPageNum,
  toggleClose,
  getRecords,
}: Props): React.ReactElement => {
  const [initials, setInitials] = useState("");
  const [roomNumber, setRoomNumber] = useState(-1);
  const [moveInDate, setMoveInDate] = useState(new Date());
  const [buildingId, setBuildingId] = useState<number>(resident.building.id);
  const [moveOutDate, setMoveOutDate] = useState<Date | undefined>();

  const [initialsError, setInitialsError] = useState(false);
  const [roomNumberError, setRoomNumberError] = useState(false);
  const [buildingError, setBuildingError] = useState(false);
  const [moveOutDateError, setMoveOutDateError] = useState(false);

  const newToast = CreateToast();

  const editResident = async () => {
    const res = await ResidentAPIClient.editResident({
      id: resident.id,
      initial: initials.toUpperCase(),
      roomNum: roomNumber,
      dateJoined: convertToString(moveInDate),
      buildingId,
      dateLeft: moveOutDate ? convertToString(moveOutDate) : undefined,
    });

    if (isErrorResponse(res)) {
      newToast("Error updating resident", res.errMessage, "error");
    } else if (res !== null && res) {
      newToast(
        "Resident updated",
        "Resident has been successfully updated",
        "success",
      );
      getRecords(userPageNum);
      toggleClose();
    } else {
      newToast(
        "Error updating resident",
        "Resident was unable to be updated",
        "error",
      );
    }
  };

  const handleInitialsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value as string;
    if (/^[a-z]{0,2}$/i.test(inputValue)) {
      setInitials(inputValue.toUpperCase());
      setInitialsError(false);
    }
  };

  const handleRoomNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value as string;
    if (inputValue !== null && /^[0-9]{0,3}$/.test(inputValue)) {
      setRoomNumber(parseInt(inputValue, 10));
      setRoomNumberError(false);
    }
  };

  const handleMoveInDateChange = (inputValue: Date) => {
    setMoveInDate(inputValue);
    if (moveOutDate && inputValue < moveOutDate) {
      setMoveOutDateError(false);
    }
  };

  const handleMoveOutDateChange = (inputValue: Date) => {
    setMoveOutDate(inputValue);
    if (inputValue > moveInDate) {
      setMoveOutDateError(false);
    }
  };

  const handleBuildingChange = (
    selectedOption: SingleValue<{ label: string; value: number }>,
  ) => {
    if (selectedOption !== null) {
      setBuildingId(selectedOption.value);
      setBuildingError(false);
    }
  };

  const handleToggleClose = () => {
    toggleClose();

    setInitials(resident.initial);
    setRoomNumber(resident.roomNum);
    setMoveInDate(convertToDate(resident.dateJoined));
    setBuildingId(resident.building.id);
    setMoveOutDate(
      resident.dateLeft ? convertToDate(resident.dateLeft) : undefined,
    );

    setInitialsError(false);
    setRoomNumberError(false);
    setMoveOutDateError(false);
    setBuildingError(false);
  };

  const handleSave = async () => {
    if (initials.length !== 2) {
      setInitialsError(true);
      return;
    }
    if (!roomNumber || roomNumber.toString().length !== 3) {
      setRoomNumberError(true);
      return;
    }
    if (moveOutDate && moveOutDate <= moveInDate) {
      setMoveOutDateError(true);
      return;
    }
    if (buildingId === -1) {
      setBuildingError(true);
      return;
    }

    await editResident();
    setInitialsError(false);
    setRoomNumberError(false);
    setMoveOutDateError(false);
    setBuildingError(false);
  };

  useEffect(() => {
    setInitials(resident.initial);
    setRoomNumber(resident.roomNum);
    setMoveInDate(convertToDate(resident.dateJoined));
    setBuildingId(resident.building.id);
    setMoveOutDate(
      resident.dateLeft ? convertToDate(resident.dateLeft) : undefined,
    );
  }, [resident]);

  return (
    <>
      <Box>
        <Modal isOpen={isOpen} onClose={handleToggleClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit Resident</ModalHeader>
            <ModalCloseButton size="lg" />
            <ModalBody>
              <Divider />
              <Row style={{ marginTop: "16px" }}>
                <Col>
                  <FormControl isRequired isInvalid={initialsError}>
                    <FormLabel>Resident Initials</FormLabel>
                    <Input value={initials} onChange={handleInitialsChange} />
                    <FormErrorMessage>
                      Resident Initials are required and must contain 2 letters.
                    </FormErrorMessage>
                  </FormControl>
                </Col>
                <Col>
                  <FormControl isRequired isInvalid={roomNumberError}>
                    <FormLabel>Room Number</FormLabel>
                    <Input
                      value={roomNumber}
                      onChange={handleRoomNumberChange}
                      type="number"
                    />
                    <FormErrorMessage>
                      Room Number is required and must only contain numbers.
                    </FormErrorMessage>
                  </FormControl>
                </Col>
              </Row>
              <Row style={{ marginTop: "16px" }}>
                <Col>
                  <FormControl isRequired>
                    <FormLabel>Move In Date</FormLabel>
                    <SingleDatepicker
                      name="date-input"
                      date={moveInDate}
                      onDateChange={handleMoveInDateChange}
                      propsConfigs={singleDatePickerStyle}
                    />
                    <FormErrorMessage>
                      Move In Date is required and must be before Move Out Date.
                    </FormErrorMessage>
                  </FormControl>
                </Col>
              </Row>
              <Row style={{ marginTop: "16px" }}>
                <Col>
                  <FormControl isRequired isInvalid={buildingError}>
                    <FormLabel>Building</FormLabel>
                    <Select
                      options={buildingOptions}
                      defaultValue={buildingOptions.find(
                        (item) => item.value === buildingId,
                      )}
                      onChange={handleBuildingChange}
                      styles={selectStyle}
                    />
                    <FormErrorMessage>Building is required.</FormErrorMessage>
                  </FormControl>
                </Col>
              </Row>
              <Row style={{ marginTop: "16px" }}>
                <Col>
                  <FormControl isInvalid={moveOutDateError}>
                    <FormLabel>Move Out Date</FormLabel>
                    <InputGroup>
                      <SingleDatepicker
                        name="date-input"
                        date={moveOutDate}
                        onDateChange={handleMoveOutDateChange}
                        propsConfigs={singleDatePickerStyle}
                      />
                    {moveOutDate && (
                        <InputRightElement>
                          <IconButton
                            onClick={() => setMoveOutDate(undefined)}
                            aria-label="clear"
                            variant="icon"
                            icon={
                              <SmallCloseIcon
                                boxSize="5"
                                color="gray.200"
                                _hover={{ color: "gray.400" }}
                                transition="color 0.1s ease-in-out"
                              />
                            }
                          />
                        </InputRightElement>
                      )}
                    </InputGroup>
                    <FormErrorMessage marginBottom="8px">
                      Move out Date must be after Move in Date
                    </FormErrorMessage>
                  </FormControl>
                </Col>
              </Row>
            </ModalBody>
            <ModalFooter>
              <Button onClick={handleSave} variant="primary" type="submit">
                Save
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </>
  );
};

export default EditResident;
