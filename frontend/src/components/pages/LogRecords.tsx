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

import NavigationBar from "../common/NavigationBar";
import SearchAndFilters from "../common/SearchAndFilters";

// Replace the mock data with data from API, JSON response
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

  const [logRecords, setLogRecords] = useState(mockRecords);

  return (
    <div className="page-container">
      <NavigationBar />
      <SearchAndFilters logRecords={logRecords} setLogRecords={setLogRecords} />
      <div className="records">
        <TableContainer>
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
              {mockRecords.map((record) => {
                return (
                  <Tr key={record.id} style={{ verticalAlign: "middle" }}>
                    <Td width="5%">{record.Date}</Td>
                    <Td width="5%">{record.Time}</Td>
                    <Td width="5%">{record.Resident}</Td>
                    <Td whiteSpace="normal" width="75%">
                      {record.Note}
                    </Td>
                    <Td width="5%">{record.Employee}</Td>
                    <Td width="5%">{record.Attn_To}</Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default LogRecords;
