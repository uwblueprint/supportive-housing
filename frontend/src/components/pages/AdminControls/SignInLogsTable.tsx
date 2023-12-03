import React, { RefObject } from "react";
import {
  Box,
  Table,
  TableContainer,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { User } from "../../../types/UserTypes";

type Props = {
  tableRef: RefObject<HTMLDivElement>;
};

const SignInLogsTable = ({
  tableRef,
}: Props): React.ReactElement => {
  
  return (
    <Box>
      <TableContainer
        marginTop="12px"
        height="70vh"
        overflowY="unset"
        ref={tableRef}
      >
        <Table variant="showTable" verticalAlign="middle">
          <Thead>
            <Tr>
              <Th>Employee Name</Th>
              <Th> </Th>
              <Th>Date</Th>
              <Th> </Th>
              <Th> </Th>
              <Th>Time</Th>
            </Tr>
          </Thead>

          
        </Table>
      </TableContainer>
    </Box>
  );
};

export default SignInLogsTable;
