import React, { useState, useRef, useEffect } from "react";
import { Box, Flex, Spacer } from "@chakra-ui/react";
import ResidentDirectoryTable from './ResidentDirectoryTable'
import NavigationBar from "../../common/NavigationBar";
import { Resident } from "../../../types/ResidentTypes";
import ResidentAPIClient from "../../../APIClients/ResidentAPIClient";
import Pagination from "../../common/Pagination";

const ResidentDirectory = (): React.ReactElement => {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [numResidents, setNumResidents] = useState<number>(0);
  const [resultsPerPage, setResultsPerPage] = useState<number>(25);
  const [pageNum, setPageNum] = useState<number>(1);
  const [userPageNum, setUserPageNum] = useState(pageNum);

  const tableRef = useRef<HTMLDivElement>(null);

  const getResidents = async (pageNumber: number) => {
    const data = await ResidentAPIClient.getResidents(
      false,      
      pageNumber,
      resultsPerPage,
    );

    // Reset table scroll
    tableRef.current?.scrollTo(0, 0);

    setResidents(data ? data.residents : []);
    setNumResidents(data ? data.numResults : 0);

    if (!data || data.numResults === 0) {
      setUserPageNum(0);
      setPageNum(0);
    } else {
      setPageNum(pageNumber);
    }
  }

  useEffect(() => {
    setUserPageNum(1);
    getResidents(1);
  }, [resultsPerPage])

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
          <Box textStyle="header-large">Resident Directory</Box>
          <Spacer />
          <Flex justify="end" gap="12px">
          {/* TODO: INSERT RESIDENT-RELATED BUTTONS */}
          </Flex>
        </Flex>
        <ResidentDirectoryTable
          residents={residents}
          tableRef={tableRef }
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
  )
};

export default ResidentDirectory;
