import React from "react";
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
  header: string;
  message: string;
  isOpen: boolean;
  toggleClose: () => void;
  action: () => Promise<void>;
};

const ConfirmationModal = ({
  header,
  message,
  isOpen,
  toggleClose,
  action,
}: Props): React.ReactElement => {
  const handleSubmit = async () => {
    await action();
  };

  return (
    <>
      <Box>
        <Modal isOpen={isOpen} onClose={toggleClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{header}</ModalHeader>
            <ModalBody>
              <Box>
                <Text>{message}</Text>
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
                Confirm
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </>
  );
};

export default ConfirmationModal;
