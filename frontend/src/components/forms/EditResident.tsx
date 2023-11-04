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
} from "@chakra-ui/react";
import type { AlertStatus } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { SingleDatepicker } from "chakra-dayzed-datepicker";
import { Card, Col, Row } from "react-bootstrap";
import ResidentAPIClient from "../../APIClients/ResidentAPIClient";
import { Resident } from "../../types/ResidentTypes";

import selectStyle from "../../theme/forms/selectStyles";
import { singleDatePickerStyle } from "../../theme/forms/datePickerStyles";
import CreateToast from "../common/Toasts";
import { convertToDate, convertToString } from "../../helper/dateHelpers";

// TODO: Connect to Buidings table
const BUILDINGS = [
  { label: "144", value: "144" },
  { label: "362", value: "362" },
  { label: "402", value: "402" },
];

type Props = {
  resident: Resident;
  isOpen: boolean;
  userPageNum: number;
  toggleClose: () => void;
  getRecords: (pageNumber: number) => Promise<void>;
};

const EditResident = ({
  resident,
  isOpen,
  userPageNum,
  toggleClose,
  getRecords,
}: Props): React.ReactElement => {
  const [initials, setInitials] = useState("");
  const [roomNumber, setRoomNumber] = useState(-1);
  const [moveInDate, setMoveInDate] = useState(new Date());
  const [userBuilding, setUserBuilding] = useState("");
  const [moveOutDate, setMoveOutDate] = useState<Date | undefined>();

  const [initialsError, setInitialsError] = useState(false);
  const [roomNumberError, setRoomNumberError] = useState(false);
  const [buildingError, setBuildingError] = useState(false);
  const [moveOutDateError, setMoveOutDateError] = useState(false);

  const newToast = CreateToast();

  const editResident = async () => {
    const res = await ResidentAPIClient.editResident({
      id: resident.id,
      residentId: resident.residentId,
      initial: initials.toUpperCase(),
      roomNum: roomNumber,
      dateJoined: convertToString(moveInDate),
      building: userBuilding,
      dateLeft: moveOutDate ? convertToString(moveOutDate) : undefined,
    });

    if (res != null) {
      newToast(
        "Resident updated",
        "Resident has been successfully updated",
        "success",
      );
      getRecords(userPageNum)
    } else {
      newToast(
        "Error updating resident",
        "Resident was unable to be updated",
        "error",
      );
    }
  };

  const clearMoveOutDate = () => {
    setMoveOutDate(undefined);
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
    selectedOption: SingleValue<{ label: string; value: string }>,
  ) => {
    if (selectedOption !== null) {
      setUserBuilding(selectedOption.value);
      setBuildingError(false);
    }
  };

  const handleToggleClose = () => {
    toggleClose();

    setInitials(resident.initial);
    setRoomNumber(resident.roomNum);
    setMoveInDate(convertToDate(resident.dateJoined));
    setUserBuilding(resident.building);
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
    if (userBuilding === "") {
      setBuildingError(true);
      return;
    }

    await editResident();
    setInitialsError(false);
    setRoomNumberError(false);
    setMoveOutDateError(false);
    setBuildingError(false);
    toggleClose();
  };

  useEffect(() => {
    setInitials(resident.initial);
    setRoomNumber(resident.roomNum);
    setMoveInDate(convertToDate(resident.dateJoined));
    setUserBuilding(resident.building);
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
                      options={BUILDINGS}
                      placeholder={resident.building}
                      onChange={handleBuildingChange}
                      styles={selectStyle}
                    />
                    <FormErrorMessage>Building is required.</FormErrorMessage>
                  </FormControl>
                </Col>
              </Row>
              <Row style={{ marginTop: "16px", marginBottom: "16px" }}>
                <Col>
                  <FormControl isInvalid={moveOutDateError}>
                    <FormLabel>Move Out Date</FormLabel>
                    <SingleDatepicker
                      name="date-input"
                      date={moveOutDate}
                      onDateChange={handleMoveOutDateChange}
                      propsConfigs={singleDatePickerStyle}
                    />
                    <FormErrorMessage marginBottom="8px">
                      Move out Date must be after Move in Date
                    </FormErrorMessage>
                    <Button
                      marginTop="16px"
                      onClick={clearMoveOutDate}
                      variant="secondary"
                    >
                      Clear Move Out Date
                    </Button>
                  </FormControl>
                </Col>
              </Row>
              <Divider />
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
