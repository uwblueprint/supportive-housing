import React, { RefObject, useState, useContext } from "react";
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
import { Resident, ResidentStatus } from "../../../types/ResidentTypes";
import EditResident from "../../forms/EditResident";
import ResidentAPIClient from "../../../APIClients/ResidentAPIClient";
import AuthContext from "../../../contexts/AuthContext";
import CreateToast from "../../common/Toasts";
import ConfirmationModal from "../../common/ConfirmationModal";
import {
  convertToDate,
  getFormattedDateAndTime,
} from "../../../helper/dateHelpers";
import { SelectLabel } from "../../../types/SharedTypes";
import { UserRole } from "../../../types/UserTypes";

type Props = {
  buildingOptions: SelectLabel[];
  residents: Resident[];
  tableRef: RefObject<HTMLDivElement>;
  userPageNum: number;
  setUserPageNum: React.Dispatch<React.SetStateAction<number>>;
  getRecords: (pageNumber: number) => Promise<void>;
  countResidents: () => Promise<void>;
};

const getStatusColor = (status: string): string => {
  let color = "";

  switch (status) {
    case ResidentStatus.CURRENT:
      color = "green.400";
      break;
    case ResidentStatus.FUTURE:
      color = "teal.400";
      break;
    case ResidentStatus.PAST:
      color = "gray.300";
      break;
    default:
      color = "black";
  }

  return color;
};

const getFormattedDates = (resident: Resident) => {
  const startDateObj = convertToDate(resident.dateJoined);
  const startDate = getFormattedDateAndTime(startDateObj, true);

  let endDate;
  if (resident.dateLeft != null) {
    const endDateObj = convertToDate(resident.dateLeft);
    endDate = getFormattedDateAndTime(endDateObj, true);
  }

  return {
    startDate,
    endDate,
  };
};

const DELETE_CONFIRMATION_HEADER = "Delete Resident";

const deleteConfirmationMessage = (name: string) =>
  `Are you sure you want to delete resident ${name}? This is a permanent action. Residents can only be deleted if there are no log records associated with them.`;

const ResidentDirectoryTable = ({
  buildingOptions,
  residents,
  tableRef,
  userPageNum,
  setUserPageNum,
  getRecords,
  countResidents,
}: Props): React.ReactElement => {
  const { authenticatedUser } = useContext(AuthContext);

  const [editingResident, setEditingResident] = useState<Resident | null>(null);
  const [deletingResident, setDeletingResident] = useState<Resident | null>(
    null,
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [loading, setLoading] = useState<boolean>(false);
  const newToast = CreateToast();

  const handleEditClick = (resident: Resident) => {
    setEditingResident(resident);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (resident: Resident) => {
    setDeletingResident(resident);
    setIsDeleteModalOpen(true);
  };

  const deleteResident = async (itemId: number) => {
    setLoading(true);
    const statusCode = await ResidentAPIClient.deleteResident(itemId);
    if (statusCode === 400) {
      newToast(
        "Error deleting resident",
        "Resident has log records attached.",
        "error",
      );
    } else if (statusCode === 500) {
      newToast(
        "Error deleting resident",
        "Unable to delete resident.",
        "error",
      );
    } else {
      newToast("Resident deleted", "Successfully deleted resident.", "success");
      const newUserPageNum =
        residents.length === 1 ? userPageNum - 1 : userPageNum;
      countResidents();
      getRecords(newUserPageNum);
      setUserPageNum(newUserPageNum);
      setIsDeleteModalOpen(false);
    }
    setLoading(false);
  };

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
              <Th>Resident</Th>
              <Th textAlign="center">Status</Th>
              <Th>Building</Th>
              <Th>Residency Start Date</Th>
              <Th>Residency End Date</Th>
              <Th> </Th>
            </Tr>
          </Thead>
          <Tbody>
            {residents.map((resident) => {
              const { startDate, endDate } = getFormattedDates(resident);
              return (
                <Tr key={resident.id} style={{ verticalAlign: "middle" }}>
                  <Td width="10%">{resident.residentId}</Td>
                  <Td
                    width="25%"
                    textStyle="user-status-label"
                    textAlign="center"
                  >
                    <Box
                      backgroundColor={getStatusColor(resident.status)}
                      borderRadius="40px"
                      padding="6px 0px"
                      marginX="20%"
                    >
                      {resident.status}
                    </Box>
                  </Td>
                  <Td width="20%">{resident.building.name}</Td>
                  <Td width="20%">{startDate.date}</Td>
                  <Td width="15%">{endDate ? endDate.date : ""}</Td>
                  <Td width="5%">
                    {authenticatedUser?.role === UserRole.ADMIN && (
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
            buildingOptions={buildingOptions}
            resident={editingResident}
            isOpen={isEditModalOpen}
            userPageNum={userPageNum}
            toggleClose={() => setIsEditModalOpen(false)}
            getRecords={getRecords}
          />
        )}
        {deletingResident && (
          <ConfirmationModal
            header={DELETE_CONFIRMATION_HEADER}
            message={deleteConfirmationMessage(deletingResident.residentId)}
            isOpen={isDeleteModalOpen}
            loading={loading}
            action={() => deleteResident(deletingResident.id)}
            toggleClose={() => setIsDeleteModalOpen(false)}
          />
        )}
      </TableContainer>
    </Box>
  );
};

export default ResidentDirectoryTable;
