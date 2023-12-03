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
} from "@chakra-ui/react";
import { Col, Row } from "react-bootstrap";
import { AuthenticatedUser } from "../../types/AuthTypes";
import { getLocalStorageObj } from "../../utils/LocalStorageUtils";
import AUTHENTICATED_USER_KEY from "../../constants/AuthConstants";
import selectStyle from "../../theme/forms/selectStyles";
import { BuildingLabel } from "../../types/BuildingTypes";
import { UserLabel } from "../../types/UserTypes";
import { TagLabel } from "../../types/TagTypes";
import { LogRecord } from "../../types/LogRecordTypes";

type Props = {
  logRecord: LogRecord;
  isOpen: boolean;
  toggleClose: () => void;
  toggleEdit: () => void;
  employeeOptions: UserLabel[];
  residentOptions: UserLabel[];
  buildingOptions: BuildingLabel[];
  tagOptions: TagLabel[];
};

// Helper to get the currently logged in user
const getCurUserSelectOption = () => {
  const curUser: AuthenticatedUser | null = getLocalStorageObj(
    AUTHENTICATED_USER_KEY,
  );
  if (curUser && curUser.firstName && curUser.id) {
    const userId = curUser.id;
    return { label: curUser.firstName, value: userId };
  }
  return { label: "", value: -1 };
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
  const [buildingId, setBuildingId] = useState<number>(-1);
  const [notes, setNotes] = useState("");
  const [flagged, setFlagged] = useState(false);

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
    setBuildingId(logRecord.building.id);
    setNotes(logRecord.note);
    setFlagged(logRecord.flagged);
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
        <Modal isOpen={isOpen} onClose={toggleClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>View Log Entry Details</ModalHeader>
            <ModalBody>
              <Divider />
              <Row style={{ marginTop: "16px" }}>
                <Col>
                  <FormControl>
                    <FormLabel>Employee</FormLabel>
                    <Select
                      isDisabled
                      components={{ DropdownIndicator:() => null }}
                      defaultValue={getCurUserSelectOption()}
                      styles={selectStyle}
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
                      style={selectStyle}
                      defaultValue={buildingOptions.find(
                        (item) => item.value === buildingId,
                      )?.label}
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
                      isDisabled
                      isMulti
                      components={{ DropdownIndicator: () => null, MultiValueRemove: () => null }}
                      placeholder="No Tags"
                      defaultValue={tagOptions.filter(
                        (item) => logRecord.tags.includes(item.label),
                      )}
                      styles={selectStyle}
                    />
                  </FormControl>
                </Col>
                <Col>
                  <FormControl mt={4}>
                    <FormLabel>Attention To</FormLabel>
                    <Input
                      isDisabled
                      placeholder="No Employee"
                      defaultValue={employeeOptions.find(
                        (item) => item.value === logRecord.attnTo?.id,
                      )?.label}
                      style={selectStyle}
                    />
                  </FormControl>
                </Col>
              </Row>

              <Checkbox
                isDisabled
                colorScheme="gray"
                style={{ paddingTop: "1rem" }}
                marginBottom="16px"
                defaultChecked={flagged}
              >
                <Text>Flag this Report</Text>
              </Checkbox>

              <Row>
                <Col>
                  <FormControl mt={4}>
                    <FormLabel>Notes</FormLabel>
                    <Textarea
                      isDisabled
                      value={notes}
                      resize="none"
                    />
                  </FormControl>
                </Col>
              </Row>

              <Divider />

              <Box textAlign="right" marginTop="12px" marginBottom="12px">
                <Button
                  onClick={toggleClose}
                  variant="tertiary"
                  marginRight="8px"
                >
                  Cancel
                </Button>
                <Button onClick={handleEdit} variant="primary" type="submit">
                  Edit
                </Button>
              </Box>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    </>
  );
};

export default ViewLog;
