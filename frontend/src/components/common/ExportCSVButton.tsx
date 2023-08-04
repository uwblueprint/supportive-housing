import React, { useEffect, useState } from "react";
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
  ScaleFade,
  Alert,
  AlertDescription,
  AlertIcon,
  Tooltip,
  Grid,
  GridItem,
  Text,
} from "@chakra-ui/react";
import { TiExport } from "react-icons/ti";
import { SingleDatepicker } from "chakra-dayzed-datepicker";
import CSVConverter from "../../helper/CSVConverter";
import LogRecordAPIClient from "../../APIClients/LogRecordAPIClient";
import { singleDatePickerStyle } from "../../theme/forms/datePickerStyles";

const ExportCSVButton = (): React.ReactElement => {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [dateError, setDateError] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState(false);

  const [isOpen, setOpen] = useState(false);

  const handleClear = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setDateError(false);
  };

  const handleOpen = () => {
    setOpen(true);
    handleClear();
  };

  const handleClose = () => {
    setOpen(false);
  };

  const formatDate = (date: Date | undefined) => {
    if (date !== undefined) {
      return date.toLocaleString("fr-CA", { timeZone: "America/Toronto" }).substring(0, 10);
    }
    return "";
  };

  const handleSubmit = async () => {
    if (startDate && endDate && startDate >= endDate) {
      setDateError(true);
      return
    }
    setDateError(false);

    const dateRange = [formatDate(startDate), formatDate(endDate)];

    const data = await LogRecordAPIClient.filterLogRecords({
      dateRange: dateRange[0] === "" && dateRange[1] === "" ? [] : dateRange,
      returnAll: true, // return all data
    });

    setShowAlert(!data || !CSVConverter(data.logRecords));
  };

  useEffect(() => {
    if (showAlert) {
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }
  }, [showAlert]);

  return (
    <>
      <Tooltip label="Export to CSV">
        <IconButton
          aria-label="Export to CSV"
          icon={<Icon boxSize="36px" as={TiExport} />}
          variant="tertiary"
          onClick={handleOpen}
        />
      </Tooltip>

      <Box>
        <Modal isOpen={isOpen} onClose={handleClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Export to CSV File</ModalHeader>
            <ModalBody>
              <FormControl isInvalid={dateError}>
                <Grid templateColumns="repeat(9, 1fr)">
                  <GridItem colSpan={3}>
                    <SingleDatepicker
                      name="start-date-input"
                      date={startDate}
                      onDateChange={setStartDate}
                      propsConfigs={{
                        ...singleDatePickerStyle,
                        inputProps: {
                          ...singleDatePickerStyle.inputProps,
                          placeholder: "Start Date",
                        },
                      }}
                    />
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
                    <SingleDatepicker
                      name="end-date-input"
                      date={endDate}
                      onDateChange={setEndDate}
                      propsConfigs={{
                        ...singleDatePickerStyle,
                        inputProps: {
                          ...singleDatePickerStyle.inputProps,
                          placeholder: "End Date",
                        },
                      }}
                    />
                  </GridItem>
                  <GridItem
                    colSpan={2}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Button onClick={handleClear} variant="secondary">
                      Clear
                    </Button>
                  </GridItem>
                </Grid>
                {dateError &&
                  <FormErrorMessage>
                    The start date must be before the end date.
                  </FormErrorMessage>
                }
                <FormHelperText>
                  Note: If a range is not selected, all records will be printed.
                </FormHelperText>
              </FormControl>

              <Box textAlign="right" marginTop="12px" marginBottom="12px">
                <Button
                  onClick={handleClose}
                  variant="tertiary"
                  marginRight="8px"
                >
                  Cancel
                </Button>
                <Button onClick={handleSubmit} variant="primary" type="submit">
                  Export
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
          <Alert status="error" variant="left-accent" borderRadius="6px">
            <AlertIcon />
            <AlertDescription>No Log Records Found.</AlertDescription>
          </Alert>
        </ScaleFade>
      </Box>
    </>
  );
};

export default ExportCSVButton;
