import React, { useEffect, useState } from "react";
import Select, { SingleValue } from "react-select";
import {
    Alert,
    AlertDescription,
    AlertIcon,
    Box,
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalOverlay,
    ModalFooter,
    ScaleFade,
    Divider,
} from "@chakra-ui/react";

import { AddIcon } from "@chakra-ui/icons";
import { SingleDatepicker } from "chakra-dayzed-datepicker";
import { Card, Col, Row } from "react-bootstrap";
import CommonAPIClient from "../../APIClients/CommonAPIClient";

import selectStyle from "../../theme/forms/selectStyles";
import { singleDatePickerStyle } from "../../theme/forms/datePickerStyles";

// TODO: Connect to Buidings table 
const BUILDINGS = [
    { label: "144", value: "144" },
    { label: "362", value: "362" },
    { label: "402", value: "402" },
];

const CreateResident = (): React.ReactElement => {

    const [initials, setInitials] = useState("");
    const [roomNumber, setRoomNumber] = useState("");
    const [moveInDate, setMoveInDate] = useState(new Date());
    const [building, setBuilding] = useState("");

    const [initialsError, setInitialsError] = useState(false);
    const [roomNumberError, setRoomNumberError] = useState(false);
    const [moveInDateError, setMoveInDateError] = useState(false);
    const [buildingError, setBuildingError] = useState(false);

    const [isOpen, setIsOpen] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

    const addResident = async () => {
        await CommonAPIClient.createResident({
            initial: initials.toLowerCase(),
            roomNum: parseInt(roomNumber, 10),
            dateJoined: moveInDate,
            building,
        });
    };

    const handleInitialsChange = (e: { target: { value: unknown } }) => {
        const inputValue: string = e.target.value as string;
        if (/^[a-z]{0,2}$/i.test(inputValue)) {
            setInitials(inputValue.toUpperCase());
            setInitialsError(false);
        } else {
            setInitialsError(true);
        }
    };

    const handleRoomNumberChange = (e: { target: { value: unknown } }) => {
        const inputValue: string = e.target.value as string;
        if (inputValue !== null && /^[0-9]{0,3}$/.test(inputValue)) {
            setRoomNumber(inputValue);
            setRoomNumberError(false);
        } else {
            setRoomNumberError(true);
        }
    };

    const handleMoveInDateChange = (inputValue: Date) => {
        if (inputValue !== null) {
            setMoveInDate(inputValue);
            setMoveInDateError(false);
        } else {
            setMoveInDateError(true);
        }
    };

    const handleBuildingChange = (
        selectedOption: SingleValue<{ label: string; value: string }>,
    ) => {
        if (selectedOption !== null) {
            setBuilding(selectedOption.value);
            setBuildingError(false);
        } else {
            setBuildingError(true);
        }
    };

    const handleOpen = () => {
        setIsOpen(true);

        // Reset the input states
        setInitials("");
        setRoomNumber("");
        setMoveInDate(new Date());
        setBuilding("");

        // Reset the error states
        setInitialsError(false);
        setRoomNumberError(false);
        setMoveInDateError(false);
        setBuildingError(false);

        //  Reset alert state
        setShowAlert(false);
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    const handleSubmit = () => {
        setInitialsError(initials === "");
        setRoomNumberError(roomNumber === "");
        setBuildingError(building === "");

        //  Prevents form submission if any required values are missing
        if (initials === "" || roomNumber === "" || building === "") {
            return;
        }

        addResident();

        setIsOpen(false);
        setShowAlert(true);
    };

    // Timer to remove alert
    useEffect(() => {
        if (showAlert) {
            setTimeout(() => {
                setShowAlert(false);
            }, 3000)
        }
    }, [showAlert]);

    return (
        <>
            <Box textAlign="right">
                <Button
                    onClick={handleOpen}
                    marginBottom="16px"
                    variant="primary"
                >
                    <AddIcon boxSize="16px" marginRight="8px" />
                    Add Resident
                </Button>
            </Box>

            <Box>
                <Modal isOpen={isOpen} onClose={handleClose} size="xl">
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Add Resident</ModalHeader>
                        <ModalCloseButton size="lg" />
                        <ModalBody>
                            <Divider />
                            <Row style={{ marginTop: "16px" }}>
                                <Col>
                                    <FormControl isRequired isInvalid={initialsError}>
                                        <FormLabel>Resident Initials</FormLabel>
                                        <Input
                                            placeholder="AA"
                                            value={initials}
                                            onChange={handleInitialsChange}
                                        />
                                    </FormControl>
                                    <FormErrorMessage>Resident Initials are required and must contain 2 letters.</FormErrorMessage>
                                </Col>
                                <Col>
                                    <FormControl isRequired isInvalid={roomNumberError}>
                                        <FormLabel>Room Number</FormLabel>
                                        <Input
                                            placeholder="123"
                                            value={roomNumber}
                                            onChange={handleRoomNumberChange}
                                            type="number"
                                        />
                                    </FormControl>
                                    <FormErrorMessage>Room Number is required and must only contain numbers.</FormErrorMessage>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: "16px" }}>
                                <Col>
                                    <FormControl isRequired isInvalid={moveInDateError}>
                                        <FormLabel>Move In Date</FormLabel>
                                        <SingleDatepicker
                                            name="date-input"
                                            date={moveInDate}
                                            onDateChange={handleMoveInDateChange}
                                            propsConfigs={singleDatePickerStyle}
                                        />
                                        <FormErrorMessage>Move In Date is required.</FormErrorMessage>
                                    </FormControl>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: "16px", marginBottom: "16px" }}>
                                <Col>
                                    <FormControl isRequired isInvalid={buildingError}>
                                        <FormLabel>Building</FormLabel>
                                        <Select
                                            options={BUILDINGS}
                                            placeholder="Select building"
                                            onChange={handleBuildingChange}
                                            styles={selectStyle}
                                        />
                                        <FormErrorMessage>Building is required.</FormErrorMessage>
                                    </FormControl>
                                </Col>
                            </Row>
                            <Divider />
                        </ModalBody>
                        <ModalFooter>
                            <Button onClick={handleSubmit} variant="primary" type="submit">
                                Save
                            </Button>
                        </ModalFooter>
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
                    <Alert status="success" variant="left-accent" borderRadius="6px">
                        <AlertIcon />
                        <AlertDescription>Resident successfully added.</AlertDescription>
                    </Alert>
                </ScaleFade>
            </Box>
        </>
    );
};

export default CreateResident;