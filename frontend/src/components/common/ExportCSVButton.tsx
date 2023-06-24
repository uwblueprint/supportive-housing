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
  Tooltip,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { RangeDatepicker } from "chakra-dayzed-datepicker";
import commonAPIClient from "../../APIClients/CommonAPIClient";
import CSVConverter from "../../helper/CSVConverter";

const ExportCSVButton = (): React.ReactElement => {
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
    const dateRange = selectedDates.map((date) =>
      date
        .toLocaleString("fr-CA", { timeZone: "America/Toronto" })
        .substring(0, 10),
    );

    const data = await commonAPIClient.filterLogRecords({
      dateRange,
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
          icon={<Icon boxSize="32px" as={ExternalLinkIcon} />}
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
              <FormControl>
                <Flex gap="8px">
                  <RangeDatepicker
                    selectedDates={selectedDates}
                    onDateChange={setSelectedDates}
                    propsConfigs={{
                      inputProps: {
                        placeholder: "MM/DD/YYYY - MM/DD/YYYY",
                      },
                    }}
                  />
                  <Button
                    onClick={handleClear}
                    variant="secondary"
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
                  variant="tertiary"
                  marginRight="8px"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  variant="primary"
                  type="submit"
                >
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
