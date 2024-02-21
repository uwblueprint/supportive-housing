import React, { useState } from "react";
import Select, { SingleValue } from "react-select";
import {
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
  Divider,
  Spinner,
} from "@chakra-ui/react";

import { AddIcon } from "@chakra-ui/icons";
import { Col, Row } from "react-bootstrap";
import CreateToast from "../common/Toasts";

import { selectStyle } from "../../theme/forms/selectStyles";
import { singleDatePickerStyle } from "../../theme/forms/datePickerStyles";
import ResidentAPIClient from "../../APIClients/ResidentAPIClient";
import BuildingAPIClient from "../../APIClients/BuildingAPIClient";
import { convertToString } from "../../helper/dateHelpers";
import { isErrorResponse } from "../../helper/error";
import { SelectLabel } from "../../types/SharedTypes";
import { SingleDatepicker } from "../common/Datepicker";

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
  const [moveInDate, setMoveInDate] = useState<Date | undefined>(new Date());
  const [moveOutDate, setMoveOutDate] = useState<Date | undefined>();
  const [isMoveOutDateEmpty, setIsMoveOutDateEmpty] = useState<boolean>(true);
  const [buildingId, setBuildingId] = useState<number>(-1);

  const [initialsError, setInitialsError] = useState(false);
  const [roomNumberError, setRoomNumberError] = useState(false);
  const [moveInDateError, setMoveInDateError] = useState(false);
  const [moveOutDateError, setMoveOutDateError] = useState(false);
  const [moveOutDateErrorMessage, setMoveOutDateErrorMessage] = useState("");
  const [buildingError, setBuildingError] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const newToast = CreateToast();

  const addResident = async () => {
    setLoading(true);
    const res = await ResidentAPIClient.createResident({
      initial: initials.toUpperCase(),
      roomNum: roomNumber,
      dateJoined: convertToString(moveInDate as Date),
      dateLeft: moveOutDate ? convertToString(moveOutDate) : undefined,
      buildingId,
    });

    if (isErrorResponse(res)) {
      newToast("Error adding resident", res.errMessage, "error");
    } else if (res) {
      newToast("Resident added", "Successfully added resident.", "success");
      getRecords(1);
      countResidents();
      setUserPageNum(1);
      setIsOpen(false);
    }
    setLoading(false);
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
      setRoomNumber(inputValue);
      setRoomNumberError(false);
    }
  };

  const handleMoveInDateChange = (inputValue: Date | undefined) => {
    setMoveInDate(inputValue);
    if (inputValue) {
      setMoveInDateError(false);
    }
    if (moveOutDate && inputValue && inputValue < moveOutDate) {
      setMoveOutDateError(false);
    }
    return true;
  };

  const handleMoveOutDateChange = (
    inputValue: Date | undefined,
    isEmpty: boolean,
  ) => {
    setMoveOutDate(inputValue);
    setIsMoveOutDateEmpty(isEmpty);
    if (isEmpty || inputValue) {
      setMoveOutDateError(false);
    }
    if (moveInDate && inputValue && inputValue > moveInDate) {
      setMoveOutDateError(false);
    }
    return true;
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

  const blockInvalidChar = (e: React.KeyboardEvent<HTMLInputElement>) =>
    ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();

  const handleOpen = () => {
    setIsOpen(true);

    getBuildingsOptions();

    // Reset the input states
    setInitials("");
    setRoomNumber("");
    setMoveInDate(new Date());
    setMoveOutDate(undefined);
    setBuildingId(-1);

    // Reset the error states
    setInitialsError(false);
    setRoomNumberError(false);
    setMoveInDateError(false);
    setMoveOutDateError(false);
    setIsMoveOutDateEmpty(true);
    setBuildingError(false);
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
    if (!moveInDate) {
      setMoveInDateError(true);
      return;
    }
    if (!moveOutDate && !isMoveOutDateEmpty) {
      setMoveOutDateError(true);
      setMoveOutDateErrorMessage("Move out date is invalid.");
      return;
    }
    if (moveOutDate && moveOutDate <= moveInDate) {
      setMoveOutDateError(true);
      setMoveOutDateErrorMessage(
        "Move out date must be after the move in date.",
      );
      return;
    }
    if (buildingId === -1) {
      setBuildingError(true);
      return;
    }

    addResident();
  };

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
                    <FormLabel>Initials</FormLabel>
                    <Input
                      placeholder="e.g. AA"
                      value={initials}
                      onChange={handleInitialsChange}
                    />
                    <FormErrorMessage>
                      Initials are required and must contain 2 letters.
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
                      onKeyDown={blockInvalidChar}
                    />
                    <FormErrorMessage>
                      Room number is required and must contain 3 numbers.
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
                      propsConfigs={{
                        ...singleDatePickerStyle,
                        inputProps: {
                          ...singleDatePickerStyle.inputProps,
                          placeholder: "YYYY-MM-DD",
                        },
                      }}
                    />
                    <FormErrorMessage>
                      Move in date is invalid.
                    </FormErrorMessage>
                  </FormControl>
                </Col>
                <Col>
                  <FormControl isInvalid={moveOutDateError}>
                    <FormLabel>Move Out Date</FormLabel>
                    <SingleDatepicker
                      name="date-input"
                      date={moveOutDate}
                      onDateChange={handleMoveOutDateChange}
                      propsConfigs={{
                        ...singleDatePickerStyle,
                        inputProps: {
                          ...singleDatePickerStyle.inputProps,
                          placeholder: "YYYY-MM-DD",
                        },
                      }}
                    />
                    <FormErrorMessage>
                      {moveOutDateErrorMessage}
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
              {loading && (
                <Spinner
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  size="md"
                  marginRight="10px"
                />
              )}
              <Button onClick={handleSubmit} variant="primary" type="submit">
                Submit
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </>
  );
};

export default CreateResident;
