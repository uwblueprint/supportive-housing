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
import getFormattedDateAndTime from "../../../utils/DateUtils";

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
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);

  const [showAlert, setShowAlert] = useState(false);

  const [buildingOptions, setBuildingOptions] = useState<SelectLabel[]>([]);

  // Menu states
  const [deleteOpenMap, setDeleteOpenMap] = useState<{
    [key: number]: boolean;
  }>({});
  const [editOpenMap, setEditOpenMap] = useState<{ [key: number]: boolean }>(
    {},
  );
  const [viewOpenMap, setViewOpenMap] = useState<{ [key: number]: boolean }>(
    {},
  );

  // Dropdown option states
  const [employeeOptions, setEmployeeOptions] = useState<SelectLabel[]>([]);
  const [residentOptions, setResidentOptions] = useState<SelectLabel[]>([]);
  const [tagOptions, setTagOptions] = useState<SelectLabel[]>([]);

  // Handle delete confirmation toggle
  const handleDeleteToggle = (logId: number) => {
    setDeleteOpenMap((prevDeleteOpenMap) => ({
      ...prevDeleteOpenMap,
      [logId]: !prevDeleteOpenMap[logId],
    }));
  };

  // Handle edit form toggle
  const handleEditToggle = (logId: number) => {
    setEditOpenMap((prevEditOpenMap) => ({
      ...prevEditOpenMap,
      [logId]: !prevEditOpenMap[logId],
    }));
  };

  // Handle view form toggle
  const handleViewToggle = (logId: number) => {
    setViewOpenMap((prevViewOpenMap) => ({
      ...prevViewOpenMap,
      [logId]: !prevViewOpenMap[logId],
    }));
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
          label: r.residentId!,
          value: r.id!,
        }),
      );
      setResidentOptions(residentLabels);
    }

    const buildingsData = await BuildingAPIClient.getBuildings();

    if (buildingsData && buildingsData.buildings.length !== 0) {
      const buildingLabels: SelectLabel[] = buildingsData.buildings.map(
        (building) => ({ label: building.name!, value: building.id! }),
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
    try {
      await LogRecordAPIClient.deleteLogRecord(itemId);
    } catch (error) {
      return;
    }
    const newUserPageNum =
      logRecords.length === 1 ? userPageNum - 1 : userPageNum;
    countRecords();
    setShowAlert(true);
    setUserPageNum(newUserPageNum);
    getRecords(newUserPageNum);
    handleDeleteToggle(itemId);
  };

  useEffect(() => {
    if (showAlert) {
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }
  }, [showAlert]);

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
                      <Td width="5%" wordBreak="break-all">{formatList(record.tags)}</Td>
                      <Td width="5%">
                          {
                            (authenticatedUser?.role === "Admin" ||
                            authenticatedUser?.id === record.employee.id) ? (
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
                                    onClick={() => handleViewToggle(record.logId)}
                                  >
                                    View Log Record
                                  </MenuItem>
                                  <MenuItem
                                    onClick={() => handleEditToggle(record.logId)}
                                  >
                                    Edit Log Record
                                  </MenuItem>
                                  <MenuItem
                                    onClick={() => handleDeleteToggle(record.logId)}
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
                              onClick={() => handleViewToggle(record.logId)}
                            />
                          )
                        }
                      </Td>
                    </Tr>

                    <EditLog
                      logRecord={record}
                      userPageNum={userPageNum}
                      isOpen={editOpenMap[record.logId]}
                      toggleClose={() => handleEditToggle(record.logId)}
                      employeeOptions={employeeOptions}
                      residentOptions={residentOptions}
                      tagOptions={tagOptions}
                      getRecords={getRecords}
                      countRecords={countRecords}
                      setUserPageNum={setUserPageNum}
                      buildingOptions={buildingOptions}
                    />

                    <ViewLog
                      logRecord={record}
                      isOpen={viewOpenMap[record.logId]}
                      toggleClose={() => handleViewToggle(record.logId)}
                      toggleEdit={() => handleEditToggle(record.logId)}
                      residentOptions={residentOptions}
                      tagOptions={tagOptions}
                      allowEdit={authenticatedUser?.role === "Admin" || authenticatedUser?.id === record.employee.id}
                    />

                    <ConfirmationModal
                      header={DELETE_CONFIRMATION_HEADER}
                      message={DELETE_CONFIRMATION_MESSAGE}
                      isOpen={deleteOpenMap[record.logId]}
                      toggleClose={() => handleDeleteToggle(record.logId)}
                      action={() => deleteLogRecord(record.logId)}
                    />
                  </>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>

      <Box
        position="fixed"
        bottom="20px"
        right="20px"
        width="25%"
        zIndex={9999}
      >
        <ScaleFade in={showAlert} unmountOnExit>
          <Alert status="success" variant="left-accent" borderRadius="6px">
            <AlertIcon />
            <AlertDescription>
              Log Record deleted successfully.
            </AlertDescription>
          </Alert>
        </ScaleFade>
      </Box>
    </>
  );
};

export default LogRecordsTable;
