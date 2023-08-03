import React, { RefObject, useState } from "react";
import {
  Box,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { VscKebabVertical } from "react-icons/vsc";
import { User, UserRole, UserStatus } from "../../../types/UserTypes";
import EditEmployee from "../../forms/EditEmployee";

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
  const [editingEmployee, setEditingEmployee] = useState<User | null>(null);
  const [deletingEmployee, setDeletingEmployee] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleEditClick = (employee: User) => {
    setEditingEmployee(employee);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (employee: User) => {
    setDeletingEmployee(employee);
    setIsDeleteModalOpen(true);
  };

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
              <Th> </Th>
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
                  <Td width="1%">
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        aria-label="Options"
                        icon={<VscKebabVertical />}
                        w="36px"
                        variant="ghost"
                      />
                      <MenuList>
                        <MenuItem onClick={() => handleEditClick(user)}>
                          Edit Employee
                        </MenuItem>
                        <MenuItem onClick={() => handleDeleteClick(user)}>
                          Deactivate Employee
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
        {editingEmployee && (
          <EditEmployee
            employee={editingEmployee}
            isOpen={isEditModalOpen}
            toggleClose={() => setIsEditModalOpen(false)}
          />
        )}
        {/* {deletingResident && (
          <DeleteResidentConfirmation
            itemName="resident"
            itemId={deletingResident.id}
            resId={deletingResident.residentId}
            isOpen={isDeleteModalOpen}
            toggleClose={() => handleDeleteClick(deletingResident)}
            deleteAPI={deleteResident}
          />
        )} */}
      </TableContainer>
    </Box>
  );
};

export default EmployeesTable;
