import React, { RefObject } from "react";
import {
  Box,
  Table,
  Tbody,
  TableContainer,
  Th,
  Td,
  Thead,
  Tr,
} from "@chakra-ui/react";
import getFormattedDateAndTime from "../../../utils/DateUtils";
import { SignInLog } from "../../../types/SignInLogsTypes";

type Props = {
  signInLogs: SignInLog[];
  tableRef: RefObject<HTMLDivElement>;
};

const SignInLogsTable = ({
  signInLogs,
  tableRef,
}: Props): React.ReactElement => {
  
  return (
    <Box>
      <TableContainer
        marginTop="12px"
        height="70vh"
        overflowY="unset"
        ref={tableRef}
      >
        <Table variant="showTable" verticalAlign="middle">
          <Thead>
            <Tr>
              <Th>Employee Name</Th>
              <Th>Date</Th>
              <Th>Time</Th>
            </Tr>
          </Thead>
          <Tbody>
            {signInLogs.map((log) => {
              const dateObj = new Date(log.date);
              
              const { date, time } = getFormattedDateAndTime(dateObj);

              return (
                <Tr key={log.id} style={{ verticalAlign: "middle" }}>
                  <Td width="33%">{`${log.name}`}</Td>
                  <Td width="33%">{date}</Td>
                  <Td width="5%">{time}</Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default SignInLogsTable;
