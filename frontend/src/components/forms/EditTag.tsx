import React, { useEffect, useState } from "react";
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
} from "@chakra-ui/react";
import { Col, Row } from "react-bootstrap";
import CreateToast from "../common/Toasts";
import TagAPIClient from "../../APIClients/TagAPIClient";
import { isErrorResponse } from "../../helper/error";
import { Tag } from "../../types/TagTypes";

type Props = {
  tag: Tag;
  isOpen: boolean;
  userPageNum: number;
  getTags: (pageNumber: number) => Promise<void>;
  toggleClose: () => void;
};

const EditTag = ({
  tag,
  isOpen,
  userPageNum,
  getTags,
  toggleClose,
}: Props): React.ReactElement => {
  const [tagName, setTagName] = useState("");

  const newToast = CreateToast();

  const [tagNameError, setTagNameError] = useState(false);

  const handleClose = () => {
    setTagName(tag.name);
    setTagNameError(false);
    toggleClose();
  };

  const editTag = async () => {
    const res = await TagAPIClient.editTag({
      tagId: tag.tagId,
      name: tagName,
    });

    if (isErrorResponse(res)) {
      newToast("Error updating tag", res.errMessage, "error");
    } else if (res) {
      newToast("Tag updated", "Tag successfully updated.", "success");
      getTags(userPageNum);
      handleClose();
    } else {
      newToast("Error updating tag", "Unable to update tag.", "error");
    }
  };

  const handleTagNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (!inputValue || /[a-zA-Z0-9_][a-zA-Z0-9_\s]{0,}$/i.test(inputValue)) {
      setTagName(inputValue);
      setTagNameError(false);
    }
  };

  const handleSave = () => {
    if (tagName.length === 0) {
      setTagNameError(true);
      return;
    }

    editTag();
  };

  useEffect(() => {
    setTagName(tag.name);
  }, [tag]);

  return (
    <>
      <Box>
        <Modal isOpen={isOpen} onClose={handleClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit Tag</ModalHeader>
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
              <Button onClick={handleSave} variant="primary" type="submit">
                Save
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </>
  );
};

export default EditTag;
