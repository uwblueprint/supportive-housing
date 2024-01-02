import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, Spinner, Text } from "@chakra-ui/react";
import Pagination from "../../common/Pagination";
import NavigationBar from "../../common/NavigationBar";
import SignInLogsTable from "./SignInLogsTable";
import { SignInLog } from "../../../types/SignInLogsTypes";
import SignInLogsAPIClient from "../../../APIClients/SignInLogsAPIClient";

const SignInLogsPage = (): React.ReactElement => {
  const [signInLogs, setSignInLogs] = useState<SignInLog[]>([]);
  const [numSignInLogs, setNumSignInLogs] = useState<number>(0);
  const [resultsPerPage, setResultsPerPage] = useState<number>(25);
  const [pageNum, setPageNum] = useState<number>(1);
  const [userPageNum, setUserPageNum] = useState(pageNum);

  // Table reference
  const tableRef = useRef<HTMLDivElement>(null);

  const [tableLoaded, setTableLoaded] = useState(false);

  const getSignInLogs = async (pageNumber: number) => {
    // Start date - 30 days in the past
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    startDate.setHours(0, 0, 0, 0);

    // End date - current day
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    setTableLoaded(false);

    const data = await SignInLogsAPIClient.getSignInLogs({
      pageNumber,
      resultsPerPage,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });

    // Reset table scroll
    tableRef.current?.scrollTo(0, 0);

    setSignInLogs(data ? data.signInLogs : []);

    if (!data || data.signInLogs.length === 0) {
      setUserPageNum(0);
      setPageNum(0);
    } else {
      setPageNum(pageNumber);
    }

    setTableLoaded(true);
  };

  const countSignInLogs = async () => {
    // Start date - 30 days in the past
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    startDate.setHours(0, 0, 0, 0);

    // End date - current day
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    const data = await SignInLogsAPIClient.countSignInLogs({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });

    setNumSignInLogs(data ? data.numResults : 0);
  };

  useEffect(() => {
    setUserPageNum(1);
    getSignInLogs(1);
  }, [resultsPerPage]);

  useEffect(() => {
    countSignInLogs();
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
          <Box textStyle="hero-table">Sign In Logs</Box>
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
            {numSignInLogs === 0 ? (
              <Text textAlign="center" paddingTop="5%">
                No results found.
              </Text>
            ) : (
              <Box>
                <SignInLogsTable signInLogs={signInLogs} tableRef={tableRef} />
                <Pagination
                  numRecords={numSignInLogs}
                  pageNum={pageNum}
                  userPageNum={userPageNum}
                  setUserPageNum={setUserPageNum}
                  resultsPerPage={resultsPerPage}
                  setResultsPerPage={setResultsPerPage}
                  getRecords={getSignInLogs}
                />
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default SignInLogsPage;
