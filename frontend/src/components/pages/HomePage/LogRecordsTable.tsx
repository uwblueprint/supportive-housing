import React, { RefObject } from "react";
import {
  Box,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { LogRecord } from "../../../types/LogRecordTypes";
import getFormattedDateAndTime from "../../../utils/DateUtils";

type Props = {
  logRecords: LogRecord[];
  tableRef: RefObject<HTMLDivElement>;
};

const LogRecordsTable = ({
  logRecords,
  tableRef,
}: Props): React.ReactElement => {
  return (
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
                  <Td whiteSpace="normal" width="75%">
                    {record.note}
                  </Td>
                  <Td width="5%">{`${record.employeeFirstName} ${record.employeeLastName}`}</Td>
                  <Td width="5%">
                    {`${record.attnToFirstName} ${record.attnToLastName}`}
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
