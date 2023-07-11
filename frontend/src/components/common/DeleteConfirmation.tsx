import React, { useEffect, useState } from "react";
import {
    Box,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    ScaleFade,
    Alert,
    AlertDescription,
    AlertIcon,
    Text,
} from "@chakra-ui/react";

type Props = {
    itemName: string;
    itemId: number;
    isOpen: boolean;
    onClose: () => void;
    deleteAPI: (itemId: number) => void;
};

const DeleteConfirmation = ({ itemName, itemId, isOpen, onClose, deleteAPI }: Props): React.ReactElement => {
    const [showAlert, setShowAlert] = useState(false);

    const ITEM_NAME = itemName.toLowerCase();

    const handleSubmit = async () => {
        deleteAPI(itemId);
    };

    useEffect(() => {
        if (showAlert) {
            setTimeout(() => {
                setShowAlert(false);
            }, 3000);
        }
    }, [showAlert]);

    return (
        <>
            <Box>
                <Modal isOpen={isOpen} onClose={onClose} size="xl">
                    <ModalOverlay bg="blackAlpha.300" />
                    <ModalContent>
                        <ModalHeader>Delete {ITEM_NAME.charAt(0).toUpperCase() + ITEM_NAME.slice(1)}</ModalHeader>
                        <ModalBody>
                            <Box marginBottom="12px">
                                <Text>Are you sure you want to delete this {ITEM_NAME}? Deleting a {ITEM_NAME} will permanently remove it from your system.</Text>
                            </Box>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                onClick={onClose}
                                variant="tertiary"
                                marginRight="8px"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                variant="primary"
                                type="submit"
                            >
                                Yes, delete
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
                        <AlertDescription>No Log Records Found.</AlertDescription>
                    </Alert>
                </ScaleFade>
            </Box>
        </>
    );
};

export default DeleteConfirmation;