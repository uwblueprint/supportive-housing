import React, { useState, useRef, useEffect } from "react";
import { Box, Flex, Spacer, Spinner, Text } from "@chakra-ui/react";

import NavigationBar from "../../common/NavigationBar";
import CreateTag from "../../forms/CreateTag";
import TagsTable from "./TagsTable";
import Pagination from "../../common/Pagination";
import { Tag } from "../../../types/TagTypes";
import TagAPIClient from "../../../APIClients/TagAPIClient";

const TagsPage = (): React.ReactElement => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [numTags, setNumTags] = useState<number>(0);
  const [pageNum, setPageNum] = useState<number>(1);
  const [userPageNum, setUserPageNum] = useState<number>(pageNum);
  const [resultsPerPage, setResultsPerPage] = useState<number>(25);

  // Table reference
  const tableRef = useRef<HTMLDivElement>(null);

  const [tableLoaded, setTableLoaded] = useState(false);

  const getTags = async (pageNumber: number) => {
    setTableLoaded(false);

    const data = await TagAPIClient.getTags({
      pageNumber,
      resultsPerPage,
    });

    // Reset table scroll
    tableRef.current?.scrollTo(0, 0);

    setTags(data ? data.tags : []);

    if (!data || data.tags.length === 0) {
      setUserPageNum(0);
      setPageNum(0);
    } else {
      setPageNum(pageNumber);
    }

    setTableLoaded(true);
  };

  const countTags = async () => {
    const data = await TagAPIClient.countTags();
    setNumTags(data ? data.numResults : 0);
  };

  useEffect(() => {
    setUserPageNum(1);
    getTags(1);
  }, [resultsPerPage]);

  useEffect(() => {
    countTags();
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
          <Box textStyle="hero-table">Tags</Box>
          <Spacer />
          <CreateTag
            getTags={getTags}
            countTags={countTags}
            setUserPageNum={setUserPageNum}
          />
        </Flex>

        {!tableLoaded ? (
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            size="xl"
          />
        ) : (
          <Box>
            {numTags === 0 ? (
              <Text textAlign="center" paddingTop="5%">
                No results found.
              </Text>
            ) : (
              <Box>
                <TagsTable
                  tags={tags}
                  tableRef={tableRef}
                  userPageNum={userPageNum}
                  setUserPageNum={setUserPageNum}
                  getRecords={getTags}
                  countTags={countTags}
                />

                <Pagination
                  numRecords={numTags}
                  pageNum={pageNum}
                  userPageNum={userPageNum}
                  setUserPageNum={setUserPageNum}
                  resultsPerPage={resultsPerPage}
                  setResultsPerPage={setResultsPerPage}
                  getRecords={getTags}
                />
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default TagsPage;
