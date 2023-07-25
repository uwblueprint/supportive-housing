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
import { Resident } from "../../../types/ResidentTypes";
import getFormattedDateAndTime from "../../../utils/DateUtils";

type Props = {
  residents: Resident[];
  tableRef: RefObject<HTMLDivElement>;
};

const getFormattedDatesAndStatus = (resident: Resident) => {
    const startDateObj = new Date(resident.dateJoined);
    const startDate = getFormattedDateAndTime(startDateObj, true);

    let endDate;
    if (resident.dateLeft != null) {
        const endDateObj = new Date(resident.dateLeft)
        endDate = getFormattedDateAndTime(endDateObj, true)
    }
    const status = resident.dateJoined !== null && resident.dateLeft !== null ? "Past" : "Current";
    return {
        startDate,
        endDate,
        status
    }
}

const ResidentDirectoryTable = ({
  residents,
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
          verticalAlign="middle"
        >
          <Thead>
            <Tr>
              <Th>Resident</Th>
              <Th>Status</Th>
              <Th>Building</Th>
              <Th>Residency Start Date</Th>
              <Th>Residency End Date</Th>
            </Tr>
          </Thead>

          <Tbody>
            {residents.map((resident) => {
              const { startDate, endDate, status } = getFormattedDatesAndStatus(resident);
              // TODO: Remove non-null assertion from residentId 
              return (
                <Tr key={resident.id} style={{ verticalAlign: "middle" }}>
                  <Td width="20%">{resident.residentId!}</Td>
                  <Td width="15%">{status}</Td>
                  <Td width="20%">{resident.building}</Td>
                  <Td width="20%">{startDate.date}</Td>
                  {
                    endDate ?
                    <Td width="20%">{endDate.date}</Td>
                    :
                    null
                  }
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ResidentDirectoryTable;
