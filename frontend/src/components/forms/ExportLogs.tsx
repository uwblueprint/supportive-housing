import React, { useState } from "react";
import {
  Icon,
  IconButton,
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  FormControl,
  Button,
  FormHelperText,
  FormErrorMessage,
  Tooltip,
  Grid,
  GridItem,
  Text,
  ModalFooter,
  ModalCloseButton,
  Spinner,
  FormLabel,
  Flex,
} from "@chakra-ui/react";
import { ArrowDownIcon, ArrowUpIcon } from "@chakra-ui/icons";
import { TiExport } from "react-icons/ti";
import LogRecordAPIClient from "../../APIClients/LogRecordAPIClient";
import { singleDatePickerStyle } from "../../theme/forms/datePickerStyles";
import {
  convertLogsToDOCX,
  convertLogsToCSV,
} from "../../helper/exportHelpers";
import CreateToast from "../common/Toasts";
import { getFormattedDateAndTime } from "../../helper/dateHelpers";
import { SingleDatepicker } from "../common/Datepicker";

const ExportLogs = (): React.ReactElement => {
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [isStartDateEmpty, setIsStartDateEmpty] = useState<boolean>(true);
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [isEndDateEmpty, setIsEndDateEmpty] = useState<boolean>(true);

  const [startDateError, setStartDateError] = useState<boolean>(false);
  const [endDateError, setEndDateError] = useState<boolean>(false);
  const [dateError, setDateError] = useState<boolean>(false);

  const [sortDirection, setSortDirection] = useState("desc");

  const [isOpen, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const newToast = CreateToast();

  const handleClear = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setSortDirection("desc");
    setDateError(false);
    setStartDateError(false);
    setEndDateError(false);
    setIsStartDateEmpty(true);
    setIsEndDateEmpty(true);
  };

  const handleStartDateChange = (
    inputValue: Date | undefined,
    isEmpty: boolean,
  ) => {
    setStartDate(inputValue);
    setIsStartDateEmpty(isEmpty);
    if (isEmpty || inputValue) {
      setStartDateError(false);
    }
    if (endDate && inputValue && inputValue < endDate) {
      setDateError(false);
    }
    return true;
  };

  const handleEndDateChange = (
    inputValue: Date | undefined,
    isEmpty: boolean,
  ) => {
    setEndDate(inputValue);
    setIsEndDateEmpty(isEmpty);
    if (isEmpty || inputValue) {
      setEndDateError(false);
    }
    if (startDate && inputValue && inputValue > startDate) {
      setDateError(false);
    }
    return true;
  };

  const handleOpen = () => {
    setOpen(true);
    handleClear();
  };

  const handleClose = () => {
    setOpen(false);
  };

  const validateDates = (): boolean => {
    if (!startDate && !isStartDateEmpty) {
      setStartDateError(true);
      return false;
    }
    if (!endDate && !isEndDateEmpty) {
      setEndDateError(true);
      return false;
    }
    if (startDate && endDate && startDate > endDate) {
      setDateError(true);
      return false;
    }
    return true;
  };

  const constructDateRange = (): (string | null)[] | undefined => {
    let dateRange;
    if (startDate || endDate) {
      startDate?.setHours(0, 0, 0, 0);
      endDate?.setHours(23, 59, 59, 999);

      dateRange = [
        startDate ? startDate.toISOString() : null,
        endDate ? endDate.toISOString() : null,
      ];
    }

    return dateRange;
  };

  const handleDocxExport = async () => {
    if (!validateDates()) {
      return;
    }

    setLoading(true);
    const data = await LogRecordAPIClient.filterLogRecords({
      dateRange: constructDateRange(),
      sortDirection,
      returnAll: true,
    });

    if (!data || data.logRecords.length === 0) {
      newToast(
        "Error downloading DOCX",
        "No records found in the provided date range.",
        "error",
      );
    } else {
      const formattedLogRecords = data.logRecords.map((logRecord) => {
        const { date, time } = getFormattedDateAndTime(
          new Date(logRecord.datetime),
          true,
        );
        return { ...logRecord, datetime: `${date}, ${time}` };
      });
      const success = await convertLogsToDOCX(formattedLogRecords);
      if (success) {
        newToast("DOCX downloaded", "Successfully downloaded DOCX.", "success");
        handleClose();
      } else {
        newToast("Error downloading DOCX", "Unable to download DOCX.", "error");
      }
    }
    setLoading(false);
  };

  const handleCsvExport = async () => {
    if (!validateDates()) {
      return;
    }

    setLoading(true);
    const data = await LogRecordAPIClient.filterLogRecords({
      dateRange: constructDateRange(),
      sortDirection,
      returnAll: true,
    });

    if (!data || data.logRecords.length === 0) {
      newToast(
        "Error downloading CSV",
        "No records found in the provided date range.",
        "error",
      );
    } else {
      const formattedLogRecords = data.logRecords.map((logRecord) => {
        const { date, time } = getFormattedDateAndTime(
          new Date(logRecord.datetime),
          true,
        );
        return { ...logRecord, datetime: `${date}, ${time}` };
      });
      const success = convertLogsToCSV(formattedLogRecords);
      if (success) {
        newToast("CSV downloaded", "Successfully downloaded CSV.", "success");
        handleClose();
      } else {
        newToast("Error downloading CSV", "Unable to download CSV.", "error");
      }
    }
    setLoading(false);
  };

  return (
    <>
      <Tooltip label="Export Logs">
        <IconButton
          aria-label="Export Logs"
          icon={<Icon boxSize="36px" as={TiExport} />}
          variant="tertiary"
          onClick={handleOpen}
        />
      </Tooltip>

      <Box>
        <Modal isOpen={isOpen} onClose={handleClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Export Logs</ModalHeader>
            <ModalCloseButton size="lg" />
            <ModalBody>
              <FormControl isInvalid={dateError}>
                <FormLabel>Date Range</FormLabel>
                <Grid templateColumns="repeat(9, 1fr)">
                  <GridItem colSpan={3}>
                    <FormControl isInvalid={startDateError}>
                      <SingleDatepicker
                        name="start-date-input"
                        date={startDate}
                        onDateChange={handleStartDateChange}
                        propsConfigs={{
                          ...singleDatePickerStyle,
                          inputProps: {
                            ...singleDatePickerStyle.inputProps,
                            placeholder: "YYYY-MM-DD",
                          },
                        }}
                      />
                      <FormErrorMessage>
                        Start date is invalid.
                      </FormErrorMessage>
                    </FormControl>
                  </GridItem>
                  <GridItem
                    colSpan={1}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Text fontSize="14px" color="#6D8788" fontWeight="700">
                      TO
                    </Text>
                  </GridItem>
                  <GridItem colSpan={3}>
                    <FormControl isInvalid={endDateError}>
                      <SingleDatepicker
                        name="end-date-input"
                        date={endDate}
                        onDateChange={handleEndDateChange}
                        propsConfigs={{
                          ...singleDatePickerStyle,
                          inputProps: {
                            ...singleDatePickerStyle.inputProps,
                            placeholder: "YYYY-MM-DD",
                          },
                        }}
                      />
                      <FormErrorMessage>End date is invalid.</FormErrorMessage>
                    </FormControl>
                  </GridItem>
                </Grid>
                {dateError && (
                  <FormErrorMessage>
                    The start date must be before the end date.
                  </FormErrorMessage>
                )}
                <FormHelperText>
                  Note: If a range is not selected, all records will be printed.
                </FormHelperText>
              </FormControl>
              <FormControl>
                <FormLabel mt={4}>Sort Direction</FormLabel>
                <Flex alignItems="center" gap="10px">
                  <IconButton
                    aria-label="calendar"
                    size="sm"
                    variant="secondary"
                    fontSize="20px"
                    icon={
                      sortDirection === "desc" ? (
                        <ArrowDownIcon />
                      ) : (
                        <ArrowUpIcon />
                      )
                    }
                    onClick={() =>
                      setSortDirection(
                        sortDirection === "desc" ? "asc" : "desc",
                      )
                    }
                  />
                  <Text>
                    {sortDirection === "desc" ? "Descending" : "Ascending"}
                  </Text>
                </Flex>
              </FormControl>
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
              <Button
                onClick={handleDocxExport}
                variant="primary"
                type="submit"
                marginRight="10px"
              >
                Export As DOCX
              </Button>
              <Button onClick={handleCsvExport} variant="primary" type="submit">
                Export As CSV
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </>
  );
};

export default ExportLogs;
