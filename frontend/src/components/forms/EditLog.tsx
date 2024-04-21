/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from "react";
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
  ModalFooter,
  ModalCloseButton,
  Spinner,
} from "@chakra-ui/react";
import { Col, Row } from "react-bootstrap";
import LogRecordAPIClient from "../../APIClients/LogRecordAPIClient";
import { selectStyle } from "../../theme/forms/selectStyles";
import { singleDatePickerStyle } from "../../theme/forms/datePickerStyles";
import { LogRecord } from "../../types/LogRecordTypes";
import { combineDateTime, getFormattedTime } from "../../helper/dateHelpers";
import { SelectLabel } from "../../types/SharedTypes";
import CreateToast from "../common/Toasts";
import { SingleDatepicker } from "../common/Datepicker";

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
  buildingOptions: SelectLabel[];
};

// Regex to match time format HH:mm
const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

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
  buildingOptions,
}: Props): React.ReactElement => {

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState("");
  const [buildingId, setBuildingId] = useState<number>(-1);
  const [residents, setResidents] = useState<number[]>([]);
  const [tags, setTags] = useState<number[]>([]);
  const [attnTos, setAttnTos] = useState<number[]>([]);
  const [notes, setNotes] = useState("");
  const [flagged, setFlagged] = useState(false);

  // error states for inputs
  const [dateError, setDateError] = useState(false);
  const [timeError, setTimeError] = useState(false);
  const [buildingError, setBuildingError] = useState(false);
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

  const handleAttnTosChange = (
    selectedAttnTos: MultiValue<SelectLabel>,
  ) => {
    const mutableSelectedAttnTos: SelectLabel[] = Array.from(
      selectedAttnTos,
    );
    if (mutableSelectedAttnTos !== null) {
      setAttnTos(mutableSelectedAttnTos.map((attnToLabel) => attnToLabel.value));
    }
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value as string;
    setNotes(inputValue);
    if (inputValue !== "") {
      setNotesError(false)
    }
  };

  const initializeValues = () => {
    // set state variables
    setDate(new Date(logRecord.datetime));
    setTime(getFormattedTime(new Date(logRecord.datetime)));
    setBuildingId(logRecord.building.id);
    const residentIds = residentOptions.filter(
      (item) => logRecord.residents.includes(item.label),
    ).map((item) => item.value);
    setResidents(residentIds);
    const tagIds = tagOptions.filter(
      (item) => logRecord.tags.includes(item.label),
    ).map((item) => item.value);
    setTags(tagIds);
    const attnToIds = employeeOptions.filter(
      (item) => logRecord.attnTos.includes(item.label),
    ).map((item) => item.value);
    setAttnTos(attnToIds);
    setNotes(logRecord.note);
    setFlagged(logRecord.flagged);

    // error states for inputs
    setDateError(false)
    setTimeError(false);
    setBuildingError(false);
    setNotesError(false);
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
    if (notes.length === 0) {
      setNotesError(true)
      return;
    }

    setLoading(true)

    const res = await LogRecordAPIClient.editLogRecord({
      logId: logRecord.logId,
      employeeId: logRecord.employee.id,
      residents,
      datetime: combineDateTime(date, time),
      flagged,
      note: notes,
      tags,
      buildingId,
      attnTos
    });
    if (res) {
      newToast("Log record updated", "Successfully updated log record.", "success")
      countRecords();
      getRecords(userPageNum);
      toggleClose();
    } else {
      newToast("Error updating log record", "Unable to update log record.", "error")
    }
    setLoading(false)
  };

  useEffect(() => {
    if (isOpen) {
      initializeValues();
    }
  /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [isOpen]);

  return (
    <>
      <Box>
        <Modal isOpen={isOpen} scrollBehavior="inside" onClose={toggleClose}>
          <ModalOverlay />
          <ModalContent maxW="60%">
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
                      defaultValue={buildingOptions.find(
                        (item) => item.value === buildingId,
                      )}
                    />
                    <FormErrorMessage>Building is required.</FormErrorMessage>
                  </FormControl>
                </Col>
                <Col>
                  <FormControl mt={4}>
                  <FormLabel>Tenants</FormLabel>
                    <Select
                      options={residentOptions}
                      isMulti
                      closeMenuOnSelect={false}
                      placeholder="Select Tenants"
                      onChange={handleResidentsChange}
                      defaultValue={residentOptions.filter(
                        (item) => logRecord.residents.includes(item.label),
                      )}
                      styles={selectStyle}
                    />
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
                    <FormLabel>Attention Tos</FormLabel>
                    <Select
                      options={employeeOptions}
                      isMulti
                      closeMenuOnSelect={false}
                      placeholder="Select Employees"
                      onChange={handleAttnTosChange}
                      styles={selectStyle}
                      defaultValue={employeeOptions.filter((item) => 
                        logRecord.attnTos.includes(item.label)
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
                  Save
                </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </>
  );
};

export default EditLog;
