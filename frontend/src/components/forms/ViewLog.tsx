/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from "react";
import Select from "react-select";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
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
} from "@chakra-ui/react";
import { Col, Row } from "react-bootstrap";
import { AuthenticatedUser } from "../../types/AuthTypes";
import { getLocalStorageObj } from "../../utils/LocalStorageUtils";
import AUTHENTICATED_USER_KEY from "../../constants/AuthConstants";
import { viewStyle}  from "../../theme/forms/selectStyles";
import { LogRecord } from "../../types/LogRecordTypes";
import { SelectLabel } from "../../types/SharedTypes";

type Props = {
  logRecord: LogRecord;
  isOpen: boolean;
  toggleClose: () => void;
  toggleEdit: () => void;
  employeeOptions: SelectLabel[];
  residentOptions: SelectLabel[];
  buildingOptions: SelectLabel[];
  tagOptions: SelectLabel[];
};

// Helper to get the currently logged in user
const getCurUserSelectOption = () => {
  const curUser: AuthenticatedUser | null = getLocalStorageObj(
    AUTHENTICATED_USER_KEY,
  );
  if (curUser) {
    return `${curUser.firstName} ${curUser.lastName}`
  }
  return "";
};

const ViewLog = ({
  logRecord,
  isOpen,
  toggleClose,
  toggleEdit,
  employeeOptions,
  residentOptions,
  buildingOptions,
  tagOptions,
}: Props) => {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(
    date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
  );

  const initializeValues = () => {
    // set state variables
    setDate(new Date(logRecord.datetime));
    setTime(
      date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    );
  };

  const formatDate = (dateObj: Date) => {
    return dateObj.toISOString().slice(0, 10);
  }

  const handleEdit = () => {
    toggleClose();
    setTimeout(toggleEdit, 400);
  }

  useEffect(() => {
    if (isOpen) {
      initializeValues();
    }
  }, [isOpen]);

  return (
    <>
      <Box>
        <Modal isOpen={isOpen} scrollBehavior="inside" onClose={toggleClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>View Log Record</ModalHeader>
            <ModalCloseButton size="lg" />
            <ModalBody>
              <Divider />
              <Row style={{ marginTop: "16px" }}>
                <Col>
                  <FormControl>
                    <FormLabel>Employee</FormLabel>
                    <Input
                      isDisabled
                      defaultValue={getCurUserSelectOption()}
                      _disabled={{ bg: "transparent" }}
                      _hover={{ borderColor: "teal.100" }}
                    />
                  </FormControl>
                </Col>
                <Col>
                  <Grid templateColumns="repeat(2, 1fr)" gap="8px">
                    <GridItem minWidth="100%">
                      <FormControl>
                        <FormLabel>Date</FormLabel>
                        <Input
                          isDisabled
                          defaultValue={formatDate(date)}
                          _disabled={{ bg: "transparent" }}
                          _hover={{ borderColor: "teal.100" }}
                        />
                      </FormControl>
                    </GridItem>
                    <GridItem minWidth="100%">
                      <FormControl>
                        <FormLabel>Time</FormLabel>
                        <Input
                          isDisabled
                          size="md"
                          type="time"
                          defaultValue={time}
                          _disabled={{ bg: "transparent" }}
                          _hover={{ borderColor: "teal.100" }}
                        />
                      </FormControl>
                    </GridItem>
                  </Grid>
                </Col>
              </Row>

              <Row>
                <Col>
                  <FormControl mt={4}>
                    <FormLabel>Building</FormLabel>
                    <Input
                      isDisabled
                      defaultValue={logRecord.building.name}
                      _disabled={{ bg: "transparent" }}
                      _hover={{ borderColor: "teal.100" }}
                    />
                  </FormControl>
                </Col>
                <Col>
                  <FormControl mt={4}>
                  <FormLabel>Residents</FormLabel>
                    <Select
                      isDisabled
                      isMulti
                      components={{ DropdownIndicator: () => null, MultiValueRemove: () => null }}
                      defaultValue={residentOptions.filter(
                        (item) => logRecord.residents.includes(item.label),
                      )}
                      styles={viewStyle}
                    />
                  </FormControl>
                </Col>
              </Row>

              <Row>
                <Col>
                  <FormControl mt={4}>
                    <FormLabel>Tags</FormLabel>
                    <Select
                      isDisabled
                      isMulti
                      components={{ DropdownIndicator: () => null, MultiValueRemove: () => null }}
                      placeholder="No Tags"
                      defaultValue={tagOptions.filter(
                        (item) => logRecord.tags.includes(item.label),
                      )}
                      styles={viewStyle}
                    />
                  </FormControl>
                </Col>
                <Col>
                  <FormControl mt={4}>
                    <FormLabel>Attention To</FormLabel>
                    <Input
                      isDisabled
                      placeholder="No Attn To"
                      defaultValue={logRecord.attnTo ? `${logRecord.attnTo.firstName} ${logRecord.attnTo.lastName}` : undefined}
                      _disabled={{ bg: "transparent" }}
                      _hover={{ borderColor: "teal.100" }}
                    />
                  </FormControl>
                </Col>
              </Row>

              <Checkbox
                colorScheme="teal"
                style={{ paddingTop: "1rem", pointerEvents: "none" }}
                marginBottom="16px"
                defaultChecked={logRecord.flagged}
              >
                <Text>Flagged</Text>
              </Checkbox>

              <Divider />

              <Row>
                <Col>
                  <FormControl mt={4}>
                    <FormLabel>Notes</FormLabel>
                    <Text whiteSpace="pre-wrap">
                      {logRecord.note}
                    </Text>
                  </FormControl>
                </Col>
              </Row>
            </ModalBody>

            <ModalFooter>
              <Button onClick={handleEdit} variant="primary" type="submit">
                Edit
              </Button>
            </ModalFooter>  
          </ModalContent>
        </Modal>
      </Box>
    </>
  );
};

export default ViewLog;
