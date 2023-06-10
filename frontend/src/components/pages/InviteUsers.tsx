import React, { useState } from "react";
import { Button, Input, Box, Text, Badge, Select } from "@chakra-ui/react";

import NavigationBar from "../common/NavigationBar";
import commonApiClient from "../../APIClients/CommonAPIClient";
import RoleOptions from "../common/types/Roles";

const InviteUsers = (): React.ReactElement => {
  const [email, setEmail] = useState<string>("");
  const [invitedEmail, setInvitedEmail] = useState<string>("");
  const [invitedFirstName, setInvitedFirstName] = useState<string>("");
  const [invitedLastName, setInvitedLastName] = useState<string>("");

  const [userRole, setUserRole] = useState<string>("");
  const [userStatus, setUserStatus] = useState<string>("");

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
    setUserStatus(res);
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
          {RoleOptions.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
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
          Check user status
          <Badge colorScheme={userStatus !== "Not invited" ? "green" : "red"}>
            {userStatus}
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
          Check user status
        </Button>
      </Box>
    </div>
  );
};

export default InviteUsers;
