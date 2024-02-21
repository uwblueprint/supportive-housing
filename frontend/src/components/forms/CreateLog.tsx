/* eslint-disable prettier/prettier */
import React, { useState } from "react";
import Select, { MultiValue, SingleValue } from "react-select";
import {
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
  Textarea,
  ModalCloseButton,
  ModalFooter,
  Spinner,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { Col, Row } from "react-bootstrap";
import { AuthenticatedUser } from "../../types/AuthTypes";
import UserAPIClient from "../../APIClients/UserAPIClient";
import ResidentAPIClient from "../../APIClients/ResidentAPIClient";
import TagAPIClient from "../../APIClients/TagAPIClient";
import AUTHENTICATED_USER_KEY from "../../constants/AuthConstants";
import LogRecordAPIClient from "../../APIClients/LogRecordAPIClient";
import BuildingAPIClient from "../../APIClients/BuildingAPIClient";
import { selectStyle } from "../../theme/forms/selectStyles";
import { singleDatePickerStyle } from "../../theme/forms/datePickerStyles";
import { SelectLabel } from "../../types/SharedTypes";
import { combineDateTime, getFormattedTime } from "../../helper/dateHelpers";
import CreateToast from "../common/Toasts";
import { getLocalStorageObj } from "../../helper/localStorageHelpers";
import { SingleDatepicker } from "../common/Datepicker";

type Props = {
  getRecords: (pageNumber: number) => Promise<void>;
  countRecords: () => Promise<void>;
  setUserPageNum: React.Dispatch<React.SetStateAction<number>>;
};

// Helper to get the currently logged in user
const getCurUserSelectOption = () => {
  const curUser: AuthenticatedUser | null = getLocalStorageObj(
    AUTHENTICATED_USER_KEY,
  );
  if (curUser) {
    const userId = curUser.id;
    return { label: `${curUser.firstName} ${curUser.lastName}`, value: userId };
  }
  return { label: "", value: -1 };
};

// Regex to match time format HH:mm
const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

const CreateLog = ({ getRecords, countRecords, setUserPageNum }: Props): React.ReactElement => {
  // currently, the select for employees is locked and should default to current user. Need to check if admins/regular staff are allowed to change this
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const [employee, setEmployee] = useState<SelectLabel>(getCurUserSelectOption());
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState(
    new Date().toLocaleTimeString([], {
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

  // error states for inputs
  const [dateError, setDateError] = useState(false);
  const [timeError, setTimeError] = useState(false);
  const [buildingError, setBuildingError] = useState(false);
  const [residentError, setResidentError] = useState(false);
  const [notesError, setNotesError] = useState(false);

  const [loading, setLoading] = useState(false);
  const newToast = CreateToast();

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    if (newDate) {
      setDateError(false);
    }
    return true;
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value);
    if (timeRegex.test(e.target.value)) {
      setTimeError(false);
    }
  };

  const handleBuildingChange = (
    selectedOption: SingleValue<{ label: string; value: number }>,
  ) => {
    if (selectedOption !== null) {
      setBuildingId(selectedOption.value);
      setBuildingError(false)
    }
  };

  const handleResidentsChange = (
    selectedResidents: MultiValue<SelectLabel>,
  ) => {
    const mutableSelectedResidents: SelectLabel[] = Array.from(
      selectedResidents,
    );
    if (mutableSelectedResidents !== null) {
      setResidents(mutableSelectedResidents.map((residentLabel) => residentLabel.value));
      setResidentError(false);
    }
    
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
    if (inputValue !== "") {
      setNotesError(false)
    }
  };

  // fetch resident + employee + tag data for log creation
  const getLogEntryOptions = async () => {
    const buildingsData = await BuildingAPIClient.getBuildings();

    if (buildingsData && buildingsData.buildings.length !== 0) {
      const buildingLabels: SelectLabel[] = buildingsData.buildings.map(
        (building) => ({ label: building.name, value: building.id }),
      );
      setBuildingOptions(buildingLabels);
    }

    const residentsData = await ResidentAPIClient.getResidents({
      returnAll: true,
    });

    if (residentsData && residentsData.residents.length !== 0) {
      // TODO: Remove the type assertions here
      const residentLabels: SelectLabel[] = residentsData.residents.map(
        (r) => ({ label: r.residentId, value: r.id }),
      );
      setResidentOptions(residentLabels);
    }

    const usersData = await UserAPIClient.getUsers({ returnAll: true });
    if (usersData && usersData.users.length !== 0) {
      const userLabels: SelectLabel[] = usersData.users
        .filter((user) => user.userStatus === "Active")
        .map((user) => ({
          label: `${user.firstName} ${user.lastName}`,
          value: user.id,
        }));
      setEmployeeOptions(userLabels);
    }

    const tagsData = await TagAPIClient.getTags({ returnAll: true });
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
    setTime(getFormattedTime(new Date()));
    setBuildingId(-1);
    setResidents([]);
    setTags([]);
    setAttnTo(-1);
    setNotes("");

    // reset all error states
    setDateError(false)
    setTimeError(false);
    setBuildingError(false);
    setResidentError(false);
    setNotesError(false);
  };

  const handleCreateClose = () => {
    setCreateOpen(false);
  };

  const handleSubmit = async () => {
    // Update error states
    if (date === undefined) {
      setDateError(true)
      return
    }
    if (!timeRegex.test(time)) {
      setTimeError(true)
      return;
    }
    if (buildingId === -1) {
      setBuildingError(true)
      return;
    }
    if (residents.length === 0) {
      setResidentError(true)
      return;
    }
    if (notes.length === 0) {
      setNotesError(true)
      return;
    }
    const attentionTo = attnTo === -1 ? undefined : attnTo;

    setLoading(true)

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
      newToast("Log record added", "Successfully added log record.", "success")
      countRecords();
      getRecords(1);
      setUserPageNum(1);
      setCreateOpen(false)
    } 
    else {
      newToast("Error adding log record", "Unable to add log record.", "error")
    }
    setLoading(false)
  };

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
        <Modal isOpen={isCreateOpen} scrollBehavior="inside" onClose={handleCreateClose}>
          <ModalOverlay />
          <ModalContent maxW="60%" overflowY="hidden">
            <ModalHeader>Add Log Record</ModalHeader>
            <ModalCloseButton size="lg" />
            <ModalBody>
              <Divider />
              <Row style={{ marginTop: "16px" }}>
                <Col>
                  <FormControl isRequired>
                    <FormLabel>Employee</FormLabel>
                    <Input
                      isDisabled
                      defaultValue={employee.label}
                      _hover={{ borderColor: "teal.100" }}
                    />
                  </FormControl>
                </Col>
                <Col>
                  <Grid templateColumns="repeat(2, 1fr)" gap="8px">
                    <GridItem minWidth="100%">
                      <FormControl isRequired isInvalid={dateError}>
                        <FormLabel>Date</FormLabel>
                        <SingleDatepicker
                          name="date-input"
                          date={date}
                          onDateChange={handleDateChange}
                          propsConfigs={{
                            ...singleDatePickerStyle,
                            inputProps: {
                              ...singleDatePickerStyle.inputProps,
                              placeholder: "YYYY-MM-DD",
                            },
                          }}
                        />
                        <FormErrorMessage>Date is invalid.</FormErrorMessage>
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
                    <FormErrorMessage>At least 1 resident is required.</FormErrorMessage>
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

              <Checkbox
                colorScheme="teal"
                style={{ paddingTop: "1rem" }}
                onChange={() => setFlagged(!flagged)}
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
                      rows={6}
                    />

                    <FormErrorMessage>Notes are required.</FormErrorMessage>
                  </FormControl>
                </Col>
              </Row>

            </ModalBody>
            <ModalFooter>   
              {loading &&
                <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                size="md"
                marginRight="10px"
                />
              }   
              <Button onClick={handleSubmit} variant="primary" type="submit">
                Submit
              </Button>
            </ModalFooter>   
          </ModalContent>
        </Modal>
      </Box>
    </div>
  );
};

export default CreateLog;
