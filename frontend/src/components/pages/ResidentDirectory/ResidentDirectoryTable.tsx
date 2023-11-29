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
import { BuildingLabel } from "../../../types/BuildingTypes";
import { Resident, ResidentStatus } from "../../../types/ResidentTypes";
import EditResident from "../../forms/EditResident";
import ResidentAPIClient from "../../../APIClients/ResidentAPIClient";
import getFormattedDateAndTime from "../../../utils/DateUtils";
import AuthContext from "../../../contexts/AuthContext";
import CreateToast from "../../common/Toasts";
import ConfirmationModal from "../../common/ConfirmationModal";
import { convertToDate } from "../../../helper/dateHelpers";

type Props = {
  buildingOptions: BuildingLabel[];
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

const getFormattedDatesAndStatus = (resident: Resident) => {
  const startDateObj = convertToDate(resident.dateJoined);
  const startDate = getFormattedDateAndTime(startDateObj, true);

  let endDate;
  let status = ResidentStatus.CURRENT;
  const currentDate = new Date();
  if (resident.dateLeft != null) {
    const endDateObj = convertToDate(resident.dateLeft);
    endDate = getFormattedDateAndTime(endDateObj, true);
    if (endDateObj < currentDate) {
      status = ResidentStatus.PAST;
    }
  }
  if (currentDate < startDateObj) {
    status = ResidentStatus.FUTURE;
  }
  return {
    startDate,
    endDate,
    status,
  };
};

const DELETE_CONFIRMATION_MESSAGE =
  "This is a permanent action. Residents can only be deleted if there are no log records associated with them.";

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
      const newUserPageNum =
        residents.length === 1 ? userPageNum - 1 : userPageNum;
      countResidents();
      getRecords(newUserPageNum);
      setUserPageNum(newUserPageNum);
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
        overflowY="unset"
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
                  <Td width="15%"
                    textStyle="user-status-label"
                    textAlign="center"
                  >
                    <Box
                      backgroundColor={getStatusColor(status)}
                      borderRadius="40px"
                      padding="6px 0px"
                    >
                      {status}
                    </Box>
                  </Td>
                  <Td width="20%">{resident.building.name}</Td>
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
            buildingOptions={buildingOptions}
            resident={editingResident}
            isOpen={isEditModalOpen}
            userPageNum={userPageNum}
            toggleClose={() => handleEditClose()}
            getRecords={getRecords}
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
