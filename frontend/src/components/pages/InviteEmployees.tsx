import React from "react";
import { Button, useDisclosure } from "@chakra-ui/react";

import InviteEmployeesModal from "../forms/InviteEmployeesModal";

/* this page is used to test the Invite Employees modal,
   will be removed later
*/
const InviteEmployees = (): React.ReactElement => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div>
      <Button size="lg" variant="solid" colorScheme="pink" onClick={onOpen}>
        Test Invite Employee Form Modal
      </Button>
      <InviteEmployeesModal isOpen={isOpen} onClose={onClose} />
    </div>
  );
};

export default InviteEmployees;
