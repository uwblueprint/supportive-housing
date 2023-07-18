import React, { useState } from "react";
import {
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Text,
} from "@chakra-ui/react";

type Props = {
  itemName: string;
  itemId: number;
  isOpen: boolean;
  toggleClose: () => void;
  deleteAPI: (itemId: number) => void;
};

const DeleteConfirmation = ({
  itemName,
  itemId,
  isOpen,
  toggleClose,
  deleteAPI,
}: Props): React.ReactElement => {
  const ITEM_NAME = itemName.toLowerCase();

  const handleSubmit = async () => {
    deleteAPI(itemId);
    toggleClose();
  };

  return (
    <>
      <Box>
        <Modal isOpen={isOpen} onClose={toggleClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              Delete {ITEM_NAME.charAt(0).toUpperCase() + ITEM_NAME.slice(1)}
            </ModalHeader>
            <ModalBody>
              <Box marginBottom="12px">
                <Text>
                  Are you sure you want to delete this {ITEM_NAME}? Deleting a{" "}
                  {ITEM_NAME} will permanently remove it from your system.
                </Text>
              </Box>
            </ModalBody>
            <ModalFooter>
              <Button
                onClick={toggleClose}
                variant="tertiary"
                marginRight="8px"
              >
                Cancel
              </Button>
              <Button onClick={handleSubmit} variant="primary" type="submit">
                Yes, delete
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </>
  );
};

export default DeleteConfirmation;
