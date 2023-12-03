import React, { useEffect, useRef, useState } from "react";
import { Box, Flex } from "@chakra-ui/react";

import { PassThrough } from "stream";
import Pagination from "../../common/Pagination";
import NavigationBar from "../../common/NavigationBar";
import { User } from "../../../types/UserTypes";
import SignInLogsTable from "./SignInLogsTable";
import UserAPIClient from "../../../APIClients/UserAPIClient";



const SignInLogsPage = (): React.ReactElement => {
  const [users, setUsers] = useState<User[]>([]);
  const [numUsers, setNumUsers] = useState<number>(0);
  const [resultsPerPage, setResultsPerPage] = useState<number>(25);
  const [pageNum, setPageNum] = useState<number>(1);
  const [userPageNum, setUserPageNum] = useState(pageNum);

  // Table reference
  const tableRef = useRef<HTMLDivElement>(null);

  // Change to get filter logs !!
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

  // Dummy data
  type MyDictionary = {
    [key: string]: any;
  };

  // Create an array of dictionaries
  const signInLogs: MyDictionary[] = [
    { id: 1, date: "2023-12-03T13:30:00.000Z" , name: "Aathithan Chandrabalan" },
    { id: 1, date: "2023-12-01T12:30:00.000Z" , name: "Phil Dunphry" },
    { id: 1, date: "2023-12-04T15:11:00.000Z" , name: "Connor Bechthold" },
    { id: 1, date: "2023-12-05T19:45:00.000Z" , name: "Bob Cob" },
    { id: 1, date: "2023-12-05T21:23:00.000Z" , name: "Jessica P" },
    
  ];

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
          <Box textStyle="hero-table">Sign In Logs</Box>
        </Flex>

        <SignInLogsTable
          signInLogs={signInLogs}
          tableRef={tableRef}
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

export default SignInLogsPage;
