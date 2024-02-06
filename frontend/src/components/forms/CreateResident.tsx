import React, { useEffect, useState } from "react";
import Select, { SingleValue } from "react-select";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
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
  ScaleFade,
  Divider,
  InputGroup,
  IconButton,
  InputRightElement,
} from "@chakra-ui/react";

import { AddIcon, SmallCloseIcon } from "@chakra-ui/icons";
import { SingleDatepicker } from "chakra-dayzed-datepicker";
import { Col, Row } from "react-bootstrap";
import CreateToast from "../common/Toasts";

import { selectStyle } from "../../theme/forms/selectStyles";
import { singleDatePickerStyle } from "../../theme/forms/datePickerStyles";
import ResidentAPIClient from "../../APIClients/ResidentAPIClient";
import BuildingAPIClient from "../../APIClients/BuildingAPIClient";
import { convertToString } from "../../helper/dateHelpers";
import { isErrorResponse } from "../../helper/error";
import { SelectLabel } from "../../types/SharedTypes";

type Props = {
  getRecords: (pageNumber: number) => Promise<void>;
  setUserPageNum: React.Dispatch<React.SetStateAction<number>>;
  countResidents: () => Promise<void>;
};

const CreateResident = ({
  getRecords,
  setUserPageNum,
  countResidents,
}: Props): React.ReactElement => {
  const [buildingOptions, setBuildingOptions] = useState<SelectLabel[]>([]);
  const [initials, setInitials] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [moveInDate, setMoveInDate] = useState(new Date());
  const [moveOutDate, setMoveOutDate] = useState<Date | undefined>();
  const [buildingId, setBuildingId] = useState<number>(-1);

  const [initialsError, setInitialsError] = useState(false);
  const [roomNumberError, setRoomNumberError] = useState(false);
  const [moveOutDateError, setMoveOutDateError] = useState(false);
  const [buildingError, setBuildingError] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const newToast = CreateToast();

  const ROOM_ERROR_TEXT = `Room Number is required and must only contain numbers.`;
  const addResident = async () => {
    const res = await ResidentAPIClient.createResident({
      initial: initials.toUpperCase(),
      roomNum: roomNumber,
      dateJoined: convertToString(moveInDate),
      dateLeft: moveOutDate ? convertToString(moveOutDate) : undefined,
      buildingId,
    });

    if (isErrorResponse(res)) {
      newToast("Error creating resident", res.errMessage, "error");
    } else if (res) {
      getRecords(1);
      countResidents();
      setUserPageNum(1);
      setShowAlert(true);
      setIsOpen(false);
    }
  };

  const handleInitialsChange = (e: { target: { value: unknown } }) => {
    const inputValue = e.target.value as string;
    if (/^[a-z]{0,2}$/i.test(inputValue)) {
      setInitials(inputValue.toUpperCase());
      setInitialsError(false);
    }
  };

  const handleRoomNumberChange = (e: { target: { value: unknown } }) => {
    const inputValue = e.target.value as string;
    if (inputValue !== null && /^[0-9]{0,3}$/.test(inputValue)) {
      setRoomNumber(inputValue);
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

  const getBuildingsOptions = async () => {
    const buildingsData = await BuildingAPIClient.getBuildings();

    if (buildingsData && buildingsData.buildings.length !== 0) {
      const buildingLabels: SelectLabel[] = buildingsData.buildings.map(
        (building) => ({ label: building.name, value: building.id }),
      );
      setBuildingOptions(buildingLabels);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);

    getBuildingsOptions();

    // Reset the input states
    setInitials("");
    setRoomNumber("");
    setMoveInDate(new Date());
    setMoveOutDate(undefined)
    setBuildingId(-1);

    // Reset the error states
    setInitialsError(false);
    setRoomNumberError(false);
    setMoveOutDateError(false);
    setBuildingError(false);

    //  Reset alert state
    setShowAlert(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSubmit = () => {

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

    addResident();
  };

  // Timer to remove alert
  useEffect(() => {
    if (showAlert) {
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }
  }, [showAlert]);

  return (
    <>
      <Box textAlign="right">
        <Button onClick={handleOpen} variant="primary">
          <AddIcon boxSize="16px" marginRight="8px" />
          Add Resident
        </Button>
      </Box>

      <Box>
        <Modal isOpen={isOpen} onClose={handleClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add Resident</ModalHeader>
            <ModalCloseButton size="lg" />
            <ModalBody>
              <Divider />
              <Row style={{ marginTop: "16px" }}>
                <Col>
                  <FormControl isRequired isInvalid={initialsError}>
                    <FormLabel>Resident Initials</FormLabel>
                    <Input
                      placeholder="e.g. AA"
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
                      placeholder="e.g. 123"
                      value={roomNumber}
                      onChange={handleRoomNumberChange}
                      type="number"
                    />
                    <FormErrorMessage>{ROOM_ERROR_TEXT}</FormErrorMessage>
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
                      Move in date is required.
                    </FormErrorMessage>
                  </FormControl>
                </Col>
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
                    <FormErrorMessage>
                      Move out date must be after the move in date.
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
                      placeholder="Select building"
                      onChange={handleBuildingChange}
                      styles={selectStyle}
                    />
                    <FormErrorMessage>Building is required.</FormErrorMessage>
                  </FormControl>
                </Col>
              </Row>
            </ModalBody>
            <ModalFooter>
              <Button onClick={handleSubmit} variant="primary" type="submit">
                Submit
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
            <AlertDescription>Resident successfully added.</AlertDescription>
          </Alert>
        </ScaleFade>
      </Box>
    </>
  );
};

export default CreateResident;
