import React, { useEffect, useState } from "react";
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
import { Col, Row } from "react-bootstrap";
import ResidentAPIClient from "../../APIClients/ResidentAPIClient";
import { Resident } from "../../types/ResidentTypes";
import { selectStyle } from "../../theme/forms/selectStyles";
import { singleDatePickerStyle } from "../../theme/forms/datePickerStyles";
import CreateToast from "../common/Toasts";
import { convertToDate, convertToString } from "../../helper/dateHelpers";
import { isErrorResponse } from "../../helper/error";
import { SelectLabel } from "../../types/SharedTypes";
import { SingleDatepicker } from "../common/Datepicker";

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
  const [roomNumber, setRoomNumber] = useState("");
  const [moveInDate, setMoveInDate] = useState<Date | undefined>(new Date());
  const [buildingId, setBuildingId] = useState<number>(resident.building.id);
  const [moveOutDate, setMoveOutDate] = useState<Date | undefined>();
  const [isMoveOutDateEmpty, setIsMoveOutDateEmpty] = useState<boolean>(true)

  const [initialsError, setInitialsError] = useState(false);
  const [roomNumberError, setRoomNumberError] = useState(false);
  const [buildingError, setBuildingError] = useState(false);
  const [moveInDateError, setMoveInDateError] = useState(false);
  const [moveOutDateError, setMoveOutDateError] = useState(false);
  const [moveOutDateErrorMessage, setMoveOutDateErrorMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const newToast = CreateToast();

  const editResident = async () => {
    setLoading(true);
    const res = await ResidentAPIClient.editResident({
      id: resident.id,
      initial: initials.toUpperCase(),
      roomNum: roomNumber,
      dateJoined: convertToString(moveInDate as Date),
      dateLeft: moveOutDate ? convertToString(moveOutDate) : undefined,
      buildingId,
    });

    if (isErrorResponse(res)) {
      newToast("Error updating resident", res.errMessage, "error");
    } else if (res) {
      newToast("Resident updated", "Successfully updated resident.", "success");
      getRecords(userPageNum);
      toggleClose();
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
    if (moveOutDate && inputValue && (inputValue < moveOutDate)) {
      setMoveOutDateError(false);
    }
    return true;
  };

  const handleMoveOutDateChange = (inputValue: Date | undefined, isEmpty: boolean) => {
    setMoveOutDate(inputValue);
    setIsMoveOutDateEmpty(isEmpty)
    if (isEmpty) {
      setMoveOutDateError(false)
    }
    if (moveInDate && inputValue && (inputValue > moveInDate)) {
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

  const handleToggleClose = () => {
    toggleClose();

    setInitials(resident.initial);
    setRoomNumber(resident.roomNum);
    setMoveInDate(convertToDate(resident.dateJoined));
    setBuildingId(resident.building.id);
    setMoveOutDate(
      resident.dateLeft ? convertToDate(resident.dateLeft) : undefined,
    );
    setIsMoveOutDateEmpty(!!resident.dateLeft)

    setInitialsError(false);
    setRoomNumberError(false);
    setMoveInDateError(false);
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
    if (!moveInDate) {
      setMoveInDateError(true)
      return;
    }
    if (!moveOutDate && !isMoveOutDateEmpty) {
      setMoveOutDateError(true)
      setMoveOutDateErrorMessage("Move out date is invalid.")
      return;
    }
    if (moveOutDate && moveOutDate <= moveInDate) {
      setMoveOutDateError(true);
      setMoveOutDateErrorMessage("Move out date must be after the move in date.")
      return;
    }
    if (buildingId === -1) {
      setBuildingError(true);
      return;
    }

    await editResident();
    setInitialsError(false);
    setRoomNumberError(false);
    setMoveInDateError(false)
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
    )
    setIsMoveOutDateEmpty(!!resident.dateLeft)
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
                    <FormLabel>Initials</FormLabel>
                    <Input value={initials} onChange={handleInitialsChange} />
                    <FormErrorMessage>
                      Initials are required and must contain 2 letters.
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
                      propsConfigs={singleDatePickerStyle}
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
                        propsConfigs={singleDatePickerStyle}
                      />
                    <FormErrorMessage marginBottom="8px">
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
