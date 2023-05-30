import React, { useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  Input,
  Box,
  Text,
  Badge,
  Select,
} from "@chakra-ui/react";

import NavigationBar from "../common/NavigationBar";
import CreateLog from "../forms/CreateLog";
import SearchAndFilters from "../common/SearchAndFilters";
import { LogRecord } from "../common/types/LogRecord";
import commonApiClient from "../../APIClients/CommonAPIClient";

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
  console.log(logRecords);

  const [email, setEmail] = useState<string>("");
  const [invitedEmail, setInvitedEmail] = useState<string>("");
  const [invitedFirstName, setInvitedFirstName] = useState<string>("");
  const [invitedLastName, setInvitedLastName] = useState<string>("");

  const [userRole, setUserRole] = useState<string>("");
  const [isInvited, setIsInvited] = useState<boolean>(false);

  const inviteUser = async () => {
    await commonApiClient.inviteUser(
      email,
      userRole,
      invitedFirstName,
      invitedLastName,
    );
  };
  const checkInvitedUser = async () => {
    const res = await commonApiClient.isUserInvited(invitedEmail);
    setIsInvited(res);
  };
  return (
    <div className="page-container">
      <NavigationBar />
      <Box padding="20px">
        <Text>Invite User:</Text>
        <Input
          type="text"
          width="50%"
          value={invitedFirstName}
          onChange={(event) => setInvitedFirstName(event.target.value)}
          placeholder="Enter first name"
        />
        <Input
          type="text"
          width="50%"
          value={invitedLastName}
          onChange={(event) => setInvitedLastName(event.target.value)}
          placeholder="Enter last name"
        />
        <Select
          placeholder="Enter role"
          value={userRole}
          onChange={(e) => setUserRole(e.target.value)}
        >
          <option value="Relief Staff">Relief Staff</option>
          <option value="Admin">Admin</option>
          <option value="Regular Staff">Regular Staff</option>
        </Select>
        <Input
          type="email"
          width="70%"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="username@domain.com"
        />
        <Button width="30%" onClick={() => inviteUser()}>
          Invite user
        </Button>
        <Text>
          Check if user is invited:
          <Badge colorScheme={isInvited ? "green" : "red"}>
            {isInvited ? "true" : "false"}
          </Badge>
        </Text>
        <Input
          width="70%"
          type="email"
          value={invitedEmail}
          onChange={(event) => setInvitedEmail(event.target.value)}
          placeholder="username@domain.com"
        />
        <Button width="30%" onClick={() => checkInvitedUser()}>
          Check if invited
        </Button>
      </Box>
      <div className="records">
        <CreateLog />
        <SearchAndFilters setLogRecords={setLogRecords} />
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
