import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, Spinner, Text } from "@chakra-ui/react";

import Pagination from "../../common/Pagination";
import NavigationBar from "../../common/NavigationBar";
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

  const [tableLoaded, setTableLoaded] = useState(false)

  // Table reference
  const tableRef = useRef<HTMLDivElement>(null);

  const getUsers = async (pageNumber: number) => {
    setTableLoaded(false)
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
    
    setTableLoaded(true)
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
            getRecords={getUsers}
            setUserPageNum={setUserPageNum}
            countUsers={countUsers}
          />
        </Flex>

        {!tableLoaded ? (
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            size="xl"
          />
        ) : (
          <Box>
            {
              numUsers === 0 ? 
              <Text textAlign="center" paddingTop="5%">
                No results found.
              </Text>
              :
              <Box>
                <EmployeeDirectoryTable
                  users={users}
                  tableRef={tableRef}
                  userPageNum={userPageNum}
                  setUserPageNum={setUserPageNum}
                  getRecords={getUsers}
                  countUsers={countUsers}
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
            }
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default EmployeeDirectoryPage;
