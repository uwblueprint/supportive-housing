import React from "react";
import { Icon, IconButton } from "@chakra-ui/react";
import { AiFillPrinter } from "react-icons/ai";

const PrintCSVButton = (): React.ReactElement => {
  return (
    <IconButton
      aria-label="Print CSV"
      className="ghost-button"
      icon={<Icon boxSize="32px" as={AiFillPrinter} />}
      variant="ghost"
    />
  );
};

export default PrintCSVButton;
