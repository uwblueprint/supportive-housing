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
import { Resident } from "../../types/ResidentTypes"

import selectStyle from "../../theme/forms/selectStyles";
import { singleDatePickerStyle } from "../../theme/forms/datePickerStyles";

// TODO: Connect to Buidings table
const BUILDINGS = [
  { label: "144", value: "144" },
  { label: "362", value: "362" },
  { label: "402", value: "402" },
];

type AlertData = {
  status: AlertStatus;
  description: string;
};

type AlertDataOptions = {
  [key: string]: AlertData;
};

const ALERT_DATA: AlertDataOptions = {
  DEFAULT: {
    status: "info",
    description: "",
  },
  SUCCESS: {
    status: "success",
    description: "Resident successfully edited.",
  },
  ERROR: {
    status: "error",
    description: "Error editing Resident.",
  },
};

type Props = {
  resident: Resident;
  isOpen: boolean;
  toggleClose: () => void;
};

const EditResident = ({ resident, isOpen, toggleClose }: Props ) => {
  const { id, residentId, initial, roomNum, dateJoined, dateLeft, building } = resident;
  const [initials, setInitials] = useState(initial);
  const [roomNumber, setRoomNumber] = useState<number>(roomNum);
  const [moveInDate, setMoveInDate] = useState<Date>(new Date(Date.parse(dateJoined)));
  const [userBuilding, setUserBuilding] = useState(building);
  const [moveOutDate, setMoveOutDate] = useState(dateLeft? new Date(Date.parse(dateLeft)) : undefined);

  const [initialsError, setInitialsError] = useState(false);
  const [roomNumberError, setRoomNumberError] = useState(false);
  const [moveInDateError, setMoveInDateError] = useState(false);
  const [buildingError, setBuildingError] = useState(false);
  const [moveOutDateError, setMoveOutDateError] = useState(false);
  const [flagged, setFlagged] = useState(false);
  const [alertData, setAlertData] = useState<AlertData>(ALERT_DATA.DEFAULT);

  const [showAlert, setShowAlert] = useState(false);

  const editRes = async () => {
    await ResidentAPIClient.editResident({
      id,
      residentId,
      initial: initials.toUpperCase(),
      roomNum: roomNumber,
      dateJoined: moveInDate.toISOString(),
      building: userBuilding,
      dateLeft: moveOutDate ? moveOutDate.toISOString() : undefined,
    }).then((res) => {
      if (res != null) {
        setAlertData(ALERT_DATA.SUCCESS);
      } else {
        setAlertData(ALERT_DATA.ERROR);
      }
    });
  };

  const handleClear = () => {
    setMoveOutDate(undefined);
  };
  
  const handleInitialsChange = (e: { target: { value: unknown } }) => {
    const inputValue = e.target.value as string;
    if (/^[a-z]{0,2}$/i.test(inputValue)) {
      setInitials(inputValue.toUpperCase());
      setInitialsError(false);
    }
  };

  const handleFlagged = () => {
    setFlagged(!flagged);
    setMoveOutDate(dateLeft? new Date(Date.parse(dateLeft)) : undefined);
  };

  const handleRoomNumberChange = (e: { target: { value: unknown } }) => {
    const inputValue = e.target.value as string;
    if (inputValue !== null && /^[0-9]{0,3}$/.test(inputValue)) {
      setRoomNumber(parseInt(inputValue, 10));
      setRoomNumberError(false);
    }
  };

  const handleMoveInDateChange = (inputValue: Date) => {
    if (inputValue !== null) {
      if (moveOutDate && inputValue > moveOutDate) {
        setMoveInDateError(true);
      }
      else {
        setMoveInDate(inputValue);
        setMoveInDateError(false);
      }
    }
  };
  
  const handleMoveOutDateChange = (inputValue: Date) => {
    if (inputValue !== null) {
      if (inputValue >= moveInDate) {
        setMoveOutDate(inputValue);
        setMoveOutDateError(false);
      }
      else {
        setMoveOutDateError(true);
      }
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
    setFlagged(false);
    setInitials(initial);
    setRoomNumber(roomNum);
    setMoveInDate(new Date(Date.parse(dateJoined)));
    setMoveOutDate(dateLeft? new Date(Date.parse(dateLeft)) : undefined);
    setUserBuilding(building);
    setInitialsError(false);
    setRoomNumberError(false);
    setMoveInDateError(false);
    setMoveOutDateError(false);
    setBuildingError(false);
    toggleClose();
  };

  const handleSave = () => {
    setInitialsError(initials.length !== 2);
    setRoomNumberError(roomNumber.toString().length !== 3);
    setBuildingError(userBuilding === "");

    //  Prevents form submission if any required values are incorrect
    if (
      initials.length !== 2 ||
      moveInDateError || 
      roomNumber.toString().length !== 3 ||
      userBuilding === "" ||
      moveOutDateError
    ) {
      return;
    }
    editRes();
    setShowAlert(true);
    setFlagged(false);
    setInitialsError(false);
    setRoomNumberError(false);
    setMoveInDateError(false);
    setMoveOutDateError(false);
    setBuildingError(false);
    toggleClose();
  };
  
  // Timer to remove alert
  useEffect(() => {
    if (showAlert) {
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }
  }, [showAlert]);

  useEffect(() => {
    setInitials(initial);
    setRoomNumber(roomNum);
    setMoveInDate(new Date(Date.parse(dateJoined)));
    setUserBuilding(building);
    setMoveOutDate(dateLeft? new Date(Date.parse(dateLeft)) : undefined);
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
                    <Input
                      defaultValue={initial}
                      value={initials}
                      onChange={handleInitialsChange}
                    />
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
                  <FormControl isRequired isInvalid={moveInDateError}>
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
              <Row style={{ marginTop: "16px", marginBottom: "16px" }}>
                <Col>
                  <FormControl isRequired isInvalid={buildingError}>
                    <FormLabel>Building</FormLabel>
                    <Select
                      options={BUILDINGS}
                      placeholder={building}
                      onChange={handleBuildingChange}
                      styles={selectStyle}
                    />
                    <FormErrorMessage>Building is required.</FormErrorMessage>
                  </FormControl>
                </Col>
              </Row>
              <Checkbox
                colorScheme="gray"
                style={{ paddingTop: "1rem" }}
                onChange={() => handleFlagged()}
                marginBottom="16px"
              >
                <Text>Edit Move Out Date</Text>
              </Checkbox>
              <FormControl isRequired isInvalid={moveOutDateError} isDisabled={!flagged}>
                    <FormLabel>Move Out date</FormLabel>
                    <SingleDatepicker
                      name="date-input"
                      date={moveOutDate}
                      onDateChange={handleMoveOutDateChange}
                      propsConfigs={singleDatePickerStyle}
                    />
                    <FormErrorMessage marginBottom="8px">
                      Move out Date is required and must be after Move in Date
                    </FormErrorMessage>
                    <Button marginTop="16px" marginBottom="16px" onClick={handleClear} disabled={!flagged} variant="secondary">
                    Clear Move Out Date
                  </Button>
                </FormControl>
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

      <Box
        position="fixed"
        bottom="20px"
        right="20px"
        width="25%"
        zIndex={9999}
      >
        <ScaleFade in={showAlert} unmountOnExit>
          <Alert status="success" variant="left-accent" borderRadius="6px">
            <AlertIcon />
            <AlertDescription>Resident successfully Edited.</AlertDescription>
          </Alert>
        </ScaleFade>
      </Box>
    </>
  );
};

export default EditResident;
