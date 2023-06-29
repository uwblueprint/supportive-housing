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
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ScaleFade,
  Textarea,
} from "@chakra-ui/react";
import type { AlertStatus } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { SingleDatepicker } from "chakra-dayzed-datepicker";
import { Card, Col, Row } from "react-bootstrap";
import { AuthenticatedUser } from "../../types/AuthTypes";
import UserAPIClient from "../../APIClients/UserAPIClient";
import ResidentAPIClient from "../../APIClients/ResidentAPIClient";
import type { Resident, JSONResident } from "../../types/ResidentTypes";
import { getLocalStorageObj } from "../../utils/LocalStorageUtils";
import AUTHENTICATED_USER_KEY from "../../constants/AuthConstants";
import LogRecordAPIClient from "../../APIClients/LogRecordAPIClient";

type Props = {
  getRecords: (page_number: number) => Promise<void>;
  setUserPageNum: React.Dispatch<React.SetStateAction<number>>;
};

type NewSelectOptionType = {
  label: string;
  value: number;
}

type AlertData = {
  status: AlertStatus;
  description: string;
}

type AlertDataOptions = {
  [key: string]: AlertData;
}

// Ideally we should be storing this information in the database
const BUILDINGS = [
  { label: "144", value: "144 Erb St. West" },
  { label: "362", value: "362 Erb St. West" },
  { label: "402", value: "402 Erb St. West" },
];

const ALERT_DATA: AlertDataOptions = {
  DEFAULT: {
    status: 'info',
    description: ''
  },
  SUCCESS: {
    status: 'success',
    description: 'Log successfully created.'
  },
  ERROR: {
    status: 'error',
    description: 'Error creating log.'
  }
}

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

const CreateLog = ({
  getRecords,
  setUserPageNum
}: Props) => {
  // currently, the select for employees is locked and should default to current user. Need to check if admins/regular staff are allowed to change this
  const [employee, setEmployee] = useState<NewSelectOptionType>({label: "", value: -1}); // currently, the select for employees is locked and should default to current user. Need to check if admins/regular staff are allowed to change this
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(
    date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
  );
  const [building, setBuilding] = useState("");
  const [resident, setResident] = useState(-1);
  const [tags, setTags] = useState<string[]>([]);
  const [attnTo, setAttnTo] = useState(-1);
  const [notes, setNotes] = useState("");
  const [flagged, setFlagged] = useState(false);

  const [employeeOptions, setEmployeeOptions] = useState<NewSelectOptionType[]>([]);
  const [residentOptions, setResidentOptions] = useState<NewSelectOptionType[]>([]);
  
  const [isCreateOpen, setCreateOpen] = React.useState(false);

  // error states for non-nullable inputs
  const [employeeError, setEmployeeError] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [timeError, setTimeError] = useState(false);
  const [buildingError, setBuildingError] = useState(false);
  const [residentError, setResidentError] = useState(false);
  const [notesError, setNotesError] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [alertData, setAlertData] = useState<AlertData>(ALERT_DATA.DEFAULT)

  // if we need functionality to change the selected employee, handle should go here

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

  const handleResidentChange = (
    selectedOption: SingleValue<{ label: string; value: number }>,
  ) => {
    if (selectedOption !== null) {
      setResident(selectedOption.value);
    }

    setResidentError(selectedOption === null);
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
    }
  };

  const handleNotesChange = (e: { target: { value: unknown } }) => {
    const inputValue: string = e.target.value as string;
    setNotes(inputValue);
    setNotesError(inputValue === "");
  };

  // fetch resident + employee data for log creation
  const getLogEntryOptions = async () => {
    const residentsData = await ResidentAPIClient.getResidents()

    if (residentsData) {
      const residentLabels: NewSelectOptionType[] = JSON.parse(residentsData).map((r: any) => 
      ({label: r.resident_id, value: r.id}));
      setResidentOptions(residentLabels)
    }

    const usersData = await UserAPIClient.getUsers()
    if (usersData) {
      const userLabels: NewSelectOptionType[] = usersData.filter((user:any) => user.userStatus === 'Active').map((user: any) => 
      ({label: user.firstName, value: user.id}));

      setEmployeeOptions(userLabels);
    }
  }

  const handleCreateOpen = () => {
    getLogEntryOptions()
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
    setBuilding("");
    setResident(-1);
    setTags([]);
    setAttnTo(-1);
    setNotes("");

    // set current user
    const curUser: AuthenticatedUser | null = getLocalStorageObj(
      AUTHENTICATED_USER_KEY,
    );
    if (curUser && curUser.firstName && curUser.id) {
      setEmployee({label: curUser.firstName, value: parseInt(curUser.id, 10)})
    }

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

  const handleSubmit = () => {
    // Update error states
    setEmployeeError(employee.label === "" && employee.value === -1);
    setDateError(date === null);
    setTimeError(time === "");
    setBuildingError(building === "");
    setResidentError(resident === -1);
    setNotesError(notes === "");

    // If any required fields are empty, prevent form submission
    if (
      (employee.label === "" && employee.value === -1) ||
      date === null ||
      time === "" ||
      building === "" ||
      resident === -1 ||
      notes === ""
    ) {
      return;
    }

    // Create a log in the db with this data
    setCreateOpen(false);
    // update the table with the new log
    LogRecordAPIClient.createLog(employee.value, resident, flagged, notes, attnTo, building).then((res) => {
      if (res != null) {
        setAlertData(ALERT_DATA.SUCCESS)
        getRecords(1);
        setUserPageNum(1)
      }
      else {
        setAlertData(ALERT_DATA.ERROR)
      }
      setShowAlert(true);
    })
  };

  useEffect(() => {
    if (showAlert) {
      setTimeout(() => {
        setShowAlert(false);
        setAlertData(ALERT_DATA.DEFAULT)
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
              <Row>
                <Col>
                  <FormControl isRequired>
                    <FormLabel>Employee</FormLabel>
                    <Select
                      options={employeeOptions.length > 0 ? employeeOptions : []}
                      isDisabled
                      defaultValue={{ label: employee.label, value: employee.value }} // needs to be the current user
                      styles={{
                        control: (provided, state) => ({
                          ...provided,
                          border: getBorderStyle(state, employeeError),

                          borderRadius: "4px",
                        }),
                      }}
                    />
                  </FormControl>
                </Col>
                <Col>
                  <Grid templateColumns="repeat(2, 1fr)" gap="8px">
                    <GridItem>
                      <FormControl isRequired>
                        <FormLabel>Date</FormLabel>
                        <SingleDatepicker
                          name="date-input"
                          date={date}
                          onDateChange={handleDateChange}
                          propsConfigs={{
                            popoverCompProps: {
                              popoverContentProps: {
                                background: "white",
                              },
                            },
                          }}
                        />
                      </FormControl>
                    </GridItem>
                    <GridItem>
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
                      styles={{
                        control: (provided, state) => ({
                          ...provided,
                          border: getBorderStyle(state, buildingError),
                          "&:hover": {
                            borderColor: buildingError ? "#e53e3e" : "#B1B1B1",
                            cursor: "pointer",
                          },
                          borderRadius: "4px",
                        }),
                      }}
                    />
                    <FormErrorMessage>Building is required.</FormErrorMessage>
                  </FormControl>
                </Col>
                <Col>
                  <FormControl isRequired isInvalid={residentError} mt={4}>
                    <FormLabel>Resident</FormLabel>
                    <Select
                      options={residentOptions.length ? residentOptions : []}
                      placeholder="Select Resident"
                      onChange={handleResidentChange}
                      styles={{
                        control: (provided, state) => ({
                          ...provided,
                          border: getBorderStyle(state, residentError),
                          "&:hover": {
                            borderColor: residentError ? "#e53e3e" : "#B1B1B1",
                            cursor: "pointer",
                          },
                          borderRadius: "4px",
                        }),
                      }}
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
                    />
                  </FormControl>
                </Col>
                <Col>
                  <FormControl mt={4}>
                    <FormLabel>Attention To</FormLabel>
                    <Select
                      options={employeeOptions.length > 0 ? employeeOptions : []}
                      placeholder="Select Employee"
                      onChange={handleAttnToChange}
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
                      size="lg"
                      style={{ resize: "none" }}
                    />
                    <FormErrorMessage>Notes are required.</FormErrorMessage>
                  </FormControl>
                </Col>
              </Row>

              <Checkbox
                style={{ paddingTop: "1rem" }}
                onChange={() => setFlagged(!flagged)}
              >
                Flag this Report
              </Checkbox>

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
          <Alert status={alertData.status} variant="left-accent" borderRadius="6px">
            <AlertIcon />
            <AlertDescription>{alertData.description}</AlertDescription>
          </Alert>
        </ScaleFade>
      </Box>
    </div>
  );
};

export default CreateLog;
