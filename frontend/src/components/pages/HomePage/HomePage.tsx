import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, Spacer } from "@chakra-ui/react";

import Pagination from "../../common/Pagination";
import NavigationBar from "../../common/NavigationBar";
import CreateLog from "../../forms/CreateLog";
import commonAPIClient from "../../../APIClients/CommonAPIClient";
import { LogRecord } from "../../../types/LogRecordTypes";
import LogRecordsTable from "./LogRecordsTable";
import SearchAndFilters from "./SearchAndFilters";
import ExportCSVButton from "../../common/ExportCSVButton";

type TransformedFilters = {
  employeeIds: any[];
  attentionTos: any[];
  dateRange: any[];
};

const HomePage = (): React.ReactElement => {
  /* TODO: change inputs to correct types
  - this is possible when the data in LogRecords comes from the API since the API will have the employees/attnTos names + userId
    names + userId and we can query using the /users route based on that
    e.g.:
      - for employee -> we'll need to get an employee's ID by their name to pass into the route
      - for attention to -> same as above
      - for startDate & endDate the date format should be 'YYYY-MM-DD'
       - for tags -> change to an actual array of strings instead of a string
  */
  // TODO: search by resident
  // Filter state
  const [residents, setResidents] = useState("");
  const [employees, setEmployees] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [tags, setTags] = useState("");
  const [attentionTo, setAttentionTo] = useState("");
  const [building, setBuilding] = useState("");
  const [flagged, setFlagged] = useState(false);

  // Record/page state
  const [logRecords, setLogRecords] = useState<LogRecord[]>([]);
  const [numRecords, setNumRecords] = useState<number>(0);
  const [resultsPerPage, setResultsPerPage] = useState<number>(25);
  const [pageNum, setPageNum] = useState<number>(1);
  const [userPageNum, setUserPageNum] = useState(pageNum);

  // Table reference
  const tableRef = useRef<HTMLDivElement>(null);

  const transformFilters = (): TransformedFilters => {
    const employeeIds = employees
      ? employees.replaceAll(`"`, "").split(",")
      : [];
    const attentionTos = attentionTo
      ? attentionTo.replaceAll(`"`, "").split(",")
      : [];
    const dateRange = startDate && endDate ? [startDate, endDate] : [];

    return { employeeIds, attentionTos, dateRange };
  };

  const getLogRecords = async (pageNumber: number) => {
    const { employeeIds, attentionTos, dateRange } = transformFilters();

    const data = await commonAPIClient.filterLogRecords({
      building,
      employeeId: employeeIds,
      attnTo: attentionTos,
      dateRange,
      tags: tags ? [tags] : [],
      flagged,
      resultsPerPage,
      pageNumber,
    });

    // Reset table scroll
    tableRef.current?.scrollTo(0, 0);

    setLogRecords(data ? data.logRecords : []);

    if (!data || data.logRecords.length === 0) {
      setUserPageNum(0);
      setPageNum(0);
    } else {
      setPageNum(pageNumber);
    }
  };

  const countLogRecords = async () => {
    const { employeeIds, attentionTos, dateRange } = transformFilters();

    const data = await commonAPIClient.countLogRecords({
      building,
      employeeId: employeeIds,
      attnTo: attentionTos,
      dateRange,
      tags: tags ? [tags] : [],
      flagged,
    });

    setNumRecords(data ? data.numResults : 0);
  };

  useEffect(() => {
    setUserPageNum(1);
    getLogRecords(1);
  }, [
    building,
    employees,
    attentionTo,
    startDate,
    endDate,
    tags,
    flagged,
    setLogRecords,
    resultsPerPage,
  ]);

  useEffect(() => {
    countLogRecords();
  }, [building, employees, attentionTo, startDate, endDate, tags, flagged]);

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
          <Box textStyle="hero-table">Day Logs</Box>
          <Spacer />
          <Flex justify="end" gap="12px">
            <CreateLog />
            <ExportCSVButton />
          </Flex>
        </Flex>

        <SearchAndFilters
          residents={residents}
          employees={employees}
          startDate={startDate}
          endDate={endDate}
          tags={tags}
          attentionTo={attentionTo}
          building={building}
          setResidents={setResidents}
          setEmployees={setEmployees}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          setTags={setTags}
          setAttentionTo={setAttentionTo}
          setBuilding={setBuilding}
          setFlagged={setFlagged}
        />

        <LogRecordsTable logRecords={logRecords} tableRef={tableRef} />
        <Pagination
          numRecords={numRecords}
          pageNum={pageNum}
          userPageNum={userPageNum}
          setUserPageNum={setUserPageNum}
          resultsPerPage={resultsPerPage}
          setResultsPerPage={setResultsPerPage}
          getRecords={getLogRecords}
        />
      </Box>
    </Box>
  );
};

export default HomePage;
