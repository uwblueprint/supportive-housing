import React, { useState } from "react";
import {
  Box,
  Button,
  Divider,
  FormErrorMessage,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { Col, Row } from "react-bootstrap";
import CreateToast from "../common/Toasts";
import TagAPIClient from "../../APIClients/TagAPIClient";
import { isErrorResponse } from "../../helper/error";

type Props = {
  getTags: (pageNumber: number) => Promise<void>;
  setUserPageNum: React.Dispatch<React.SetStateAction<number>>;
  countTags: () => Promise<void>;
};

const CreateTag = ({
  getTags,
  setUserPageNum,
  countTags,
}: Props): React.ReactElement => {
  const [tagName, setTagName] = useState("");
  const [tagNameError, setTagNameError] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const newToast = CreateToast();

  const handleClose = () => {
    setTagName("");
    setTagNameError(false);
    setIsOpen(false);
  };

  const addTag = async () => {
    setLoading(true)
    const res = await TagAPIClient.createTag({
      name: tagName,
    });

    if (isErrorResponse(res)) {
      newToast("Error adding tag", res.errMessage, "error");
    } else if (res) {
      newToast("Tag added", "Successfully added tag.", "success");
      getTags(1);
      countTags();
      setUserPageNum(1);
      handleClose();
    } else {
      newToast("Error adding tag", "Unable to add tag.", "error");
    }
    setLoading(false)
  };

  const handleTagNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (!inputValue || /[a-zA-Z0-9_][a-zA-Z0-9_\s]{0,}$/i.test(inputValue)) {
      setTagName(inputValue);
      setTagNameError(false);
    }
  };

  const handleSubmit = () => {
    if (tagName.length === 0) {
      setTagNameError(true);
      return;
    }

    addTag();
  };

  return (
    <>
      <Button
        leftIcon={<AddIcon />}
        variant="primary"
        onClick={() => setIsOpen(true)}
      >
        Add Tag
      </Button>

      <Box>
        <Modal isOpen={isOpen} onClose={handleClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add Tag</ModalHeader>
            <ModalCloseButton size="lg" />
            <ModalBody>
              <Divider />
              <Row style={{ marginTop: "16px" }}>
                <Col>
                  <FormControl isRequired isInvalid={tagNameError}>
                    <FormLabel>Tag Name</FormLabel>
                    <Input
                      placeholder="Enter tag name"
                      value={tagName}
                      onChange={handleTagNameChange}
                    />
                    <FormErrorMessage>Tag name is required.</FormErrorMessage>
                  </FormControl>
                </Col>
              </Row>
            </ModalBody>
            <ModalFooter>
              {loading &&
                <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                size="md"
                marginRight="10px"
                />
              } 
              <Button onClick={handleSubmit} variant="primary" type="submit">
                Submit
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </>
  );
};

export default CreateTag;
