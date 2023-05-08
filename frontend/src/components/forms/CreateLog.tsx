import React, { useState } from "react";
import Select from 'react-select'
import {
    Button,
    Checkbox,
    FormControl,
    FormLabel,
    Grid,
    GridItem,
    Input,
    InputLeftElement,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Text,
    Textarea,
    useDisclosure,
} from "@chakra-ui/react";

import { SingleDatepicker } from "chakra-dayzed-datepicker";

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
    const [date, setDate] = useState(new Date());
    const [value, setValue] = React.useState("");


    const handleDateChange = (newDate: Date) => {
        setDate(newDate);
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const timeValue: string = e.target.value;
        const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/; // Regex to match time format HH:mm
        
        // Check to see if the input is valid, otherwise a crash will occur
        if (timeRegex.test(timeValue)) {
          const [hour, minute] = timeValue.split(":");
          const updatedDate = new Date(date);
          updatedDate.setHours(parseInt(hour, 10));
          updatedDate.setMinutes(parseInt(minute, 10));
          setDate(updatedDate);
        }
    };

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
                                    <Select options={EMPLOYEES} isDisabled defaultValue={{ label: "Huseyin", value: "Huseyin" }} />
                                </FormControl>
                            </Col>
                            <Col>
                                <FormControl>
                                    <FormLabel>Date and Time</FormLabel>
                                    <Grid templateColumns="repeat(2, 1fr)" gap="8px">
                                        <GridItem>
                                            <SingleDatepicker
                                                name="date-input"
                                                date={date}
                                                onDateChange={handleDateChange}
                                            />
                                        </GridItem>
                                        <GridItem>
                                            <Input
                                                size="md"
                                                type="time"
                                                defaultValue={date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                                                onChange={handleTimeChange}
                                            />
                                        </GridItem>
                                    </Grid>
                                </FormControl>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <FormControl mt={4}>
                                    <FormLabel>Building</FormLabel>
                                    <Select options={BUILDINGS} placeholder="Building No." />
                                </FormControl>
                            </Col>
                            <Col>
                                <FormControl mt={4}>
                                    <FormLabel>Resident</FormLabel>
                                    <Select options={RESIDENTS} placeholder="Select Tags" />
                                </FormControl>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <FormControl mt={4}>
                                    <FormLabel>Tags</FormLabel>
                                    <Select
                                        options={TAGS}
                                        isMulti
                                        closeMenuOnSelect={false}
                                        placeholder="Select Tags"
                                    />
                                </FormControl>
                            </Col>
                            <Col>
                                <FormControl mt={4}>
                                    <FormLabel>Attention To</FormLabel>
                                    <Select options={EMPLOYEES} placeholder="Select Employee" />
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

                        <Checkbox style={{ paddingTop: "1rem" }}>
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
        </div >
    );
};

export default CreateLog;