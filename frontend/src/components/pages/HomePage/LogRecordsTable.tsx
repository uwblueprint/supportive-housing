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
import CommonAPIClient from "../../../APIClients/CommonAPIClient";

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

  // Delete confirmation state
  const [deleteOpenMap, setDeleteOpenMap] = useState<{ [key: number]: boolean }>({});

  // Handle delete confirmation toggle
  const handleDeleteToggle = (logId: number) => {
    setDeleteOpenMap((prevDeleteOpenMap) => ({
      ...prevDeleteOpenMap,
      [logId]: !prevDeleteOpenMap[logId],
    }));
  };

  // Edit form state
  const [editOpenMap, setEditOpenMap] = useState<{ [key: number]: boolean }>({});

  // Handle edit form toggle
  const handleEditToggle = (logId: number) => {
    setDeleteOpenMap((prevDeleteOpenMap) => ({
      ...prevDeleteOpenMap,
      [logId]: !prevDeleteOpenMap[logId],
    }));
  };

  useEffect(() => {
    if (showAlert) {
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }
  }, [showAlert]);

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
            variant="logRecordsTable"
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
                    await CommonAPIClient.deleteLogRecord(itemId);
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
                              <MenuItem onClick={() => handleDeleteToggle(record.logId)}>
                                Delete Log Record
                              </MenuItem>
                              <MenuItem onClick={() => handleEditToggle(record.logId)}>
                                Edit Log Record
                              </MenuItem>
                            </MenuList>
                          </Menu>
                        )}
                      </Td>
                    </Tr>

                    <DeleteConfirmation
                      itemName="log"
                      itemId={record.logId}
                      isOpen={deleteOpenMap[record.logId]}
                      toggleClose={() => handleDeleteToggle(record.logId)}
                      deleteAPI={deleteLogRecord}
                    />

                    <EditResident
                      logRecord={record}
                      isOpen={deleteOpenMap[record.logId]}
                      toggleClose={() => handleDeleteToggle(record.logId)}
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
