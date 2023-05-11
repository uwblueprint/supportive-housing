import React, { useEffect, useState } from "react";
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
import {
  getTeamMembers,
  addTeamMember,
} from "../../APIClients/TeamMembersAPIClient";
import { TeamMember } from "../../types/TeamMembersTypes";

const TeamMembers = (): React.ReactElement => {
  const [records, setRecords] = useState<[TeamMember]>();

  const getRecords = async () => {
    const mockRecords = await getTeamMembers();
    if (mockRecords != null) {
      setRecords(mockRecords);
    }
  };

  const onClick = () => {
    addTeamMember("Safwaan", "Chowdhury", "PL").then(() => {
      getRecords();
    });
  };

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    getRecords();
  }, []);

  return (
    <div className="page-container">
      <NavigationBar />
      <div className="records">
        <TableContainer>
          <Table
            variant="simple"
            style={{ minHeight: "400px", verticalAlign: "middle" }}
          >
            <Thead className="table-header">
              <Tr>
                <Th>First name</Th>
                <Th>Last name</Th>
                <Th>Role</Th>
              </Tr>
            </Thead>
            <Tbody>
              {records &&
                records.map((record: TeamMember) => {
                  return (
                    <Tr key={record.id} style={{ verticalAlign: "middle" }}>
                      <Td width="5%">{record.firstName}</Td>
                      <Td width="5%">{record.lastName}</Td>
                      <Td width="5%">{record.role}</Td>
                    </Tr>
                  );
                })}
            </Tbody>
          </Table>
        </TableContainer>
        <button type="button" onClick={onClick}>
          add member
        </button>
      </div>
    </div>
  );
};

export default TeamMembers;
