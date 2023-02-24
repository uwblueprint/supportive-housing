import React from "react";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from '@chakra-ui/react';


const mockRecords = [
  {
    "id": 1, "Date": "Jan 21", "Time": "12:15 AM", "Resident": "DE307", "Note": "A female guest came to see DE 307.", "Employee": "Huseyin", "Attn_To": "John Doe"
  },
  {
    "id": 2, "Date": "Jan 21", "Time": "1:00 AM", "Resident": "AH206", "Note": "Dustin left.", "Employee": "Huseyin", "Attn_To": "John Doe"
  },
  {
    "id": 3, "Date": "Jan 21", "Time": "2:45 AM", "Resident": "DE307", "Note": "Vic came", "Employee": "Huseyin", "Attn_To": "John Doe"
  }
]

const LogRecords = (): React.ReactElement => {
  return (
    <div className="records">
      <h1>Log Records</h1>
      <TableContainer>
        <Table variant='simple' css={{ overflowY: 'auto', maxHeight: '400px' }}>

          <Thead>
            <Tr css={{
              background: 'EDF2F7'
            }}>
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
                <Tr key={record.id} style={{ verticalAlign: 'top' }}>
                  <Td >{record.Date}</Td>
                  <Td>{record.Time}</Td>
                  <Td>{record.Resident}</Td>
                  <Td whiteSpace="normal" >{record.Note}</Td>
                  <Td>{record.Employee}</Td>
                  <Td>{record.Attn_To}</Td>
                </Tr>
              );
            })}
          </Tbody>

        </Table>
      </TableContainer>
    </div>
  );
};

export default LogRecords;
