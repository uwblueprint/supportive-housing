import React, { useEffect, useRef, useState } from "react";
import {
  Flex,
  Spacer,
} from "@chakra-ui/react";

import Pagination from "../../common/Pagination";
import NavigationBar from "../../common/NavigationBar";
import CreateLog from "../../forms/CreateLog";
import commonAPIClient from "../../../APIClients/CommonAPIClient";
import { LogRecord } from "../../../types/LogRecordTypes";
import LogRecordsTable from "./LogRecordsTable";
import SearchAndFilters from "./SearchAndFilters";

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

  const getLogRecords = async (page_number: number) => {
    const employeeIds = employees
      ? employees.replaceAll(`"`, "").split(",")
      : [];
    const attentionTos = attentionTo
      ? attentionTo.replaceAll(`"`, "").split(",")
      : [];
    const dateRange = startDate && endDate ? [startDate, endDate] : [];

    const data = await commonAPIClient.filterLogRecords(
      building,
      employeeIds,
      attentionTos,
      dateRange,
      tags ? [tags] : [],
      flagged,
      resultsPerPage,
      page_number,
    );

    // Reset table scroll
    tableRef.current?.scrollTo(0, 0);

    setLogRecords(data ? data.logRecords : []);
    setNumRecords(data ? data.numResults : 0);

    if (!data || data.numResults === 0) {
      setUserPageNum(0);
      setPageNum(0);
    } else {
      setPageNum(page_number);
    }
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

  return (
    <div className="page-container">
      <NavigationBar />
      <div className="records">
        <Flex marginBottom="16px">
          <h1 className="records-hero">Day Logs</h1>
          <Spacer />
          <CreateLog />
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
          getLogRecords={getLogRecords}
        />
      </div>
    </div>
  );
};

export default HomePage;
