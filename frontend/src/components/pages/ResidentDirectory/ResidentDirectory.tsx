import React, { useState, useRef, useEffect } from "react";
import { Box } from "@chakra-ui/react";
import ResidentDirectoryTable from './ResidentDirectoryTable'
import NavigationBar from "../../common/NavigationBar";
import { Resident } from "../../../types/ResidentTypes";
import ResidentAPIClient from "../../../APIClients/ResidentAPIClient";
import Pagination from "../../common/Pagination";

const SAMPLE_RESIDENTS: Resident[] = [
  { id: 1, initial: 'AA', roomNum: 132, dateJoined: new Date(), building: "362"},
  { id: 2, initial: 'BB', roomNum: 131, dateJoined: new Date(), dateLeft: new Date(), building: "362"},
  { id: 3, initial: 'CC', roomNum: 231, dateJoined: new Date(), building: "362"},
  { id: 4, initial: 'DD', roomNum: 131, dateJoined: new Date(), building: "362"},
  { id: 5, initial: 'EE', roomNum: 113, dateJoined: new Date(), dateLeft: new Date(), building: "144"},
  { id: 6, initial: 'EF', roomNum: 1, dateJoined: new Date(), building: "362"},
  { id: 7, initial: 'FF', roomNum: 22, dateJoined: new Date(), building: "362"},
  { id: 8, initial: 'HI', roomNum: 365, dateJoined: new Date(), dateLeft: new Date(), building: "402"},
  { id: 9, initial: 'GG', roomNum: 14, dateJoined: new Date(), building: "362"},
  { id: 10, initial: 'EZ', roomNum: 901, dateJoined: new Date(), building: "362"},
  { id: 11, initial: 'WOW', roomNum: 13, dateJoined: new Date(), dateLeft: new Date(), building: "362"},
  { id: 112, initial: 'CS', roomNum: 43, dateJoined: new Date(), building: "362"},
]

const ResidentDirectory = (): React.ReactElement => {
  // Record/page state
  const [residents, setResidents] = useState<Resident[]>([]);
  const [numResidents, setNumResidents] = useState<number>(0);
  const [resultsPerPage, setResultsPerPage] = useState<number>(25);
  const [pageNum, setPageNum] = useState<number>(1);
  const [userPageNum, setUserPageNum] = useState(pageNum);

  const tableRef = useRef<HTMLDivElement>(null);

  const getResidents = async (pageNumber: number) => {
    const data = await ResidentAPIClient.paginatedGetResidents(
      true,
      resultsPerPage,
      pageNumber,
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
