import React, { useState } from "react";
import Select, { ActionMeta, MultiValue, SingleValue } from 'react-select'
import {
    Button,
    Checkbox,
    FormControl,
    FormLabel,
    Grid,
    GridItem,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Textarea,
} from "@chakra-ui/react";

import { SingleDatepicker } from "chakra-dayzed-datepicker";

import { Col, Row } from "react-bootstrap";

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
    const [employee, setEmployee] = useState("Huseyin"); // currently, the select for employees is locked and should default to current user. Need to check if admins/regular staff are allowed to change this
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState("");
    const [building, setBuilding] = useState("");
    const [resident, setResident] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [attnTo, setAttnTo] = useState("");
    const [notes, setNotes] = useState("");

    // error states for non-nullable inputs
    const [employeeError, setEmployeeError] = useState(false);
    const [dateError, setDateError] = useState(false);
    const [timeError, setTimeError] = useState(false);
    const [buildingError, setBuildingError] = useState(false);
    const [residentError, setResidentError] = useState(false);
    const [notesError, setNotesError] = useState(false);


    const handleDateChange = (newDate: Date) => {
        setDate(newDate);
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTime(e.target.value);
        const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/; // Regex to match time format HH:mm

        // Check to see if the input is valid, prevents an application crash
        if (timeRegex.test(e.target.value)) {
            const [hour, minute] = e.target.value.split(":");
            const updatedDate = new Date(date); // update the time values of the current date state
            updatedDate.setHours(parseInt(hour, 10));
            updatedDate.setMinutes(parseInt(minute, 10));
            setDate(updatedDate);
        }
    };

    const handleBuildingChange = (selectedOption: SingleValue<{ label: string; value: string; }>) => {
        if (selectedOption !== null) {
            setBuilding(selectedOption.value);
        }
    };

    const handleResidentChange = (selectedOption: SingleValue<{ label: string; value: string; }>) => {
        if (selectedOption !== null) {
            setResident(selectedOption.value);
        }
    };

    const handleTagsChange = (selectedTags: MultiValue<{ label: string; value: string; }>) => {
        const newTagsList = selectedTags.map((tag) => tag.value);
        setTags(newTagsList);
    };

    const handleAttnToChange = (selectedOption: SingleValue<{ label: string; value: string; }>) => {
        if (selectedOption !== null) {
            setAttnTo(selectedOption.value);
        }
    };

    const handleNotesChange = (e: { target: { value: unknown } }) => {
        const inputValue: string = e.target.value as string;
        setNotes(inputValue);
    };

    const [isCreateOpen, setCreateOpen] = React.useState(false);
    const handleCreateOpen = () => {
        setCreateOpen(true);
    };

    const handleCreateClose = () => {
        setCreateOpen(false);
    };

    const handleSubmit = () => {
        // Do something with the form data
        console.log({
            employee,
            date,
            building,
            resident,
            tags,
            attnTo,
            notes,
        });
        // Clear the form fields after submission
        setEmployee("");
        setDate(new Date());
        setBuilding("");
        setResident("");
        setTags([]);
        setAttnTo("");
        setNotes("");
        setCreateOpen(false);
    };

    return (
        <div>
            <Button
                onClick={handleCreateOpen}
            >
                Log
            </Button>
            <Modal isOpen={isCreateOpen} onClose={handleCreateClose} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>New Log Entry Details</ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col>
                                <FormControl isRequired isInvalid={employeeError}>
                                    <FormLabel>Employee</FormLabel>
                                    <Select
                                        options={EMPLOYEES}
                                        isDisabled
                                        defaultValue={{ label: employee, value: employee }} // needs to be the current user
                                    />
                                </FormControl>
                            </Col>
                            <Col>
                                <Grid templateColumns="repeat(2, 1fr)" gap="8px">
                                    <GridItem>
                                        <FormControl isRequired>
                                            <FormLabel>Date</FormLabel>
                                            <SingleDatepicker
                                                name="date-input"
                                                date={date}
                                                onDateChange={handleDateChange}
                                            />
                                        </FormControl>
                                    </GridItem>
                                    <GridItem>
                                        <FormControl isRequired>
                                            <FormLabel>Time</FormLabel>
                                            <Input
                                                size="md"
                                                type="time"
                                                defaultValue={date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                                                onChange={handleTimeChange}
                                            />
                                        </FormControl>
                                    </GridItem>
                                </Grid>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <FormControl isRequired mt={4}>
                                    <FormLabel>Building</FormLabel>
                                    <Select
                                        options={BUILDINGS}
                                        placeholder="Building No."
                                        onChange={handleBuildingChange}
                                    />
                                </FormControl>
                            </Col>
                            <Col>
                                <FormControl isRequired mt={4}>
                                    <FormLabel>Resident</FormLabel>
                                    <Select
                                        options={RESIDENTS}
                                        placeholder="Select Resident"
                                        onChange={handleResidentChange}
                                    />
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
                                        onChange={handleTagsChange}
                                    />
                                </FormControl>
                            </Col>
                            <Col>
                                <FormControl mt={4}>
                                    <FormLabel>Attention To</FormLabel>
                                    <Select
                                        options={EMPLOYEES}
                                        placeholder="Select Employee"
                                        onChange={handleAttnToChange}
                                    />
                                </FormControl>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <FormLabel mt={4}>Notes</FormLabel>
                                <Textarea
                                    value={notes}
                                    onChange={handleNotesChange}
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
                                <Button onClick={handleSubmit} color="#285E61" type="submit">
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