import React, { RefObject, useState, useContext, useEffect } from "react";
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
import { Resident } from "../../../types/ResidentTypes";
import EditResident from "../../forms/EditResident";
import ResidentAPIClient from "../../../APIClients/ResidentAPIClient";
import getFormattedDateAndTime from "../../../utils/DateUtils";
import AuthContext from "../../../contexts/AuthContext";
import CreateToast from "../../common/Toasts";
import ConfirmationModal from "../../common/ConfirmationModal";

type Props = {
  residents: Resident[];
  tableRef: RefObject<HTMLDivElement>;
};

const getFormattedDatesAndStatus = (resident: Resident) => {
  const startDateObj = new Date(resident.dateJoined);
  const startDate = getFormattedDateAndTime(startDateObj, true);

  let endDate;
  if (resident.dateLeft != null) {
    const endDateObj = new Date(resident.dateLeft);
    endDate = getFormattedDateAndTime(endDateObj, true);
  }
  const status =
    resident.dateJoined !== null && resident.dateLeft !== null
      ? "Past"
      : "Current";
  return {
    startDate,
    endDate,
    status,
  };
};

const DELETE_CONFIRMATION_MESSAGE =
  "This is a permanent action. Residents can only be deleted if there are no log records associated with them.";

const ResidentDirectoryTable = ({
  residents,
  tableRef,
}: Props): React.ReactElement => {
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
  const [showAlert, setShowAlert] = useState(false);
  const newToast = CreateToast();

  // Delete confirmation state
  const [editingResident, setEditingResident] = useState<Resident | null>(null);
  const [deletingResident, setDeletingResident] = useState<Resident | null>(
    null,
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  // Handle delete confirmation toggle

  const handleEditClick = (resident: Resident) => {
    setEditingResident(resident);
    setIsEditModalOpen(true);
  };

  const handleEditClose = () => {
    setIsEditModalOpen(false);
  };

  const handleDeleteClick = (resident: Resident) => {
    setDeletingResident(resident);
    setIsDeleteModalOpen(true);
  };

  const deleteResident = async (itemId: number) => {
    const statusCode = await ResidentAPIClient.deleteResident(itemId);
    if (statusCode === 400) {
      newToast(
        "Error Deleting Resident",
        "Resident has log records attached.",
        "error",
      );
    } else if (statusCode === 500) {
      newToast("Error Deleting Resident", "Server error.", "error");
    } else {
      newToast(
        "Deleted Resident",
        "Resident has been deleted successfully.",
        "success",
      );
      setIsDeleteModalOpen(false);
    }
    setShowAlert(true);
  };

  useEffect(() => {
    if (showAlert) {
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }
  }, [showAlert]);

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
              <Th>Resident</Th>
              <Th>Status</Th>
              <Th>Building</Th>
              <Th>Residency Start Date</Th>
              <Th>Residency End Date</Th>
              <Th> </Th>
            </Tr>
          </Thead>
          <Tbody>
            {residents.map((resident) => {
              const { startDate, endDate, status } = getFormattedDatesAndStatus(
                resident,
              );
              // TODO: Remove non-null assertion from residentId
              return (
                <Tr key={resident.id} style={{ verticalAlign: "middle" }}>
                  <Td width="20%">{resident.residentId!}</Td>
                  <Td width="15%">{status}</Td>
                  <Td width="20%">{resident.building}</Td>
                  <Td width="20%">{startDate.date}</Td>
                  <Td width="15%">{endDate ? endDate.date : ""}</Td>
                  <Td width="5%">
                    {authenticatedUser?.role === "Admin" && (
                      <Menu>
                        <MenuButton
                          as={IconButton}
                          aria-label="Options"
                          icon={<VscKebabVertical />}
                          w="36px"
                          variant="ghost"
                        />
                        <MenuList>
                          <MenuItem onClick={() => handleEditClick(resident)}>
                            Edit Resident
                          </MenuItem>
                          <MenuItem onClick={() => handleDeleteClick(resident)}>
                            Delete Resident
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    )}
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
        {editingResident && (
          <EditResident
            resident={editingResident}
            isOpen={isEditModalOpen}
            toggleClose={handleEditClose}
          />
        )}
        {deletingResident && (
          <ConfirmationModal
            header={`Are you sure you want to delete Resident ${deletingResident.residentId}?`}
            message={DELETE_CONFIRMATION_MESSAGE}
            isOpen={isDeleteModalOpen}
            action={() => deleteResident(deletingResident.id)}
            toggleClose={() => setIsDeleteModalOpen(false)}
          />
        )}
      </TableContainer>
    </Box>
  );
};

export default ResidentDirectoryTable;
