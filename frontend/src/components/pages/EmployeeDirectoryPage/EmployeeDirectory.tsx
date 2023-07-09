import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, Spacer } from "@chakra-ui/react";

import Pagination from "../../common/Pagination";
import NavigationBar from "../../common/NavigationBar";
import CreateLog from "../../forms/CreateLog";
import commonAPIClient from "../../../APIClients/CommonAPIClient";
import ExportCSVButton from "../../common/ExportCSVButton";
import { User } from "../../../types/UserTypes";
import EmployeesTable from "./EmployeesTable";

const EmployeeDirectoryPage = (): React.ReactElement => {
  const [users, setUsers] = useState<User[]>([]);
  const [numUsers, setNumUsers] = useState<number>(0);
  const [resultsPerPage, setResultsPerPage] = useState<number>(25);
  const [pageNum, setPageNum] = useState<number>(1);
  const [userPageNum, setUserPageNum] = useState(pageNum);

  // Table reference
  const tableRef = useRef<HTMLDivElement>(null);

  const getUsers = async (pageNumber: number) => {
    const data = await commonAPIClient.getUsers(pageNumber, resultsPerPage);

    // Reset table scroll
    tableRef.current?.scrollTo(0, 0);

    setUsers(data ? data.users : []);

    if (!data || data.users.length === 0) {
      setUserPageNum(0);
      setPageNum(0);
    } else {
      setPageNum(pageNumber);
    }
  };

  const countUsers = async () => {
    const data = await commonAPIClient.countUsers();
    setNumUsers(data ? data.numResults : 0);
  };

  useEffect(() => {
    setUserPageNum(1);
    getUsers(1);
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
        <Flex marginBottom="16px">
          <Box textStyle="hero-records">Day Logs</Box>
          <Spacer />
          <Flex justify="end" gap="12px">
            <CreateLog />
            <ExportCSVButton />
          </Flex>
        </Flex>

        <EmployeesTable users={users} tableRef={tableRef} />
        <Pagination
          numRecords={numUsers}
          pageNum={pageNum}
          userPageNum={userPageNum}
          setUserPageNum={setUserPageNum}
          resultsPerPage={resultsPerPage}
          setResultsPerPage={setResultsPerPage}
          getRecords={getUsers}
        />
      </Box>
    </Box>
  );
};

export default EmployeeDirectoryPage;
