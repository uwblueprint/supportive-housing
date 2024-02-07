import React, { RefObject, useState, useContext, useEffect } from "react";
import {
  Box,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  ScaleFade,
  Alert,
  AlertDescription,
  AlertIcon,
} from "@chakra-ui/react";
import { VscKebabVertical } from "react-icons/vsc";

import { LogRecord } from "../../../types/LogRecordTypes";

import AuthContext from "../../../contexts/AuthContext";

import EditLog from "../../forms/EditLog";
import ViewLog from "../../forms/ViewLog";
import LogRecordAPIClient from "../../../APIClients/LogRecordAPIClient";
import ResidentAPIClient from "../../../APIClients/ResidentAPIClient";
import TagAPIClient from "../../../APIClients/TagAPIClient";
import UserAPIClient from "../../../APIClients/UserAPIClient";
import BuildingAPIClient from "../../../APIClients/BuildingAPIClient";
import ConfirmationModal from "../../common/ConfirmationModal";
import { SelectLabel } from "../../../types/SharedTypes";
import { UserRole } from "../../../types/UserTypes";
import CreateToast from "../../common/Toasts";
import { getFormattedDateAndTime } from "../../../helper/dateHelpers";

type Props = {
  logRecords: LogRecord[];
  tableRef: RefObject<HTMLDivElement>;
  userPageNum: number;
  getRecords: (pageNumber: number) => Promise<void>;
  countRecords: () => Promise<void>;
  setUserPageNum: React.Dispatch<React.SetStateAction<number>>;
};

const DELETE_CONFIRMATION_HEADER = "Delete Log Record";
const DELETE_CONFIRMATION_MESSAGE =
  "Are you sure you want to delete this log record? Deleting a log record will permanently remove it from the system.";

const formatNote = (note: string) => {
  const NOTE_LIMIT = 150;
  if (note.length > NOTE_LIMIT) {
    return note.substring(0, NOTE_LIMIT).concat("...");
  }
  return note;
};

const formatList = (strArr: string[]) => {
  const strLength = strArr?.length;
  if (strLength === 1) {
    return strArr[0];
  }
  if (strLength === 2) {
    return strArr?.join(", ");
  }
  if (strLength > 2) {
    return `${strArr?.slice(0, 2).join(", ")}, ...`;
  }
  return "";
};

const LogRecordsTable = ({
  logRecords,
  tableRef,
  userPageNum,
  getRecords,
  countRecords,
  setUserPageNum,
}: Props): React.ReactElement => {
  const { authenticatedUser } = useContext(AuthContext);

  const [buildingOptions, setBuildingOptions] = useState<SelectLabel[]>([]);

  const [viewingLogRecord, setViewingLogRecord] = useState<LogRecord | null>(null);
  const [editingLogRecord, setEditingLogRecord] = useState<LogRecord | null>(null);
  const [deletingLogRecord, setDeletingLogRecord] = useState<LogRecord | null>(null);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Dropdown option states
  const [employeeOptions, setEmployeeOptions] = useState<SelectLabel[]>([]);
  const [residentOptions, setResidentOptions] = useState<SelectLabel[]>([]);
  const [tagOptions, setTagOptions] = useState<SelectLabel[]>([]);

  const [loading, setLoading] = useState<boolean>(false)
  const newToast = CreateToast();

  const handleViewClick = (logRecord: LogRecord) => {
    setViewingLogRecord(logRecord);
    setIsViewModalOpen(true);
  };

  const handleEditClick = (logRecord: LogRecord) => {
    setEditingLogRecord(logRecord);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (logRecord: LogRecord) => {
    setDeletingLogRecord(logRecord);
    setIsDeleteModalOpen(true);
  };

  // fetch resident + employee + tag data for log creation
  const getLogEntryOptions = async () => {
    const residentsData = await ResidentAPIClient.getResidents({
      returnAll: true,
    });

    if (residentsData && residentsData.residents.length !== 0) {
      // TODO: Remove the type assertions here
      const residentLabels: SelectLabel[] = residentsData.residents.map(
        (r) => ({
          label: r.residentId,
          value: r.id,
        }),
      );
      setResidentOptions(residentLabels);
    }

    const buildingsData = await BuildingAPIClient.getBuildings();

    if (buildingsData && buildingsData.buildings.length !== 0) {
      const buildingLabels: SelectLabel[] = buildingsData.buildings.map(
        (building) => ({ label: building.name, value: building.id }),
      );
      setBuildingOptions(buildingLabels);
    }

    const usersData = await UserAPIClient.getUsers({ returnAll: true });
    if (usersData && usersData.users.length !== 0) {
      const userLabels: SelectLabel[] = usersData.users
        .filter((user) => user.userStatus === "Active")
        .map((user) => ({
          label: `${user.firstName} ${user.lastName}`,
          value: user.id,
        }));
      setEmployeeOptions(userLabels);
    }

    const tagsData = await TagAPIClient.getTags({ returnAll: true });
    if (tagsData && tagsData.tags.length !== 0) {
      const tagLabels: SelectLabel[] = tagsData.tags.map((tag) => ({
        label: tag.name,
        value: tag.tagId,
      }));
      setTagOptions(tagLabels);
    }
  };

  const deleteLogRecord = async (itemId: number) => {
    setLoading(true)

    const success = await LogRecordAPIClient.deleteLogRecord(itemId);
    if (!success) {
      newToast("Error deleting log record", "Unable to delete log record.", "error")
      setLoading(false)
      return;
    }
    newToast("Log record deleted", "Successfully deleted log record.", "success")
    const newUserPageNum =
      logRecords.length === 1 ? userPageNum - 1 : userPageNum;
    countRecords();
    setUserPageNum(newUserPageNum);
    getRecords(newUserPageNum);
    setIsDeleteModalOpen(false)
    setLoading(false)
  };

  useEffect(() => {
    getLogEntryOptions();
  }, []);

  return (
    <>
      <Box>
        <TableContainer
          marginTop="12px"
          height="70vh"
          overflowY="unset"
          overflowWrap="break-word"
          ref={tableRef}
        >
          <Table variant="showTable" verticalAlign="middle">
            <Thead>
              <Tr>
                <Th>Date</Th>
                <Th>Time</Th>
                <Th>Residents</Th>
                <Th>Note</Th>
                <Th>Employee</Th>
                <Th>Attn To</Th>
                <Th>Tags</Th>
                <Th> </Th>
              </Tr>
            </Thead>

            <Tbody>
              {logRecords.map((record) => {
                const dateObj = new Date(record.datetime);

                const { date, time } = getFormattedDateAndTime(dateObj);

                return (
                  <>
                    <Tr key={record.logId} style={{ verticalAlign: "middle" }}>
                      <Td width="5%">{date}</Td>
                      <Td width="5%">{time}</Td>
                      <Td whiteSpace="normal" width="5%">
                        {formatList(record.residents)}
                      </Td>
                      <Td whiteSpace="normal" width="70%">
                        {formatNote(record.note)}
                      </Td>
                      <Td width="2.5%">{`${record.employee.firstName}`}</Td>
                      <Td width="2.5%">
                        {record.attnTo ? `${record.attnTo.firstName}` : ""}
                      </Td>
                      <Td width="5%" wordBreak="break-all">
                        {formatList(record.tags)}
                      </Td>
                      <Td width="5%">
                        {authenticatedUser?.role === UserRole.ADMIN ||
                        authenticatedUser?.id === record.employee.id ? (
                          <Menu>
                            <MenuButton
                              as={IconButton}
                              aria-label="Options"
                              icon={<VscKebabVertical />}
                              w="36px"
                              variant="ghost"
                            />
                            <MenuList>
                              <MenuItem
                                onClick={() => handleViewClick(record)}
                              >
                                View Log Record
                              </MenuItem>
                              <MenuItem
                                onClick={() => handleEditClick(record)}
                              >
                                Edit Log Record
                              </MenuItem>
                              <MenuItem
                                onClick={() => handleDeleteClick(record)}
                              >
                                Delete Log Record
                              </MenuItem>
                            </MenuList>
                          </Menu>
                        ) : (
                          <IconButton
                            aria-label="Options"
                            icon={<VscKebabVertical />}
                            w="36px"
                            variant="ghost"
                            onClick={() => handleViewClick(record)}
                          />
                        )}
                      </Td>
                    </Tr>
                  </>
                );
              })}
            </Tbody>
          </Table>
          {
            viewingLogRecord && (
              <ViewLog
                logRecord={viewingLogRecord}
                isOpen={isViewModalOpen}
                toggleClose={() => setIsViewModalOpen(false)}
                toggleEdit={() => {
                  setIsViewModalOpen(false);
                  handleEditClick(viewingLogRecord)
                }}
                residentOptions={residentOptions}
                tagOptions={tagOptions}
                allowEdit={
                  authenticatedUser?.role === "Admin" ||
                  authenticatedUser?.id === viewingLogRecord.employee.id
                }
              />
            )
          }
          {
            editingLogRecord && (
              <EditLog
                logRecord={editingLogRecord}
                userPageNum={userPageNum}
                isOpen={isEditModalOpen}
                toggleClose={() => setIsEditModalOpen(false)}
                employeeOptions={employeeOptions}
                residentOptions={residentOptions}
                tagOptions={tagOptions}
                getRecords={getRecords}
                countRecords={countRecords}
                buildingOptions={buildingOptions}
              />
            )
          }
          {
            deletingLogRecord && (
              <ConfirmationModal
                header={DELETE_CONFIRMATION_HEADER}
                message={DELETE_CONFIRMATION_MESSAGE}
                isOpen={isDeleteModalOpen}
                loading={loading}
                toggleClose={() => setIsDeleteModalOpen(false)}
                action={() => deleteLogRecord(deletingLogRecord.logId)}
              />
            )
          }
        </TableContainer>
      </Box>
    </>
  );
};

export default LogRecordsTable;
