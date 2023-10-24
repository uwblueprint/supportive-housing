import React, { useState, useRef, useEffect } from "react";
import { Box, Flex, Spacer } from "@chakra-ui/react";
import ResidentDirectoryTable from "./ResidentDirectoryTable";
import NavigationBar from "../../common/NavigationBar";
import { Resident } from "../../../types/ResidentTypes";
import ResidentAPIClient from "../../../APIClients/ResidentAPIClient";
import Pagination from "../../common/Pagination";
import CreateResident from "../../forms/CreateResident";

const ResidentDirectory = (): React.ReactElement => {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [numResidents, setNumResidents] = useState<number>(0);
  const [resultsPerPage, setResultsPerPage] = useState<number>(25);
  const [pageNum, setPageNum] = useState<number>(1);
  const [userPageNum, setUserPageNum] = useState(pageNum);

  const tableRef = useRef<HTMLDivElement>(null);

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
            userPageNum={userPageNum}
            numResidents={numResidents}
            getRecords={getResidents}
            setUserPageNum={setUserPageNum}
            setNumResidents={setNumResidents}
          />
        </Flex>
        <ResidentDirectoryTable 
          residents={residents} 
          tableRef={tableRef}
          userPageNum={userPageNum}
          numResidents={numResidents}
          setUserPageNum={setUserPageNum}
          getRecords={getResidents}
          setNumResidents={setNumResidents}
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
    </Box>
  );
};

export default ResidentDirectory;
