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
  ModalFooter,
  ModalCloseButton,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { SmallCloseIcon } from "@chakra-ui/icons";
import { TiExport } from "react-icons/ti";
import { SingleDatepicker } from "chakra-dayzed-datepicker";
import LogRecordAPIClient from "../../APIClients/LogRecordAPIClient";
import { singleDatePickerStyle } from "../../theme/forms/datePickerStyles";
import convertLogsToCSV from "../../helper/csvHelpers";

const ExportToCSV = (): React.ReactElement => {
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

  const handleSubmit = async () => {
    if (startDate && endDate && startDate > endDate) {
      setDateError(true);
      return;
    }
    setDateError(false);

    let dateRange;
    if (startDate || endDate) {
      startDate?.setHours(0, 0, 0, 0);
      endDate?.setHours(23, 59, 59, 999);

      dateRange = [
        startDate ? startDate.toISOString() : null,
        endDate ? endDate.toISOString() : null,
      ];
    }
    const data = await LogRecordAPIClient.filterLogRecords({
      dateRange,
      returnAll: true, // return all data
    });

    setShowAlert(!data || !convertLogsToCSV(data.logRecords));
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
            <ModalCloseButton size="lg" />
            <ModalBody>
              <FormControl isInvalid={dateError}>
                <Grid templateColumns="repeat(9, 1fr)">
                  <GridItem colSpan={3}>
                    <InputGroup>
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
                      {startDate && (
                        <InputRightElement>
                          <IconButton
                            onClick={() => setStartDate(undefined)}
                            aria-label="clear"
                            variant="icon"
                            icon={
                              <SmallCloseIcon
                                boxSize="5"
                                color="gray.200"
                                _hover={{ color: "gray.400" }}
                                transition="color 0.1s ease-in-out"
                              />
                            }
                          />
                        </InputRightElement>
                      )}
                    </InputGroup>
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
                    <InputGroup>
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
                      {endDate && (
                        <InputRightElement>
                          <IconButton
                            onClick={() => setEndDate(undefined)}
                            aria-label="clear"
                            variant="icon"
                            icon={
                              <SmallCloseIcon
                                boxSize="5"
                                color="gray.200"
                                _hover={{ color: "gray.400" }}
                                transition="color 0.1s ease-in-out"
                              />
                            }
                          />
                        </InputRightElement>
                      )}
                    </InputGroup>
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
            </ModalBody>

            <ModalFooter>
              <Button onClick={handleSubmit} variant="primary" type="submit">
                Export
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
          <Alert status="error" variant="left-accent" borderRadius="6px">
            <AlertIcon />
            <AlertDescription>No Log Records Found.</AlertDescription>
          </Alert>
        </ScaleFade>
      </Box>
    </>
  );
};

export default ExportToCSV;
