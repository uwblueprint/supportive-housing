import React, { useState, useRef, useEffect } from "react";
import { Box, Flex, Spacer, Spinner, Text } from "@chakra-ui/react";
import ResidentDirectoryTable from "./ResidentDirectoryTable";
import NavigationBar from "../../common/NavigationBar";
import { Resident } from "../../../types/ResidentTypes";
import { BuildingLabel } from "../../../types/BuildingTypes";
import ResidentAPIClient from "../../../APIClients/ResidentAPIClient";
import BuildingAPIClient from "../../../APIClients/BuildingAPIClient";
import Pagination from "../../common/Pagination";
import CreateResident from "../../forms/CreateResident";

const ResidentDirectory = (): React.ReactElement => {
  const [buildingOptions, setBuildingOptions] = useState<BuildingLabel[]>([]);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [numResidents, setNumResidents] = useState<number>(-1);
  const [resultsPerPage, setResultsPerPage] = useState<number>(25);
  const [pageNum, setPageNum] = useState<number>(1);
  const [userPageNum, setUserPageNum] = useState(pageNum);

  const tableRef = useRef<HTMLDivElement>(null);

  const getBuildingOptions = async () => {
    const data = await BuildingAPIClient.getBuildings();

    if (data) {
      const buildingLabels: BuildingLabel[] = data.buildings.map(
        (building) => ({ label: building.name!, value: building.id! }),
      );
      setBuildingOptions(buildingLabels);
    }
  };

  const getResidents = async (pageNumber: number) => {
    const data = await ResidentAPIClient.getResidents({
      returnAll: false,
      pageNumber,
      resultsPerPage,
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
  };

  const countResidents = async () => {
    const data = await ResidentAPIClient.countResidents();
    setNumResidents(data ? data.numResults : 0);
  };

  useEffect(() => {
    setUserPageNum(1);
    getResidents(1);
    getBuildingOptions();
  }, [resultsPerPage]);

  useEffect(() => {
    countResidents();
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
          <Box textStyle="hero-table">Resident Directory</Box>
          <Spacer />
          <CreateResident
            getRecords={getResidents}
            setUserPageNum={setUserPageNum}
            countResidents={countResidents}
          />
        </Flex>

        {numResidents < 0 ? (
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
