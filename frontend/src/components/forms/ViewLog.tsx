import React from "react";
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
  ModalFooter,
  ModalCloseButton,
} from "@chakra-ui/react";
import { Col, Row } from "react-bootstrap";
import { viewStyle } from "../../theme/forms/selectStyles";
import { LogRecord } from "../../types/LogRecordTypes";
import { SelectLabel } from "../../types/SharedTypes";
import { convertToString, getFormattedTime } from "../../helper/dateHelpers";

type Props = {
  logRecord: LogRecord;
  isOpen: boolean;
  toggleClose: () => void;
  toggleEdit: () => void;
  residentOptions: SelectLabel[];
  tagOptions: SelectLabel[];
  employeeOptions: SelectLabel[];
  allowEdit: boolean;
};

const ViewLog = ({
  logRecord,
  isOpen,
  toggleClose,
  toggleEdit,
  residentOptions,
  tagOptions,
  employeeOptions,
  allowEdit,
}: Props): React.ReactElement => {
  const handleEdit = () => {
    toggleClose();
    setTimeout(toggleEdit, 400);
  };

  return (
    <>
      <Box>
        <Modal isOpen={isOpen} scrollBehavior="inside" onClose={toggleClose}>
          <ModalOverlay />
          <ModalContent maxW="50%">
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
                      defaultValue={`${logRecord.employee.firstName} ${logRecord.employee.lastName}`}
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
                          defaultValue={convertToString(
                            new Date(logRecord.datetime),
                          )}
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
                          defaultValue={getFormattedTime(
                            new Date(logRecord.datetime),
                          )}
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
                    <FormLabel>Tenants</FormLabel>
                    <Select
                      isDisabled
                      isMulti
                      components={{
                        DropdownIndicator: () => null,
                        MultiValueRemove: () => null,
                      }}
                      placeholder="No Tenants"
                      defaultValue={residentOptions.filter((item) =>
                        logRecord.residents.includes(item.label),
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
                      components={{
                        DropdownIndicator: () => null,
                        MultiValueRemove: () => null,
                      }}
                      placeholder="No Tags"
                      defaultValue={tagOptions.filter((item) =>
                        logRecord.tags.includes(item.label),
                      )}
                      styles={viewStyle}
                    />
                  </FormControl>
                </Col>
                <Col>
                  <FormControl mt={4}>
                    <FormLabel>Attention Tos</FormLabel>
                    <Select
                      isDisabled
                      isMulti
                      components={{
                        DropdownIndicator: () => null,
                        MultiValueRemove: () => null,
                      }}
                      placeholder="No Attn Tos"
                      defaultValue={employeeOptions.filter((item) => 
                        logRecord.attnTos.includes(item.label)
                      )}
                      styles={viewStyle}
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
                    <Text whiteSpace="pre-wrap">{logRecord.note}</Text>
                  </FormControl>
                </Col>
              </Row>
            </ModalBody>

            <ModalFooter>
              {allowEdit && (
                <Button onClick={handleEdit} variant="primary" type="submit">
                  Edit
                </Button>
              )}
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </>
  );
};

export default ViewLog;
