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
  Flex,
  ScaleFade,
  Alert,
  AlertDescription,
  AlertIcon,
} from "@chakra-ui/react";
import { AiFillPrinter } from "react-icons/ai";
import { RangeDatepicker } from "chakra-dayzed-datepicker";
import commonAPIClient from "../../APIClients/CommonAPIClient";
import CSVConverter from "../../helper/CSVConverter";

const PrintCSVButton = (): React.ReactElement => {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [showAlert, setShowAlert] = useState(false);

  const [isOpen, setOpen] = useState(false);

  const handleClear = () => {
    setSelectedDates([]);
  };

  const handleOpen = () => {
    setOpen(true);
    setSelectedDates([]);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    // Use YYYY-MM-DD format
    const dateRange = selectedDates.map((date) =>
      date.toISOString().substring(0, 10),
    );

    const data = await commonAPIClient.filterLogRecords(
      undefined,
      undefined,
      undefined,
      dateRange,
      undefined,
      undefined,
      true, // return all data
    );

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
      <IconButton
        aria-label="Print CSV"
        className="ghost-button"
        icon={<Icon boxSize="32px" as={AiFillPrinter} />}
        variant="ghost"
        onClick={handleOpen}
      />

      <Box>
        <Modal isOpen={isOpen} onClose={handleClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Print CSV File</ModalHeader>
            <ModalBody>
              <FormControl>
                <Flex gap="8px">
                  <RangeDatepicker
                    selectedDates={selectedDates}
                    onDateChange={setSelectedDates}
                    propsConfigs={{
                      inputProps: {
                        placeholder: 'MM/DD/YYYY - MM/DD/YYYY'
                      },
                    }}
                  />
                  <Button
                    onClick={handleClear}
                    className="button ghost-button"
                    variant="ghost"
                  >
                    Clear
                  </Button>
                </Flex>
                <FormHelperText>
                  Note: If a range is not selected, all records will be printed.
                </FormHelperText>
              </FormControl>

              <Box textAlign="right" marginTop="12px" marginBottom="12px">
                <Button
                  onClick={handleClose}
                  className="button ghost-button"
                  variant="ghost"
                  marginRight="8px"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="button solid-button"
                  type="submit"
                >
                  Print
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

export default PrintCSVButton;
