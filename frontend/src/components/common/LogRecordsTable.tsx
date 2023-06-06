import React from "react";
import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { LogRecord } from "../../types/LogRecordTypes";
import getFormattedDateAndTime from '../../utils/DateUtils'

type Props = {
  logRecords: LogRecord[];
};

const LogRecordsTable = ({ logRecords }: Props): React.ReactElement => {
  return (
    <div>
      <TableContainer marginTop="12px" height="70vh" overflowY="scroll">
        <Table
          variant="simple"
          style={{ minHeight: "400px", verticalAlign: "middle" }}
        >
          <Thead className="table-header">
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

              const {date, time} = getFormattedDateAndTime(dateObj)

              return (
                <Tr key={record.logId} style={{ verticalAlign: "middle" }}>
                  <Td width="5%">
                   {date}
                  </Td>
                  <Td width="5%">
                    {time}
                  </Td>
                  {
                    // TODO: Resolve the resident record at some point
                  }
                  <Td width="5%">{record.residentFirstName}</Td>
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
    </div>
  );
};

export default LogRecordsTable;
