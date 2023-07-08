import React, { RefObject, useState, useContext } from "react";
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
} from "@chakra-ui/react";
import { VscKebabVertical } from "react-icons/vsc";

import { LogRecord } from "../../../types/LogRecordTypes";
import getFormattedDateAndTime from "../../../utils/DateUtils";

import AuthContext from "../../../contexts/AuthContext";

type Props = {
  logRecords: LogRecord[];
  tableRef: RefObject<HTMLDivElement>;
};

const LogRecordsTable = ({
  logRecords,
  tableRef,
}: Props): React.ReactElement => {

  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);

  // Options menu state
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Handle options menu toggle
  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
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
              <Th>Options</Th>
            </Tr>
          </Thead>

          <Tbody>
            {/* TODO: replace mockRecords with logRecords */}
            {logRecords.map((record) => {
              // TODO: Investigate alternative methods for date storage + creation
              const dateObj = new Date(record.datetime);

              const { date, time } = getFormattedDateAndTime(dateObj);

              return (
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
                          onClick={handleMenuToggle}
                        />
                        <MenuList>
                            <MenuItem>
                              Delete
                            </MenuItem>
                            <MenuItem>
                              Edit
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
      </TableContainer>
    </Box>
  );
};

export default LogRecordsTable;
