import React, { RefObject, useState, useContext, useEffect } from "react";
import {
  Box,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { VscKebabVertical } from "react-icons/vsc";
import { Resident } from "../../../types/ResidentTypes";
import EditResident from "../../forms/EditResident";
import getFormattedDateAndTime from "../../../utils/DateUtils";
import AuthContext from "../../../contexts/AuthContext";

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
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
  const [showAlert, setShowAlert] = useState(false);

  // Delete confirmation state
  // const [deleteOpenMap, setDeleteOpenMap] = useState<{ [key: number]: boolean }>({});

  // Handle delete confirmation toggle
  // const handleDeleteToggle = (resident: Resident) => {
  //   setDeleteOpenMap((prevDeleteOpenMap) => ({
  //     ...prevDeleteOpenMap,
  //     [logId]: !prevDeleteOpenMap[logId],
  //   }));
  // };
  const [edit, setShowEdit] = useState(false);

  // Handle edit form toggle
  const handleEditToggle = () => {
    setShowEdit(true);
  };

  useEffect(() => {
    if (showAlert) {
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }
  }, [showAlert]);

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
              <Th>Resident</Th>
              <Th>Status</Th>
              <Th>Building</Th>
              <Th>Residency Start Date</Th>
              <Th>Residency End Date</Th>
              <Th> </Th>
            </Tr>
          </Thead>
          <Tbody>
            {residents.map((resident) => {
              const { startDate, endDate, status } = getFormattedDatesAndStatus(resident);
              // TODO: Remove non-null assertion from residentId 
              return (
                < >
                <Tr key={resident.id} style={{ verticalAlign: "middle" }}>
                  <Td width="20%">{resident.residentId!}</Td>
                  <Td width="15%">{status}</Td>
                  <Td width="20%">{resident.building}</Td>
                  <Td width="20%">{startDate.date}</Td>
                  <Td width="20%">{endDate? endDate.date : ""}</Td>
                  <Menu>
                  <MenuButton
                    as={IconButton}
                    aria-label='Options'
                    icon={<VscKebabVertical />}
                    w="36px"
                    variant="ghost"
                  />
                  <MenuList>
                    <MenuItem onClick={() => handleDeleteToggle(resident)}>
                      Delete Log Record
                    </MenuItem>
                    <MenuItem onClick={() => handleEditToggle()}>
                      Edit Log Record
                      {edit && <EditResident resident={resident} />}
                    </MenuItem>
                  </MenuList>
                </Menu>
                </Tr>
                </>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ResidentDirectoryTable;
