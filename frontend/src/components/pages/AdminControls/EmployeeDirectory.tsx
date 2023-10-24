import React, { useEffect, useRef, useState } from "react";
import { Box, Flex } from "@chakra-ui/react";

import Pagination from "../../common/Pagination";
import NavigationBar from "../../common/NavigationBar";
import CreateLog from "../../forms/CreateLog";
import commonAPIClient from "../../../APIClients/CommonAPIClient";
import ExportCSVButton from "../../common/ExportCSVButton";
import { User } from "../../../types/UserTypes";
import EmployeeDirectoryTable from "./EmployeeDirectoryTable";
import UserAPIClient from "../../../APIClients/UserAPIClient";
import CreateEmployee from "../../forms/CreateEmployee";

const EmployeeDirectoryPage = (): React.ReactElement => {
  const [users, setUsers] = useState<User[]>([]);
  const [numUsers, setNumUsers] = useState<number>(0);
  const [resultsPerPage, setResultsPerPage] = useState<number>(25);
  const [pageNum, setPageNum] = useState<number>(1);
  const [userPageNum, setUserPageNum] = useState(pageNum);

  // Table reference
  const tableRef = useRef<HTMLDivElement>(null);

  const getUsers = async (pageNumber: number) => {
    const data = await UserAPIClient.getUsers({ pageNumber, resultsPerPage });

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
    const data = await UserAPIClient.countUsers();
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
        <Flex marginBottom="16px" justify="space-between">
          <Box textStyle="hero-table">Employee Directory</Box>
          <CreateEmployee
            userPageNum={userPageNum}
            numUsers={numUsers}
            getRecords={getUsers}
            setUserPageNum={setUserPageNum}
            setNumUsers={setNumUsers}
          />
        </Flex>

        <EmployeeDirectoryTable 
          users={users} 
          tableRef={tableRef} 
          userPageNum={userPageNum}
          numUsers={numUsers}
          setUserPageNum={setUserPageNum}
          getRecords={getUsers}
          setNumUsers={setNumUsers}
        />
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
