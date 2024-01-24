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
  ModalFooter,
  ModalCloseButton,
} from "@chakra-ui/react";
import type { AlertStatus } from "@chakra-ui/react";
import { SingleDatepicker } from "chakra-dayzed-datepicker";
import { Col, Row } from "react-bootstrap";
import { AuthenticatedUser } from "../../types/AuthTypes";
import { getLocalStorageObj } from "../../utils/LocalStorageUtils";
import AUTHENTICATED_USER_KEY from "../../constants/AuthConstants";
import LogRecordAPIClient from "../../APIClients/LogRecordAPIClient";
import { selectStyle } from "../../theme/forms/selectStyles";
import { singleDatePickerStyle } from "../../theme/forms/datePickerStyles";
import { LogRecord } from "../../types/LogRecordTypes";
import { combineDateTime, getFormattedTime } from "../../helper/dateHelpers";
import { SelectLabel } from "../../types/SharedTypes";

type Props = {
  logRecord: LogRecord;
  userPageNum: number;
  isOpen: boolean;
  toggleClose: () => void;
  employeeOptions: SelectLabel[];
  residentOptions: SelectLabel[];
  tagOptions: SelectLabel[];
  getRecords: (pageNumber: number) => Promise<void>;
  countRecords: () => Promise<void>;
  setUserPageNum: React.Dispatch<React.SetStateAction<number>>;
  buildingOptions: SelectLabel[];
};

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
    description: "Log successfully edited.",
  },
  ERROR: {
    status: "error",
    description: "Error editing log.",
  },
};

const EditLog = ({
  logRecord,
  userPageNum,
  isOpen,
  toggleClose,
  employeeOptions,
  residentOptions,
  tagOptions,
  getRecords,
  countRecords,
  setUserPageNum,
  buildingOptions,
}: Props) => {
  // currently, the select for employees is locked and should default to current user. Need to check if admins/regular staff are allowed to change this

  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState("");
  const [buildingId, setBuildingId] = useState<number>(-1);
  const [residents, setResidents] = useState<number[]>([]);
  const [tags, setTags] = useState<number[]>([]);
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
    selectedOption: SingleValue<{ label: string; value: number }>,
  ) => {
    if (selectedOption !== null) {
      setBuildingId(selectedOption.value);
    }

    setBuildingError(selectedOption === null);
  };

  const handleResidentsChange = (
    selectedResidents: MultiValue<SelectLabel>,
  ) => {
    const mutableSelectedResidents: SelectLabel[] = Array.from(
      selectedResidents,
    );
    if (mutableSelectedResidents !== null) {
      setResidents(mutableSelectedResidents.map((residentLabel) => residentLabel.value));
    }
    setResidentError(mutableSelectedResidents.length === 0);
    
  };

  const handleTagsChange = (
    selectedTags: MultiValue<SelectLabel>,
  ) => {
    const mutableSelectedTags: SelectLabel[] = Array.from(
      selectedTags,
    );
    if (mutableSelectedTags !== null) {
      setTags(mutableSelectedTags.map((tagLabel) => tagLabel.value));
    }
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
    setDate(new Date(logRecord.datetime));
    setTime(getFormattedTime(new Date(logRecord.datetime)));
    setBuildingId(logRecord.building.id);
    const residentIds = residentOptions.filter(
      (item) => logRecord.residents && logRecord.residents.includes(item.label),
    ).map((item) => item.value);
    setResidents(residentIds);
    const tagIds = tagOptions.filter(
      (item) => logRecord.tags.includes(item.label),
    ).map((item) => item.value);
    setTags(tagIds);
    setAttnTo(logRecord.attnTo ? logRecord.attnTo.id : -1);
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
    setDateError(date === null);
    setTimeError(time === "");
    setBuildingError(buildingId === -1);
    setResidentError(residents.length === 0);
    setNotesError(notes === "");

    // If any required fields are empty, prevent form submission
    if (
      date === null ||
      time === "" ||
      buildingId === -1 ||
      residents.length === 0 ||
      notes === ""
    ) {
      return;
    }

    const res = await LogRecordAPIClient.editLogRecord({
      logId: logRecord.logId,
      employeeId: logRecord.employee.id,
      residents,
      datetime: combineDateTime(date, time),
      flagged,
      note: notes,
      tags,
      buildingId,
      attnTo: attnTo === -1 ? undefined : attnTo,
    });
    if (res) {
      setAlertData(ALERT_DATA.SUCCESS);
      countRecords();
      getRecords(userPageNum);

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
        <Modal isOpen={isOpen} scrollBehavior="inside" onClose={toggleClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit Log Record</ModalHeader>
            <ModalCloseButton size="lg" />
            <ModalBody>
              <Divider />
              <Row style={{ marginTop: "16px" }}>
                <Col>
                  <FormControl isRequired>
                    <FormLabel>Employee</FormLabel>
                    <Input
                      isDisabled
                      defaultValue={`${logRecord.employee.firstName} ${logRecord.employee.lastName}`}
                      _hover={{ borderColor: "teal.100" }}
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
                      options={buildingOptions}
                      placeholder="Building No."
                      onChange={handleBuildingChange}
                      styles={selectStyle}
                      defaultValue={buildingOptions.find(
                        (item) => item.value === buildingId,
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
                      placeholder="Select Residents"
                      onChange={handleResidentsChange}
                      defaultValue={residentOptions.filter(
                        (item) => logRecord.residents && logRecord.residents.includes(item.label),
                      )}
                      styles={selectStyle}
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
                      options={tagOptions}
                      isMulti
                      closeMenuOnSelect={false}
                      placeholder="Select Tags"
                      onChange={handleTagsChange}
                      styles={selectStyle}
                      defaultValue={tagOptions.filter(
                        (item) => logRecord.tags.includes(item.label),
                      )}
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

              <Checkbox
                colorScheme="teal"
                style={{ paddingTop: "1rem" }}
                onChange={() => setFlagged(!flagged)}
                defaultChecked={flagged}
              >
                <Text>Flag this Report</Text>
              </Checkbox>

              <Row>
                <Col>
                  <FormControl isRequired isInvalid={notesError} mt={4}>
                    <FormLabel>Notes</FormLabel>
                    <Textarea
                      value={notes}
                      onChange={handleNotesChange}
                      placeholder="Enter log notes here..."
                      resize="vertical"
                    />

                    <FormErrorMessage>Notes are required.</FormErrorMessage>
                  </FormControl>
                </Col>
              </Row>
            </ModalBody>

            <ModalFooter>
                <Button onClick={handleSubmit} variant="primary" type="submit">
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
