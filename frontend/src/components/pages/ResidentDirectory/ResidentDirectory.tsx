import React, { useRef } from "react";
import { Box } from "@chakra-ui/react";
import ResidentDirectoryTable from './ResidentDirectoryTable'
import NavigationBar from "../../common/NavigationBar";
import { Resident } from "../../../types/ResidentTypes";

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
  const tableRef = useRef<HTMLDivElement>(null);
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
          residents={SAMPLE_RESIDENTS}
          tableRef={tableRef }
        />
        {/* <Pagination
          numRecords={numRecords}
          pageNum={pageNum}
          userPageNum={userPageNum}
          setUserPageNum={setUserPageNum}
          resultsPerPage={resultsPerPage}
          setResultsPerPage={setResultsPerPage}
          getRecords={getLogRecords}
        /> */}
      </Box>
    </Box>
  )
};

export default ResidentDirectory;
