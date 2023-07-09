import React, { RefObject } from "react";
import {
  Box,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { User } from "../../../types/UserTypes";

type Props = {
  users: User[];
  tableRef: RefObject<HTMLDivElement>;
};

const EmployeesTable = ({ users, tableRef }: Props): React.ReactElement => {
  return (
    <Box>
      <TableContainer
        marginTop="12px"
        height="70vh"
        overflowY="scroll"
        ref={tableRef}
      >
        <Table
          variant="logRecordsTable"
          minHeight="400px"
          verticalAlign="middle"
        >
          <Thead>
            <Tr>
              <Th>Employee Name</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>

          <Tbody>
            {users.map((user) => {
              return (
                <Tr key={user.id} style={{ verticalAlign: "middle" }}>
                  <Td width="5%">{`${user.firstName} ${user.lastName}`}</Td>
                  <Td width="5%">{user.userStatus}</Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default EmployeesTable;
