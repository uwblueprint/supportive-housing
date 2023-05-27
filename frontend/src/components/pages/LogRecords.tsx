import React, { useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";

import Pagination from "../common/Pagination";
import NavigationBar from "../common/NavigationBar";
import CreateLog from "../forms/CreateLog";
import SearchAndFilters from "../common/SearchAndFilters";
import { LogRecord } from "../common/types/LogRecord";

// TODO: Replace the mock data with data from API, JSON response with type below
const mockRecords = [
  {
    id: 1,
    Date: "Jan 21",
    Time: "12:15 AM",
    Resident: "DE307",
    Note: "A female guest came to see DE 307.",
    Employee: "Huseyin",
    Attn_To: "John Doe",
  },
  {
    id: 2,
    Date: "Jan 21",
    Time: "1:00 AM",
    Resident: "AH206",
    Note: "Dustin left.",
    Employee: "Huseyin",
    Attn_To: "John Doe",
  },
  {
    id: 3,
    Date: "Jan 21",
    Time: "2:45 AM",
    Resident: "DE307",
    Note: "Vic came",
    Employee: "Huseyin",
    Attn_To: "John Doe",
  },
  {
    id: 4,
    Date: "Jan 21",
    Time: "3:20 AM",
    Resident: "MB404",
    Note:
      "During security check, MB404 was making some noise. TSW warned her to be quiet. She yelled on TSW behind the door, yelled, and swore (f..uck of......). TSW told her that I will call the police if she continues. Then she came down for laundry.",
    Employee: "Huseyin",
    Attn_To: "John Doe",
  },
];

const LogRecords = (): React.ReactElement => {
  // TODO: use this instead of mockRecords & remove console.log
  const [logRecords, setLogRecords] = useState<LogRecord[]>([]);
  const [numRecords, setNumRecords] = useState<number>(0);
  const [resultsPerPage, setResultsPerPage] = useState<number>(25);
  const [pageNum, setPageNum] = useState<number>(1);

  console.log(logRecords);
  console.log(numRecords);
  console.log("results per page: ", resultsPerPage);

  return (
    <div className="page-container">
      <NavigationBar />
      <div className="records">
        <CreateLog />
        <SearchAndFilters
          pageNum={pageNum}
          resultsPerPage={resultsPerPage}
          setLogRecords={setLogRecords}
          setNumRecords={setNumRecords}
        />
        <TableContainer paddingTop="12px">
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

                return (
                  <Tr key={record.logId} style={{ verticalAlign: "middle" }}>
                    <Td width="5%">
                      {`${dateObj.getMonth()} ${dateObj.getDate()} ${dateObj.getFullYear()}`}
                    </Td>
                    <Td width="5%">
                      {`${dateObj.getHours()}:${dateObj.getMinutes()}`}
                    </Td>
                    {
                      // TODO: Resolve the resident record at some point
                    }
                    <Td width="5%">{record.residentFirstName}</Td>
                    <Td whiteSpace="normal" width="75%">
                      {record.note}
                    </Td>
                    <Td width="5%">{record.employeeFirstName}</Td>
                    <Td width="5%">
                      {`${record.attnToFirstName} ${record.attnToLastName}`}
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
        <Pagination
          numRecords={numRecords}
          pageNum={pageNum}
          resultsPerPage={resultsPerPage}
          setResultsPerPage={setResultsPerPage}
          setPageNum={setPageNum}
        />
      </div>
    </div>
  );
};

export default LogRecords;
