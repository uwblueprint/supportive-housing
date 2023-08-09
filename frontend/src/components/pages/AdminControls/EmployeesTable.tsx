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
import ConfirmationModal from "../../common/ConfirmationModal";
import CreateToast from "../../common/Toasts";
import UserAPIClient from "../../../APIClients/UserAPIClient";

type Props = {
  users: User[];
  tableRef: RefObject<HTMLDivElement>;
};

const ACTIVATE_CONFIRMATION_HEADER = "Activate Employee";
const ACTIVATE_CONFIRMATION_MESSAGE =
  "Are you sure you want to activate this employee?";

const DEACTIVATE_CONFIRMATION_HEADER = "Deactivate Employee";
const DEACTIVATE_CONFIRMATION_MESSAGE =
  "Are you sure you want to deactivate this employee?";

const DELETE_CONFIRMATION_HEADER = "Delete Employee";
const DELETE_CONFIRMATION_MESSAGE =
  "Are you sure you want to delete this employee? Deleting an employee will permanently remove it from your system.";

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
  const [activatingEmployee, setActivatingEmployee] = useState<User | null>(
    null,
  );
  const [deactivatingEmployee, setDeactivatingEmployee] = useState<User | null>(
    null,
  );
  const [deletingEmployee, setDeletingEmployee] = useState<User | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isActivateModalOpen, setIsActivateModalOpen] = useState(false);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const newToast = CreateToast();

  const handleEditClick = (employee: User) => {
    setEditingEmployee(employee);
    setIsEditModalOpen(true);
  };

  const handleActivateClick = (employee: User) => {
    setActivatingEmployee(employee);
    setIsActivateModalOpen(true);
  };

  const handleDeactivateClick = (employee: User) => {
    setDeactivatingEmployee(employee);
    setIsDeactivateModalOpen(true);
  };

  const handleDeleteClick = (employee: User) => {
    setDeletingEmployee(employee);
    setIsDeleteModalOpen(true);
  };

  const activateEmployee = async (employeeId: number) => {
    const statusCode = await UserAPIClient.updateUserStatus(
      employeeId,
      UserStatus.ACTIVE,
    );
    if (statusCode === 200) {
      newToast(
        "Employee activated",
        "Employee has been successfully activated",
        "success",
      );
      setIsActivateModalOpen(false);
    } else {
      newToast(
        "Error activating employee",
        "Employee was unable to be activated",
        "error",
      );
    }
  };

  const deactivateEmployee = async (employeeId: number) => {
    const statusCode = await UserAPIClient.updateUserStatus(
      employeeId,
      UserStatus.DEACTIVATED,
    );
    if (statusCode === 200) {
      newToast(
        "Employee deactivated",
        "Employee has been successfully deactivated",
        "success",
      );
      setIsDeactivateModalOpen(false);
    } else {
      newToast(
        "Error deactivating employee",
        "Employee was unable to be deactivated",
        "error",
      );
    }
  };

  const deleteEmployee = async (employeeId: number) => {
    const statusCode = await UserAPIClient.deleteUser(employeeId);
    if (statusCode === 204) {
      newToast(
        "Employee deleted",
        "Employee has been successfully deleted",
        "success",
      );
      setIsDeleteModalOpen(false);
    } else {
      newToast(
        "Error deleting employee",
        "Employee was unable to be deleted",
        "error",
      );
    }
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
                        {user.userStatus === UserStatus.ACTIVE && (
                          <MenuItem onClick={() => handleDeactivateClick(user)}>
                            Deactivate Employee
                          </MenuItem>
                        )}
                        {user.userStatus === UserStatus.DEACTIVATED && (
                          <MenuItem onClick={() => handleActivateClick(user)}>
                            Activate Employee
                          </MenuItem>
                        )}
                        {user.userStatus === UserStatus.INVITED && (
                          <MenuItem onClick={() => handleDeleteClick(user)}>
                            Delete Employee
                          </MenuItem>
                        )}
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
        {activatingEmployee && (
          <ConfirmationModal
            header={ACTIVATE_CONFIRMATION_HEADER}
            message={ACTIVATE_CONFIRMATION_MESSAGE}
            isOpen={isActivateModalOpen}
            action={() => activateEmployee(activatingEmployee.id)}
            toggleClose={() => setIsActivateModalOpen(false)}
          />
        )}
        {deactivatingEmployee && (
          <ConfirmationModal
            header={DEACTIVATE_CONFIRMATION_HEADER}
            message={DEACTIVATE_CONFIRMATION_MESSAGE}
            isOpen={isDeactivateModalOpen}
            action={() => deactivateEmployee(deactivatingEmployee.id)}
            toggleClose={() => setIsDeactivateModalOpen(false)}
          />
        )}
        {deletingEmployee && (
          <ConfirmationModal
            header={DELETE_CONFIRMATION_HEADER}
            message={DELETE_CONFIRMATION_MESSAGE}
            isOpen={isDeleteModalOpen}
            action={() => deleteEmployee(deletingEmployee.id)}
            toggleClose={() => setIsDeleteModalOpen(false)}
          />
        )}
      </TableContainer>
    </Box>
  );
};

export default EmployeesTable;
