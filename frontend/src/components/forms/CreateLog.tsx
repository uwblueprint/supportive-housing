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
import { AddIcon } from "@chakra-ui/icons";
import { SingleDatepicker } from "chakra-dayzed-datepicker";
import { Col, Row } from "react-bootstrap";
import { AuthenticatedUser } from "../../types/AuthTypes";
import UserAPIClient from "../../APIClients/UserAPIClient";
import ResidentAPIClient from "../../APIClients/ResidentAPIClient";
import TagAPIClient from "../../APIClients/TagAPIClient";
import { getLocalStorageObj } from "../../utils/LocalStorageUtils";
import AUTHENTICATED_USER_KEY from "../../constants/AuthConstants";
import LogRecordAPIClient from "../../APIClients/LogRecordAPIClient";
import BuildingAPIClient from "../../APIClients/BuildingAPIClient";
import selectStyle from "../../theme/forms/selectStyles";
import { singleDatePickerStyle } from "../../theme/forms/datePickerStyles";
import { Resident } from "../../types/ResidentTypes";
import combineDateTime from "../../helper/combineDateTime";
import { SelectLabel } from "../../types/SharedTypes";

type Props = {
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

const ALERT_DATA: AlertDataOptions = {
  DEFAULT: {
    status: "info",
    description: "",
  },
  SUCCESS: {
    status: "success",
    description: "Log successfully created.",
  },
  ERROR: {
    status: "error",
    description: "Error creating log.",
  },
};

// Replace this with the tags from the db once the API and table are made
const TAGS = [
  { label: "Tag A", value: "A" },
  { label: "Tag B", value: "B" },
  { label: "Tag C", value: "C" },
];

// Changes the border of the Select components if the input is invalid
function getBorderStyle(state: any, error: boolean): string {
  if (state.isFocused) {
    return "2px solid #3182ce";
  }
  if (error) {
    return "2px solid #e53e3e";
  }

  return "1px solid #cbd5e0";
}

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

const CreateLog = ({ getRecords, countRecords, setUserPageNum }: Props) => {
  // currently, the select for employees is locked and should default to current user. Need to check if admins/regular staff are allowed to change this
  const [employee, setEmployee] = useState<SelectLabel>(getCurUserSelectOption());
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(
    date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
  );
  const [buildingId, setBuildingId] = useState<number>(-1);
  const [residents, setResidents] = useState<number[]>([]);
  const [tags, setTags] = useState<number[]>([]);
  const [attnTo, setAttnTo] = useState(-1);
  const [notes, setNotes] = useState("");
  const [flagged, setFlagged] = useState(false);

  const [employeeOptions, setEmployeeOptions] = useState<SelectLabel[]>([]);
  const [residentOptions, setResidentOptions] = useState<SelectLabel[]>([]);
  const [buildingOptions, setBuildingOptions] = useState<SelectLabel[]>([]);
  const [tagOptions, setTagOptions] = useState<SelectLabel[]>([]);

  const [isCreateOpen, setCreateOpen] = React.useState(false);

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

  // fetch resident + employee + tag data for log creation
  const getLogEntryOptions = async () => {
    const buildingsData = await BuildingAPIClient.getBuildings();

    if (buildingsData && buildingsData.buildings.length !== 0) {
      const buildingLabels: SelectLabel[] = buildingsData.buildings.map(
        (building) => ({ label: building.name!, value: building.id! }),
      );
      setBuildingOptions(buildingLabels);
    }

    const residentsData = await ResidentAPIClient.getResidents({
      returnAll: true,
    });

    if (residentsData && residentsData.residents.length !== 0) {
      // TODO: Remove the type assertions here
      const residentLabels: SelectLabel[] = residentsData.residents.map(
        (r) => ({ label: r.residentId!, value: r.id! }),
      );
      setResidentOptions(residentLabels);
    }

    const usersData = await UserAPIClient.getUsers({ returnAll: true });
    if (usersData && usersData.users.length !== 0) {
      const userLabels: SelectLabel[] = usersData.users
        .filter((user) => user.userStatus === "Active")
        .map((user) => ({
          label: user.firstName,
          value: user.id,
        }));
      setEmployeeOptions(userLabels);
    }

    const tagsData = await TagAPIClient.getTags();
    if (tagsData && tagsData.tags.length !== 0) {
      const tagLabels: SelectLabel[] = tagsData.tags
        .map((tag) => ({
          label: tag.name,
          value: tag.tagId,
        }));
      setTagOptions(tagLabels);
    }
  };

  const handleCreateOpen = () => {
    getLogEntryOptions();
    setCreateOpen(true);

    // reset all states
    setDate(new Date());
    setTime(
      new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    );
    setBuildingId(-1);
    setResidents([]);
    setTags([]);
    setAttnTo(-1);
    setNotes("");

    // reset all error states
    setEmployeeError(false);
    setDateError(false);
    setTimeError(false);
    setBuildingError(false);
    setResidentError(false);
    setNotesError(false);

    // reset alert state
    setShowAlert(false);
  };

  const handleCreateClose = () => {
    setCreateOpen(false);
  };

  const handleSubmit = async () => {
    // Update error states
    setEmployeeError(!employee.label);
    setDateError(date === null);
    setTimeError(time === "");
    setBuildingError(buildingId === -1);
    setResidentError(residents.length === 0);
    setNotesError(notes === "");

    // If any required fields are empty, prevent form submission
    if (
      !employee.label ||
      date === null ||
      time === "" ||
      buildingId === -1 ||
      residents.length === 0 ||
      notes === ""
    ) {
      return;
    }

    // Create a log in the db with this data
    setCreateOpen(false);
    // update the table with the new log
    // NOTE: -1 is the default state for attnTo
    const attentionTo = attnTo === -1 ? undefined : attnTo;
    const res = await LogRecordAPIClient.createLog({
      employeeId: employee.value,
      residents,
      datetime: combineDateTime(date, time),
      flagged,
      note: notes,
      tags,
      buildingId,
      attnTo: attentionTo,
    });
    if (res != null) {
      setAlertData(ALERT_DATA.SUCCESS);
      countRecords();
      getRecords(1);
      setUserPageNum(1);
    } else {
      setAlertData(ALERT_DATA.ERROR);
    }
    setShowAlert(true);
  };

  useEffect(() => {
    if (showAlert) {
      setTimeout(() => {
        setShowAlert(false);
        setAlertData(ALERT_DATA.DEFAULT);
      }, 3000);
    }
  }, [showAlert]);

  return (
    <div>
      <Box textAlign="right">
        <Button
          onClick={handleCreateOpen}
          marginBottom="16px"
          variant="primary"
        >
          <AddIcon boxSize="16px" marginRight="8px" />
          Add Log
        </Button>
      </Box>

      <Box>
        <Modal isOpen={isCreateOpen} onClose={handleCreateClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>New Log Entry Details</ModalHeader>
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
                      options={buildingOptions}
                      placeholder="Building No."
                      onChange={handleBuildingChange}
                      styles={selectStyle}
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
              >
                <Text>Flag this Report</Text>
              </Checkbox>

              <Divider />

              <Box textAlign="right" marginTop="12px" marginBottom="12px">
                <Button
                  onClick={handleCreateClose}
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
    </div>
  );
};

export default CreateLog;
