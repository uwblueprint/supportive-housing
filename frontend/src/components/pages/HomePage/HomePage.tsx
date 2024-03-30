import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, Spacer, Spinner, Text } from "@chakra-ui/react";

import Pagination from "../../common/Pagination";
import NavigationBar from "../../common/NavigationBar";
import CreateLog from "../../forms/CreateLog";
import { LogRecord } from "../../../types/LogRecordTypes";
import LogRecordsTable from "./LogRecordsTable";
import HomePageFilters from "./HomePageFilters";
import ExportToCSV from "../../forms/ExportToCSV";
import LogRecordAPIClient from "../../../APIClients/LogRecordAPIClient";
import { SelectLabel } from "../../../types/SharedTypes";

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
  const [residents, setResidents] = useState<SelectLabel[]>([]);
  const [employees, setEmployees] = useState<SelectLabel[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [tags, setTags] = useState<SelectLabel[]>([]);
  const [attentionTos, setAttentionTos] = useState<SelectLabel[]>([]);
  // NOTE: Building 362 will always have ID 2 in the database
  const [buildings, setBuildings] = useState<SelectLabel[]>([
    {
      label: "362",
      value: 2,
    },
  ]);
  const [flagged, setFlagged] = useState(false);

  // Record/page state
  const [logRecords, setLogRecords] = useState<LogRecord[]>([]);
  const [numRecords, setNumRecords] = useState<number>(0);
  const [resultsPerPage, setResultsPerPage] = useState<number>(25);
  const [pageNum, setPageNum] = useState<number>(1);
  const [userPageNum, setUserPageNum] = useState(pageNum);

  // Table Loaded
  const [tableLoaded, setTableLoaded] = useState(false);

  // Table reference
  const tableRef = useRef<HTMLDivElement>(null);

  const getLogRecords = async (pageNumber: number) => {
    const buildingIds =
      buildings.length > 0
        ? buildings.map((building) => building.value)
        : undefined;

    const employeeIds =
      employees.length > 0
        ? employees.map((employee) => employee.value)
        : undefined;

    const attentionToIds =
      attentionTos.length > 0
        ? attentionTos.map((attnTo) => attnTo.value)
        : undefined;

    const residentsIds =
      residents.length > 0
        ? residents.map((resident) => resident.value)
        : undefined;

    const tagIds = tags.length > 0 ? tags.map((tag) => tag.value) : undefined;

    let dateRange;
    if (startDate || endDate) {
      startDate?.setHours(0, 0, 0, 0);
      endDate?.setHours(23, 59, 59, 999);

      dateRange = [
        startDate ? startDate.toISOString() : null,
        endDate ? endDate.toISOString() : null,
      ];
    }

    setTableLoaded(false);

    const data = await LogRecordAPIClient.filterLogRecords({
      buildings: buildingIds,
      employees: employeeIds,
      attnTos: attentionToIds,
      dateRange,
      residents: residentsIds,
      tags: tagIds,
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

    setTableLoaded(true);
  };

  const countLogRecords = async () => {
    const buildingIds =
      buildings.length > 0
        ? buildings.map((building) => building.value)
        : undefined;

    const employeeIds =
      employees.length > 0
        ? employees.map((employee) => employee.value)
        : undefined;

    const attentionToIds =
      attentionTos.length > 0
        ? attentionTos.map((attnTo) => attnTo.value)
        : undefined;

    const residentsIds =
      residents.length > 0
        ? residents.map((resident) => resident.value)
        : undefined;

    const tagIds = tags.length > 0 ? tags.map((tag) => tag.value) : undefined;

    let dateRange;
    if (startDate || endDate) {
      startDate?.setHours(0, 0, 0, 0);
      endDate?.setHours(23, 59, 59, 999);

      dateRange = [
        startDate ? startDate.toISOString() : null,
        endDate ? endDate.toISOString() : null,
      ];
    }

    const data = await LogRecordAPIClient.countLogRecords({
      buildings: buildingIds,
      employees: employeeIds,
      attnTos: attentionToIds,
      dateRange,
      residents: residentsIds,
      tags: tagIds,
      flagged,
    });

    setNumRecords(data ? data.numResults : 0);
  };

  useEffect(() => {
    setUserPageNum(1);
    getLogRecords(1);
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [
    buildings,
    employees,
    attentionTos,
    startDate,
    endDate,
    residents,
    tags,
    flagged,
    setLogRecords,
    resultsPerPage,
  ]);

  useEffect(() => {
    countLogRecords();
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [
    buildings,
    employees,
    attentionTos,
    startDate,
    endDate,
    residents,
    tags,
    flagged,
  ]);

  return (
    <Box>
      <NavigationBar />
      <Box
        textStyle="dm-sans-font"
        textAlign="center"
        width="90%"
        paddingTop="2%"
        margin="0px auto"
        color="blue.600"
      >
        <Flex marginBottom="16px">
          <Box textStyle="hero-table">Day Logs</Box>
          <Spacer />
          <Flex justify="end" gap="12px">
            <CreateLog
              getRecords={getLogRecords}
              countRecords={countLogRecords}
              setUserPageNum={setUserPageNum}
            />
            <ExportToCSV />
          </Flex>
        </Flex>

        <HomePageFilters
          residents={residents}
          employees={employees}
          startDate={startDate}
          endDate={endDate}
          tags={tags}
          attentionTos={attentionTos}
          buildings={buildings}
          flagged={flagged}
          setResidents={setResidents}
          setEmployees={setEmployees}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          setTags={setTags}
          setAttentionTos={setAttentionTos}
          setBuildings={setBuildings}
          setFlagged={setFlagged}
        />

        {!tableLoaded ? (
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            size="xl"
            marginTop="5%"
          />
        ) : (
          <Box>
            {numRecords === 0 ? (
              <Text textAlign="center" paddingTop="5%">
                No results found.
              </Text>
            ) : (
              <Box>
                <LogRecordsTable
                  logRecords={logRecords}
                  tableRef={tableRef}
                  userPageNum={userPageNum}
                  getRecords={getLogRecords}
                  countRecords={countLogRecords}
                  setUserPageNum={setUserPageNum}
                />
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
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default HomePage;
