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
  resId: string | undefined;
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
  const RES_ID = resId ? resId.toUpperCase() : "";

  const handleSubmit = async () => {
    deleteAPI(itemId);
    toggleClose();
  };

  const MODAL_HEADER = `This is a permanent action. Are you sure you want to delete Resident ${RES_ID}`;
  const MODAL_TEXT = `Residents can only be deleted if there are no log records associated with them.`;

  return (
    <>
      <Box>
        <Modal isOpen={isOpen} onClose={toggleClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
            {MODAL_HEADER}
            </ModalHeader>
            <ModalBody>
              <Box marginBottom="12px">
                <Text>
                  {MODAL_TEXT}
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