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

import DeleteConfirmation from "../../common/DeleteConfirmation";
import EditResident from "../../forms/EditLog";
import LogRecordAPIClient from "../../../APIClients/LogRecordAPIClient";
import ResidentAPIClient from "../../../APIClients/ResidentAPIClient";
import UserAPIClient from "../../../APIClients/UserAPIClient";
import { UserLabel } from "../../../types/UserTypes";

type Props = {
  logRecords: LogRecord[];
  tableRef: RefObject<HTMLDivElement>;
};

const LogRecordsTable = ({
  logRecords,
  tableRef,
}: Props): React.ReactElement => {

  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);

  const [showAlert, setShowAlert] = useState(false);

  // Menu states
  const [deleteOpenMap, setDeleteOpenMap] = useState<{ [key: number]: boolean }>({});
  const [editOpenMap, setEditOpenMap] = useState<{ [key: number]: boolean }>({});

  // Dropdown option states
  const [employeeOptions, setEmployeeOptions] = useState<UserLabel[]>([]);
  const [residentOptions, setResidentOptions] = useState<UserLabel[]>([]);

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

  // fetch resident + employee data for log creation
  const getLogEntryOptions = async () => {
    const residentsData = await ResidentAPIClient.getResidents({ returnAll: true })

    if (residentsData && residentsData.residents.length !== 0) {
      // TODO: Remove the type assertions here
      const residentLabels: UserLabel[] = residentsData.residents.map((r) =>
        ({ id: r.id!, label: r.residentId!, value: r.id! }));
      setResidentOptions(residentLabels)
    }

    const usersData = await UserAPIClient.getUsers({ returnAll: true })
    if (usersData && usersData.users.length !== 0) {
      const userLabels: UserLabel[] = usersData.users.filter((user) => user.userStatus === 'Active').map((user) =>
        ({ id: user.id, label: user.firstName, value: user.id }));
      setEmployeeOptions(userLabels);
    }
  }

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
          overflowY="scroll"
          ref={tableRef}
        >
          <Table
            variant="showTable"
            minHeight="400px"
            verticalAlign="middle"
          >
            <Thead>
              <Tr>
                <Th>Date</Th>
                <Th>Time</Th>
                <Th>Resident</Th>
                <Th>Note</Th>
                <Th>Employee</Th>
                <Th>Attn To</Th>
                <Th> </Th>
              </Tr>
            </Thead>

            <Tbody>
              {/* TODO: replace mockRecords with logRecords */}
              {logRecords.map((record) => {
                // TODO: Investigate alternative methods for date storage + creation
                const dateObj = new Date(record.datetime);

                const { date, time } = getFormattedDateAndTime(dateObj);

                const deleteLogRecord = async (itemId: number) => {
                  try {
                    await LogRecordAPIClient.deleteLogRecord(itemId);
                  } catch (error) {
                    return
                  }
                  setShowAlert(true);
                };

                return (
                  <>
                    <Tr key={record.logId} style={{ verticalAlign: "middle" }}>
                      <Td width="5%">{date}</Td>
                      <Td width="5%">{time}</Td>
                      {
                        // TODO: Resolve the resident record at some point
                      }
                      <Td width="5%">{record.residentId}</Td>
                      <Td whiteSpace="normal" width="70%">
                        {record.note}
                      </Td>
                      <Td width="5%">{`${record.employeeFirstName} ${record.employeeLastName}`}</Td>
                      <Td width="5%">
                        {`${record.attnToFirstName} ${record.attnToLastName}`}
                      </Td>
                      <Td width="5%">
                        {(authenticatedUser?.role === "Admin" || authenticatedUser?.id === record.employeeId) && (
                          <Menu>
                            <MenuButton
                              as={IconButton}
                              aria-label='Options'
                              icon={<VscKebabVertical />}
                              w="36px"
                              variant="ghost"
                            />
                            <MenuList>
                              <MenuItem onClick={() => handleEditToggle(record.logId)}>
                                Edit Log Record
                              </MenuItem>
                              <MenuItem onClick={() => handleDeleteToggle(record.logId)}>
                                Delete Log Record
                              </MenuItem>
                            </MenuList>
                          </Menu>
                        )}
                      </Td>
                    </Tr>

                    <EditResident
                      logRecord={record}
                      isOpen={editOpenMap[record.logId]}
                      toggleClose={() => handleEditToggle(record.logId)}
                      employeeOptions={employeeOptions}
                      residentOptions={residentOptions}
                    />

                    <DeleteConfirmation
                      itemName="log"
                      itemId={record.logId}
                      isOpen={deleteOpenMap[record.logId]}
                      toggleClose={() => handleDeleteToggle(record.logId)}
                      deleteAPI={deleteLogRecord}
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
            <AlertDescription>Log Record deleted successfully.</AlertDescription>
          </Alert>
        </ScaleFade>
      </Box>
    </>

  );
};

export default LogRecordsTable;
