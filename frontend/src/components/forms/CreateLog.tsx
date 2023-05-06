import React, { useState } from "react";
import Select from 'react-select'
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
    Textarea,
} from "@chakra-ui/react";
import { Col, InputGroup, Row } from "react-bootstrap";

// Ideally we should be storing this information in the database
const BUILDINGS = [
    { label: "144", value: "144 Erb St. West" },
    { label: "362", value: "362 Erb St. West" },
    { label: "402", value: "402 Erb St. West" },
]

// Replace this with the tags from the db once the API and table are made
const TAGS = [
    { label: "Tag A", value: "A" },
    { label: "Tag B", value: "B" },
    { label: "Tag C", value: "C" },
]

// Replace this with the residents from the db
const RESIDENTS = [
    { label: "DE307", value: "DE307" },
    { label: "AH206", value: "AH206" },
    { label: "MB404", value: "MB404" },
]

// Replace this with the users from the db
const EMPLOYEES = [
    { label: "Huseyin", value: "Huseyin" },
    { label: "John Doe", value: "John Doe" },
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
                                    <Select options={EMPLOYEES} isDisabled defaultValue={{label: "Huseyin", value: "Huseyin" }} />
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
                                    <Select options={BUILDINGS} />
                                </FormControl>
                            </Col>
                            <Col>
                                <FormControl mt={4}>
                                    <FormLabel>Resident</FormLabel>
                                    <Select options={RESIDENTS} />
                                </FormControl>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <FormControl mt={4}>
                                    <FormLabel>Tags</FormLabel>
                                    <Select options={TAGS} isMulti closeMenuOnSelect={false}/>
                                </FormControl>
                            </Col>
                            <Col>
                                <FormControl mt={4}>
                                    <FormLabel>Attention To</FormLabel>
                                    <Select options={EMPLOYEES} />
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