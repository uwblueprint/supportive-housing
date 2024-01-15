import React, { useState, useRef, useEffect } from "react";
import { Box, Flex, Spacer, Spinner, Text } from "@chakra-ui/react";
import ResidentDirectoryTable from "./ResidentDirectoryTable";
import NavigationBar from "../../common/NavigationBar";
import { Resident, StatusLabel } from "../../../types/ResidentTypes";
import ResidentAPIClient from "../../../APIClients/ResidentAPIClient";
import BuildingAPIClient from "../../../APIClients/BuildingAPIClient";
import Pagination from "../../common/Pagination";
import CreateResident from "../../forms/CreateResident";
import ResidentDirectoryFilters from "./ResidentDirectoryFilters";
import { SelectLabel } from "../../../types/SharedTypes";
import { convertToString } from "../../../helper/dateHelpers";

const ResidentDirectory = (): React.ReactElement => {
  const [residents, setResidents] = useState<Resident[]>([]);

  // Pagination
  const [numResidents, setNumResidents] = useState<number>(0);
  const [resultsPerPage, setResultsPerPage] = useState<number>(25);
  const [pageNum, setPageNum] = useState<number>(1);
  const [userPageNum, setUserPageNum] = useState(pageNum);
  const [tableLoaded, setTableLoaded] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);

  // Options
  const [buildingOptions, setBuildingOptions] = useState<SelectLabel[]>([]);

  // Filter state
  const [residentSelections, setResidentSelections] = useState<SelectLabel[]>(
    [],
  );
  // NOTE: Building 362 will always have ID 2 in the database
  const [buildingSelections, setBuildingSelections] = useState<SelectLabel[]>(
    [{
      label: "362",
      value: 2
    }],
  );
  const [statusSelections, setStatusSelections] = useState<StatusLabel[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  const getBuildingOptions = async () => {
    const data = await BuildingAPIClient.getBuildings();

    if (data) {
      const buildingLabels: SelectLabel[] = data.buildings.map((building) => ({
        label: building.name!,
        value: building.id!,
      }));
      setBuildingOptions(buildingLabels);
    }
  };

  const getResidents = async (pageNumber: number) => {
    const residentIds =
      residentSelections.length > 0
        ? residentSelections.map((resident) => resident.value)
        : undefined;
    const buildingIds =
      buildingSelections.length > 0
        ? buildingSelections.map((building) => building.value)
        : undefined;
    const statuses =
      statusSelections.length > 0
        ? statusSelections.map((employee) => employee.value)
        : undefined;

    let dateRange;
    if (startDate || endDate) {
      dateRange = [
        startDate ? convertToString(startDate) : null,
        endDate ? convertToString(endDate) : null,
      ];
    }

    setTableLoaded(false);
    const data = await ResidentAPIClient.getResidents({
      returnAll: false,
      pageNumber,
      resultsPerPage,
      residents: residentIds,
      buildings: buildingIds,
      statuses,
      dateRange,
    });

    // Reset table scroll
    tableRef.current?.scrollTo(0, 0);

    setResidents(data ? data.residents : []);

    if (!data || data.residents.length === 0) {
      setUserPageNum(0);
      setPageNum(0);
    } else {
      setPageNum(pageNumber);
    }
    setTableLoaded(true);
  };

  const countResidents = async () => {
    const residentIds =
      residentSelections.length > 0
        ? residentSelections.map((resident) => resident.value)
        : undefined;
    const buildingIds =
      buildingSelections.length > 0
        ? buildingSelections.map((building) => building.value)
        : undefined;
    const statuses =
      statusSelections.length > 0
        ? statusSelections.map((employee) => employee.value)
        : undefined;

    let dateRange;
    if (startDate || endDate) {
      dateRange = [
        startDate ? convertToString(startDate) : null,
        endDate ? convertToString(endDate) : null,
      ];
    }

    const data = await ResidentAPIClient.countResidents({
      residents: residentIds,
      buildings: buildingIds,
      statuses,
      dateRange,
    });
    setNumResidents(data ? data.numResults : 0);
  };

  useEffect(() => {
    setUserPageNum(1);
    getResidents(1);
    countResidents();
  }, [
    resultsPerPage,
    residentSelections,
    buildingSelections,
    statusSelections,
    startDate,
    endDate,
  ]);

  useEffect(() => {
    getBuildingOptions();
  }, []);

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
        <Flex marginBottom="16px" justify="space-between">
          <Box textStyle="hero-table">Resident Directory</Box>
          <Spacer />
          <CreateResident
            getRecords={getResidents}
            setUserPageNum={setUserPageNum}
            countResidents={countResidents}
          />
        </Flex>

        <ResidentDirectoryFilters
          residentSelections={residentSelections}
          buildingSelections={buildingSelections}
          statusSelections={statusSelections}
          buildingOptions={buildingOptions}
          startDate={startDate}
          endDate={endDate}
          setResidentSelections={setResidentSelections}
          setBuildingSelections={setBuildingSelections}
          setStatusSelections={setStatusSelections}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />

        {!tableLoaded ? (
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            size="xl"
          />
        ) : (
          <Box>
            {numResidents === 0 ? (
              <Text textAlign="center" paddingTop="5%">
                No results found.
              </Text>
            ) : (
              <Box>
                <ResidentDirectoryTable
                  buildingOptions={buildingOptions}
                  residents={residents}
                  tableRef={tableRef}
                  userPageNum={userPageNum}
                  setUserPageNum={setUserPageNum}
                  getRecords={getResidents}
                  countResidents={countResidents}
                />
                <Pagination
                  numRecords={numResidents}
                  pageNum={pageNum}
                  userPageNum={userPageNum}
                  setUserPageNum={setUserPageNum}
                  resultsPerPage={resultsPerPage}
                  setResultsPerPage={setResultsPerPage}
                  getRecords={getResidents}
                />
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ResidentDirectory;
