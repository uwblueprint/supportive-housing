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
} from "@chakra-ui/react";
import { Col, InputGroup, Row } from "react-bootstrap";
import { BsFillPersonFill, BsFillFlagFill, BsHouseFill } from "react-icons/bs";

const BUILDINGS = ["144", "362", "402"]

// Replace this with the tags from the db once the API and table are made
const TAGS = [
    { label: "Tag A", value: "A" },
    { label: "Tag B", value: "B" },
    { label: "Tag C", value: "C" },
]

const CreateLog = () => {
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

    const [isCreateOpen, setCreateOpen] = React.useState(false);
    const handleCreateOpen = () => {
        setCreateOpen(true);
    };

    const handleCreateClose = () => {
        setCreateOpen(false);
    };

    return (
        <div>
            <Button onClick={handleCreateOpen}>+ Log</Button>
            <Modal isOpen={isCreateOpen} onClose={handleCreateClose} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>New Log Entry Details</ModalHeader>
                    <ModalBody>
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
                                    <MultiSelect
                                            options={TAGS}
                                            value={tags}
                                            onChange={setTags}
                                            labelledBy="Select"
                                            hasSelectAll={false}
                                        />
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
                    </ModalBody>
                </ModalContent>
            </Modal>
        </div>
    );
};

export default CreateLog;