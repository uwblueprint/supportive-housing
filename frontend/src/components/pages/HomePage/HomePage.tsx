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
import { Building } from "../../../types/BuildingTypes";
import { Resident } from "../../../types/ResidentTypes";
import { Tag } from "../../../types/TagsTypes";
import { User } from "../../../types/UserTypes";

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
  const [residents, setResidents] = useState<Resident[]>([]);
  const [employees, setEmployees] = useState<User[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [tags, setTags] = useState<Tag[]>([]);
  const [attentionTos, setAttentionTos] = useState<User[]>([]);
  const [building, setBuilding] = useState<Building | null>(null);
  const [flagged, setFlagged] = useState(false);

  // Record/page state
  const [logRecords, setLogRecords] = useState<LogRecord[]>([]);
  const [numRecords, setNumRecords] = useState<number>(0);
  const [resultsPerPage, setResultsPerPage] = useState<number>(25);
  const [pageNum, setPageNum] = useState<number>(1);
  const [userPageNum, setUserPageNum] = useState(pageNum);

  // Table reference
  const tableRef = useRef<HTMLDivElement>(null);

  const formatDate = (date: Date) => {
    const isoString = date.toISOString(); // Get ISO string, e.g., "2023-07-09T00:00:00.000Z"
    const formattedDate = isoString.slice(0, 10); // Extract "YYYY-MM-DD" from the ISO string
    return formattedDate;
  };


  const getLogRecords = async (pageNumber: number) => {
    const buildingValue = building ? building.value : "";
    const employeeIds = employees.map((employee) => employee.id);
    const attentionToIds = attentionTos.map((attnTo) => attnTo.id);
    const dateRange =
      startDate && endDate ? [formatDate(startDate), formatDate(endDate)] : [];
    const tagsValues = tags.map((tag) => tag.value);

    const data = await commonAPIClient.filterLogRecords({
      building: buildingValue,
      employeeId: employeeIds,
      attnTo: attentionToIds,
      dateRange,
      tags: tagsValues,
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
    const buildingValue = building ? building.value : "";
    const employeeIds = employees.map((employee) => employee.id);
    const attentionToIds = attentionTos.map((attnTo) => attnTo.id);
    const dateRange =
      startDate && endDate ? [formatDate(startDate), formatDate(endDate)] : [];
    const tagsValues = tags.map((tag) => tag.value);

    const data = await commonAPIClient.countLogRecords({
      building: buildingValue,
      employeeId: employeeIds,
      attnTo: attentionToIds,
      dateRange,
      tags: tagsValues,
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
    attentionTos,
    startDate,
    endDate,
    tags,
    flagged,
    setLogRecords,
    resultsPerPage,
  ]);

  useEffect(() => {
    countLogRecords();
  }, [building, employees, attentionTos, startDate, endDate, tags, flagged]);

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
            <CreateLog getRecords={getLogRecords} setUserPageNum={setUserPageNum}/>
            <ExportCSVButton />
          </Flex>
        </Flex>

        <SearchAndFilters
          residents={residents}
          employees={employees}
          startDate={startDate}
          endDate={endDate}
          tags={tags}
          attentionTos={attentionTos}
          building={building}
          flagged={flagged}
          setResidents={setResidents}
          setEmployees={setEmployees}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          setTags={setTags}
          setAttentionTos={setAttentionTos}
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
