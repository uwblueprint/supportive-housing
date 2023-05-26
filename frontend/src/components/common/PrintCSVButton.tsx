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
  Flex,
} from "@chakra-ui/react";
import { AiFillPrinter } from "react-icons/ai";
import { RangeDatepicker } from "chakra-dayzed-datepicker";
import commonAPIClient from "../../APIClients/CommonAPIClient";

const PrintCSVButton = (): React.ReactElement => {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);

  const handleClear = () => {
    setSelectedDates([]);
  };

  const [isOpen, setOpen] = useState(false);

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
      undefined,
    );
  };

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
    </>
  );
};

export default PrintCSVButton;
