import React, { useEffect, useRef, useState } from "react";
import { Box, Flex } from "@chakra-ui/react";

import CursorPagination from "../../common/CursorPagination";
import NavigationBar from "../../common/NavigationBar";
import { User } from "../../../types/UserTypes";
import EmployeeDirectoryTable from "./EmployeeDirectoryTable";
import UserAPIClient from "../../../APIClients/UserAPIClient";
import CreateEmployee from "../../forms/CreateEmployee";

const EmployeeDirectoryPage = (): React.ReactElement => {
  const [users, setUsers] = useState<User[]>([]);
  const [numUsers, setNumUsers] = useState<number>(0);
  const [resultsPerPage, setResultsPerPage] = useState<number>(25);

  const [nextCursor, setNextCursor] = useState<number>(-1);
  const [prevCursor, setPrevCursor] = useState<number>(-1);

  // Table reference
  const tableRef = useRef<HTMLDivElement>(null);

  const getUsers = async (direction?: string) => {
    const data = await UserAPIClient.getUsers({
      returnAll: false,
      resultsPerPage,
      nextCursor,
      prevCursor,
      direction,
    });

    // Reset table scroll
    tableRef.current?.scrollTo(0, 0);

    setUsers(data ? data.users : []);
    setNextCursor(data ? data.nextCursor : -1);
    setPrevCursor(data ? data.prevCursor : -1);
    console.log(data ? data.nextCursor : -1)
  };

  const countUsers = async () => {
    const data = await UserAPIClient.countUsers();
    setNumUsers(data ? data.numResults : 0);
  };

  useEffect(() => {
    getUsers();
  }, [resultsPerPage]);

  useEffect(() => {
    countUsers();
  }, []);

  return (
    <Box>
      <NavigationBar />
      <Box
        textStyle="dm-sans-font"
        textAlign="center"
        width="75%"
        paddingTop="2%"
        margin="0px auto"
        color="blue.600"
      >
        <Flex marginBottom="16px" justify="space-between">
          <Box textStyle="hero-table">Employee Directory</Box>
          <>{CreateEmployee()}</>
        </Flex>

        <EmployeeDirectoryTable users={users} tableRef={tableRef} />
        <CursorPagination
          numRecords={numUsers}
          resultsPerPage={resultsPerPage}
          setResultsPerPage={setResultsPerPage}
          nextCursor={nextCursor}
          prevCursor={prevCursor}
          setNextCursor={setNextCursor}
          setPrevCursor={setPrevCursor}
          getRecords={getUsers}
        />
      </Box>
    </Box>
  );
};

export default EmployeeDirectoryPage;
