import React from "react";
import {
  Button
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

const CreateTag = (): React.ReactElement => {
  
  const handleOpen = () => {
    /* TODO */
  }

  return (
    <>
      <Button leftIcon={<AddIcon />} variant="primary" onClick={handleOpen}>
        Add Tag
      </Button>
      {/* TODO: modal */}
    </>
  );
};

export default CreateTag;
