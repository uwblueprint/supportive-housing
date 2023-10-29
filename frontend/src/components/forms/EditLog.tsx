/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from "react";
import Select, { MultiValue, SingleValue } from "react-select";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  ModalHeader,
  Text,
  ScaleFade,
  Textarea,
} from "@chakra-ui/react";
import type { AlertStatus } from "@chakra-ui/react";
import { SingleDatepicker } from "chakra-dayzed-datepicker";
import { Col, Row } from "react-bootstrap";
import { AuthenticatedUser } from "../../types/AuthTypes";
import { getLocalStorageObj } from "../../utils/LocalStorageUtils";
import AUTHENTICATED_USER_KEY from "../../constants/AuthConstants";
import LogRecordAPIClient from "../../APIClients/LogRecordAPIClient";
import selectStyle from "../../theme/forms/selectStyles";
import { singleDatePickerStyle } from "../../theme/forms/datePickerStyles";
import { UserLabel } from "../../types/UserTypes";
import { ResidentLabel } from "../../types/ResidentTypes";
import { LogRecord } from "../../types/LogRecordTypes";
import { combineDateTime } from "../../helper/dateHelpers";

type Props = {
  logRecord: LogRecord;
  isOpen: boolean;
  toggleClose: () => void;
  employeeOptions: UserLabel[];
  residentOptions: UserLabel[];
  getRecords: (pageNumber: number) => Promise<void>;
  countRecords: () => Promise<void>;
  setUserPageNum: React.Dispatch<React.SetStateAction<number>>;
};

type AlertData = {
  status: AlertStatus;
  description: string;
};

type AlertDataOptions = {
  [key: string]: AlertData;
};

// Ideally we should be storing this information in the database
const BUILDINGS = [
  { label: "144 Erb St. West", value: "144" },
  { label: "362 Erb St. West", value: "362" },
  { label: "402 Erb St. West", value: "402" },
];

const ALERT_DATA: AlertDataOptions = {
  DEFAULT: {
    status: "info",
    description: "",
  },
  SUCCESS: {
    status: "success",
    description: "Log successfully edited.",
  },
  ERROR: {
    status: "error",
    description: "Error editing log.",
  },
};

// Replace this with the tags from the db once the API and table are made
const TAGS = [
  { label: "Tag A", value: "A" },
  { label: "Tag B", value: "B" },
  { label: "Tag C", value: "C" },
];

// Helper to get the currently logged in user
const getCurUserSelectOption = () => {
  const curUser: AuthenticatedUser | null = getLocalStorageObj(
    AUTHENTICATED_USER_KEY,
  );
  if (curUser && curUser.firstName && curUser.id) {
    const userId = curUser.id;
    return { label: curUser.firstName, value: userId };
  }
  return { label: "", value: -1 };
};

const EditLog = ({
  logRecord,
  isOpen,
  toggleClose,
  employeeOptions,
  residentOptions,
  getRecords,
  countRecords,
  setUserPageNum,
}: Props) => {
  // currently, the select for employees is locked and should default to current user. Need to check if admins/regular staff are allowed to change this
  const [employee, setEmployee] = useState<UserLabel>(getCurUserSelectOption());
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(
    date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
  );
  const [building, setBuilding] = useState("");
  const [residents, setResidents] = useState<number[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [attnTo, setAttnTo] = useState<number>(-1);
  const [notes, setNotes] = useState("");
  const [flagged, setFlagged] = useState(false);

  // error states for non-nullable inputs
  const [employeeError, setEmployeeError] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [timeError, setTimeError] = useState(false);
  const [buildingError, setBuildingError] = useState(false);
  const [residentError, setResidentError] = useState(false);
  const [notesError, setNotesError] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [alertData, setAlertData] = useState<AlertData>(ALERT_DATA.DEFAULT);

  const handleDateChange = (newDate: Date) => {
    setDate(newDate);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value);
    const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/; // Regex to match time format HH:mm

    // Check to see if the input is valid, prevents an application crash
    if (timeRegex.test(e.target.value)) {
      const [hour, minute] = e.target.value.split(":");
      const updatedDate = new Date(date); // update the time values of the current date state
      updatedDate.setHours(parseInt(hour, 10));
      updatedDate.setMinutes(parseInt(minute, 10));
      setDate(updatedDate);
    }

    setTimeError(e.target.value === "");
  };

  const handleBuildingChange = (
    selectedOption: SingleValue<{ label: string; value: string }>,
  ) => {
    if (selectedOption !== null) {
      setBuilding(selectedOption.value);
    }

    setBuildingError(selectedOption === null);
  };

  const handleResidentsChange = (
    selectedResidents: MultiValue<ResidentLabel>,
  ) => {
    const mutableSelectedResidents: ResidentLabel[] = Array.from(
      selectedResidents,
    );
    if (mutableSelectedResidents !== null) {
      setResidents(mutableSelectedResidents.map((residentLabel) => residentLabel.value));
    }
    setResidentError(mutableSelectedResidents.length === 0);
    
  };

  const handleTagsChange = (
    selectedTags: MultiValue<{ label: string; value: string }>,
  ) => {
    const newTagsList = selectedTags.map((tag) => tag.value);
    setTags(newTagsList);
  };

  const handleAttnToChange = (
    selectedOption: SingleValue<{ label: string; value: number }>,
  ) => {
    if (selectedOption !== null) {
      setAttnTo(selectedOption.value);
    } else {
      setAttnTo(-1);
    }
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value as string;
    setNotes(inputValue);
    setNotesError(inputValue === "");
  };

  const initializeValues = () => {
    // set state variables
    setEmployee(getCurUserSelectOption());
    setDate(new Date(logRecord.datetime));
    setTime(
      date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    );
    setBuilding(logRecord.building);
    const residentIds = residentOptions.filter(
      (item) => logRecord.residents.includes(item.label),
    ).map((item) => item.value);
    setResidents(residentIds);
    setTags(logRecord.tags);
    setAttnTo(logRecord.attnTo !== undefined ? logRecord.attnTo.id : -1);
    setNotes(logRecord.note);
    setFlagged(logRecord.flagged);

    // error states for non-nullable inputs
    setEmployeeError(false);
    setDateError(false);
    setTimeError(false);
    setBuildingError(false);
    setResidentError(false);
    setNotesError(false);
  };

  const handleSubmit = async () => {
    // Update error states
    setEmployeeError(!employee.label);
    setDateError(date === null);
    setTimeError(time === "");
    setBuildingError(building === "");
    setResidentError(residents.length === 0);
    setNotesError(notes === "");

    // If any required fields are empty, prevent form submission
    if (
      !employee.label ||
      date === null ||
      time === "" ||
      building === "" ||
      residents.length === 0 ||
      notes === ""
    ) {
      return;
    }

    const res = await LogRecordAPIClient.editLogRecord({
      logId: logRecord.logId,
      employeeId: employee.value,
      residents,
      datetime: combineDateTime(date, time),
      flagged,
      note: notes,
      tags,
      building,
      attnTo: attnTo === -1 ? undefined : attnTo,
    });
    if (res) {
      setAlertData(ALERT_DATA.SUCCESS);
      countRecords();
      getRecords(1);
      setUserPageNum(1);

      toggleClose();
    } else {
      setAlertData(ALERT_DATA.ERROR);
    }
    setShowAlert(true);
  };

  useEffect(() => {
    if (isOpen) {
      initializeValues();
    }
  }, [isOpen]);

  useEffect(() => {
    if (showAlert) {
      setTimeout(() => {
        setShowAlert(false);
        setAlertData(ALERT_DATA.DEFAULT);
      }, 3000);
    }
  }, [showAlert]);

  return (
    <>
      <Box>
        <Modal isOpen={isOpen} onClose={toggleClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit Log Entry Details</ModalHeader>
            <ModalBody>
              <Divider />
              <Row style={{ marginTop: "16px" }}>
                <Col>
                  <FormControl isRequired>
                    <FormLabel>Employee</FormLabel>
                    <Select
                      isDisabled
                      defaultValue={getCurUserSelectOption()}
                      styles={selectStyle}
                    />
                  </FormControl>
                </Col>
                <Col>
                  <Grid templateColumns="repeat(2, 1fr)" gap="8px">
                    <GridItem minWidth="100%">
                      <FormControl isRequired>
                        <FormLabel>Date</FormLabel>
                        <SingleDatepicker
                          name="date-input"
                          date={date}
                          onDateChange={handleDateChange}
                          propsConfigs={singleDatePickerStyle}
                        />
                      </FormControl>
                    </GridItem>
                    <GridItem minWidth="100%">
                      <FormControl isRequired isInvalid={timeError}>
                        <FormLabel>Time</FormLabel>
                        <Input
                          size="md"
                          type="time"
                          defaultValue={time}
                          onChange={handleTimeChange}
                        />
                        <FormErrorMessage>Time is invalid.</FormErrorMessage>
                      </FormControl>
                    </GridItem>
                  </Grid>
                </Col>
              </Row>

              <Row>
                <Col>
                  <FormControl isRequired isInvalid={buildingError} mt={4}>
                    <FormLabel>Building</FormLabel>
                    <Select
                      options={BUILDINGS}
                      placeholder="Building No."
                      onChange={handleBuildingChange}
                      styles={selectStyle}
                      defaultValue={BUILDINGS.find(
                        (item) => item.value === building,
                      )}
                    />
                    <FormErrorMessage>Building is required.</FormErrorMessage>
                  </FormControl>
                </Col>
                <Col>
                  <FormControl isRequired isInvalid={residentError} mt={4}>
                  <FormLabel>Residents</FormLabel>
                    <Select
                      options={residentOptions}
                      isMulti
                      closeMenuOnSelect={false}
                      placeholder="Select Resident"
                      onChange={handleResidentsChange}
                      defaultValue={residentOptions.filter(
                        (item) => logRecord.residents.includes(item.label),
                      )}
                    />
                    <FormErrorMessage>Resident is required.</FormErrorMessage>
                  </FormControl>
                </Col>
              </Row>

              <Row>
                <Col>
                  <FormControl mt={4}>
                    <FormLabel>Tags</FormLabel>
                    <Select
                      // TODO: Integrate actual tags once implemented
                      isDisabled
                      options={TAGS}
                      isMulti
                      closeMenuOnSelect={false}
                      placeholder="Select Tags"
                      onChange={handleTagsChange}
                      styles={selectStyle}
                    />
                  </FormControl>
                </Col>
                <Col>
                  <FormControl mt={4}>
                    <FormLabel>Attention To</FormLabel>
                    <Select
                      isClearable
                      options={employeeOptions}
                      placeholder="Select Employee"
                      onChange={handleAttnToChange}
                      styles={selectStyle}
                      defaultValue={employeeOptions.find(
                        (item) => item.value === logRecord.attnTo?.id,
                      )}
                    />
                  </FormControl>
                </Col>
              </Row>

              <Row>
                <Col>
                  <FormControl isRequired isInvalid={notesError} mt={4}>
                    <FormLabel>Notes</FormLabel>
                    <Textarea
                      value={notes}
                      onChange={handleNotesChange}
                      placeholder="Enter log notes here..."
                      resize="none"
                    />

                    <FormErrorMessage>Notes are required.</FormErrorMessage>
                  </FormControl>
                </Col>
              </Row>

              <Checkbox
                colorScheme="gray"
                style={{ paddingTop: "1rem" }}
                onChange={() => setFlagged(!flagged)}
                marginBottom="16px"
                defaultChecked={flagged}
              >
                <Text>Flag this Report</Text>
              </Checkbox>

              <Divider />

              <Box textAlign="right" marginTop="12px" marginBottom="12px">
                <Button
                  onClick={toggleClose}
                  variant="tertiary"
                  marginRight="8px"
                >
                  Cancel
                </Button>
                <Button onClick={handleSubmit} variant="primary" type="submit">
                  Submit
                </Button>
              </Box>
            </ModalBody>
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
          <Alert
            status={alertData.status}
            variant="left-accent"
            borderRadius="6px"
          >
            <AlertIcon />
            <AlertDescription>{alertData.description}</AlertDescription>
          </Alert>
        </ScaleFade>
      </Box>
    </>
  );
};

export default EditLog;
