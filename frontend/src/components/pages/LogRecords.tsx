import React, { useState } from "react";
import { MultiSelect } from "react-multi-select-component";
import {
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Input,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  Textarea,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import { Col, InputGroup, Row } from "react-bootstrap";
import { BsFillPersonFill, BsFillFlagFill, BsHouseFill } from "react-icons/bs";
import NavigationBar from "../common/NavigationBar";

const BUILDINGS = ["144", "362", "402"]

// Replace this with the tags from the db once the API and table are made
const TAGS = [
  {label: "Tag A", value: "A"},
  {label: "Tag B", value: "B"},
  {label: "Tag C", value: "C"},
]

// Replace the mock data with data from API, JSON response
const mockRecords = [
  {
    id: 1,
    Date: "Jan 21",
    Time: "12:15 AM",
    Resident: "DE307",
    Note: "A female guest came to see DE 307.",
    Employee: "Huseyin",
    Attn_To: "John Doe",
  },
  {
    id: 2,
    Date: "Jan 21",
    Time: "1:00 AM",
    Resident: "AH206",
    Note: "Dustin left.",
    Employee: "Huseyin",
    Attn_To: "John Doe",
  },
  {
    id: 3,
    Date: "Jan 21",
    Time: "2:45 AM",
    Resident: "DE307",
    Note: "Vic came",
    Employee: "Huseyin",
    Attn_To: "John Doe",
  },
  {
    id: 4,
    Date: "Jan 21",
    Time: "3:20 AM",
    Resident: "MB404",
    Note:
      "During security check, MB404 was making some noise. TSW warned her to be quiet. She yelled on TSW behind the door, yelled, and swore (f..uck of......). TSW told her that I will call the police if she continues. Then she came down for laundry.",
    Employee: "Huseyin",
    Attn_To: "John Doe",
  },
];

const LogComponent = () => {
  const [building, setBuilding] = React.useState("");
  const [tags, setTags] = React.useState([]);
  const [value, setValue] = React.useState("");

  const handleInputChange = (e: { target: { value: unknown } }) => {
    const inputValue: string = e.target.value as string;
    setValue(inputValue);
  };

  const handleBuildingChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setBuilding(event.target.value);
  };

  // const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   // eslint-disable-next-line no-console
  //   console.log(
  //     `Employee: ${employee}, Date: ${new Date()}, Building: ${building}, Tags: ${tags}`,
  //   );
  // };

  const [isCreateOpen, setCreateOpen] = React.useState(false);
  const handleCreateOpen = () => {
    setCreateOpen(true);
  };

  const handleCreateClose = () => {
    setCreateOpen(false);
  };

  return (
    <div
      className="log-entry"
      style={{ paddingBottom: "1rem", textAlign: "right" }}
    >
      <Button onClick={handleCreateOpen}>+ Log</Button>
      <Modal isOpen={isCreateOpen} onClose={handleCreateClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New Log Entry Details</ModalHeader>
          <ModalBody>
            {/* <form onSubmit={handleSubmit}> */}
            <Row>
              <Col>
                <FormControl>
                  <FormLabel>Employee</FormLabel>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                        paddingLeft: "6px",
                      }}
                    >
                      <BsFillPersonFill />
                    </InputLeftElement>
                    <Input
                      type="text"
                      variant="filled"
                      bg="#EAF0EF"
                      isDisabled
                    />
                  </InputGroup>
                </FormControl>
              </Col>
              <Col>
                <FormControl>
                  <FormLabel>Date</FormLabel>
                  <Input type="datetime-local" size="sm" />
                </FormControl>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormControl mt={4}>
                  <FormLabel>Building</FormLabel>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                        paddingLeft: "6px",
                      }}
                    >
                      <BsHouseFill />
                    </InputLeftElement>
                    <Select
                      value={building}
                      onChange={handleBuildingChange}
                      style={{ textIndent: "10px" }}
                    >
                      {BUILDINGS.map((buildingOption) => {
                        return (
                          <option
                            value={buildingOption}
                            key={buildingOption}
                          >
                            {buildingOption}
                          </option>
                        )
                      })}
                    </Select>
                  </InputGroup>
                </FormControl>
              </Col>
              <Col>
                <FormControl mt={4}>
                  <FormLabel>Resident</FormLabel>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                        paddingLeft: "6px",
                      }}
                    >
                      <BsFillPersonFill />
                    </InputLeftElement>
                    <Input
                      type="text"
                      placeholder="Enter Resident Code"
                      style={{ textIndent: "10px" }}
                    />
                  </InputGroup>
                </FormControl>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormControl mt={4}>
                  <FormLabel>Tags</FormLabel>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                        paddingLeft: "6px",
                      }}
                    >
                      <BsHouseFill />
                    </InputLeftElement>
                  </InputGroup>
                </FormControl>
              </Col>
              <Col>
                <FormControl mt={4}>
                  <FormLabel>Attention To</FormLabel>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                        paddingLeft: "6px",
                      }}
                    >
                      <BsFillFlagFill />
                    </InputLeftElement>
                    <Input
                      type="text"
                      placeholder="Enter Employee"
                      style={{ textIndent: "10px" }}
                    />
                  </InputGroup>
                </FormControl>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormLabel mt={4}>Notes</FormLabel>
                <Textarea
                  value={value}
                  onChange={handleInputChange}
                  placeholder="Enter log notes here..."
                  size="lg"
                  style={{ resize: "none" }}
                />
              </Col>
            </Row>
            <Checkbox defaultChecked style={{ paddingTop: "1rem" }}>
              Flag this Report
            </Checkbox>
            <Row
              style={{
                textAlign: "right",
                alignItems: "center",
                paddingBottom: "1rem"
              }}
            >
              <Col>
                <Button onClick={handleCreateClose} variant="link">
                  Cancel
                </Button>
              </Col>
              <Col xs="auto">
                <Button color="#285E61" type="submit">
                  Submit
                </Button>
              </Col>
            </Row>
            {/* </form> */}
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

const LogRecords = (): React.ReactElement => {
  return (
    <div className="page-container">
      <NavigationBar />
      <div className="records">
        <LogComponent />
        <TableContainer>
          <Table
            variant="simple"
            style={{ minHeight: "400px", verticalAlign: "middle" }}
          >
            <Thead className="table-header">
              <Tr>
                <Th>Date</Th>
                <Th>Time</Th>
                <Th>Resident</Th>
                <Th>Note</Th>
                <Th>Employee</Th>
                <Th>Attn To</Th>
              </Tr>
            </Thead>

            <Tbody>
              {mockRecords.map((record) => {
                return (
                  <Tr key={record.id} style={{ verticalAlign: "middle" }}>
                    <Td width="5%">{record.Date}</Td>
                    <Td width="5%">{record.Time}</Td>
                    <Td width="5%">{record.Resident}</Td>
                    <Td whiteSpace="normal" width="75%">
                      {record.Note}
                    </Td>
                    <Td width="5%">{record.Employee}</Td>
                    <Td width="5%">{record.Attn_To}</Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default LogRecords;

// type LogComponentProps = {
//   employee: string;
// };

// eslint-disable-next-line react/prop-types
