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
import { User, UserRole, UserStatus } from "../../../types/UserTypes";

type Props = {
  users: User[];
  tableRef: RefObject<HTMLDivElement>;
};

const constructRole = (user: User): string => {
  let role = "";
  role += user.role === UserRole.ADMIN ? "Admin, " : "Non-Admin, ";
  role += user.role === UserRole.RELIEF_STAFF ? "2FA" : "No 2FA";
  return role;
};

const getStatusColor = (user: User): string => {
  let color = "";

  switch (user.userStatus) {
    case UserStatus.ACTIVE:
      color = "green.400";
      break;
    case UserStatus.INVITED:
      color = "teal.400";
      break;
    case UserStatus.DEACTIVATED:
      color = "gray.300";
      break;
    default:
      color = "black";
  }

  return color;
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
        <Table variant="showTable" verticalAlign="middle">
          <Thead>
            <Tr>
              <Th>Employee Name</Th>
              <Th>Email</Th>
              <Th textAlign="center">Role</Th>
              <Th textAlign="center">Status</Th>
            </Tr>
          </Thead>

          <Tbody>
            {users.map((user) => {
              return (
                <Tr key={user.id} style={{ verticalAlign: "middle" }}>
                  <Td width="5%">{`${user.firstName} ${user.lastName}`}</Td>
                  <Td width="5%">{user.email}</Td>
                  <Td width="5%" textAlign="center">
                    {constructRole(user)}
                  </Td>
                  <Td
                    width="5%"
                    textStyle="user-status-label"
                    textAlign="center"
                  >
                    <Box
                      backgroundColor={getStatusColor(user)}
                      borderRadius="40px"
                      padding="6px 0px"
                    >
                      {user.userStatus}
                    </Box>
                  </Td>
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
