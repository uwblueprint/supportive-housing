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
  resId: string;
  isOpen: boolean;
  toggleClose: () => void;
  deleteAPI: (itemId: number) => void;
};

const DeleteResidentConfirmation = ({
  itemName,
  itemId,
  resId,
  isOpen,
  toggleClose,
  deleteAPI,
}: Props): React.ReactElement => {
  const ITEM_NAME = itemName.toLowerCase();
  const RES_ID = resId.toUpperCase();

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
            {`This is a permanent action.
              Are you sure you want to delete Resident ${RES_ID}`}
            </ModalHeader>
            <ModalBody>
              <Box marginBottom="12px">
                <Text>
                  Residents can only be deleted if there are no log records associated with them.
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

export default DeleteResidentConfirmation;