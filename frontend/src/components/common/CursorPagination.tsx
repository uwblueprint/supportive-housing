import React, { useState } from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  IconButton,
  Flex,
  Box,
  Text,
} from "@chakra-ui/react";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
} from "@chakra-ui/icons";

type Props = {
  numRecords: number;
  resultsPerPage: number;
  setResultsPerPage: React.Dispatch<React.SetStateAction<number>>;
  nextCursor: number;
  prevCursor: number;
  setNextCursor: React.Dispatch<React.SetStateAction<number>>;
  setPrevCursor: React.Dispatch<React.SetStateAction<number>>;
  getRecords: (direction?: string) => Promise<void>;
};

const RESULTS_PER_PAGE_OPTIONS = [10, 25, 50];

const CursorPagination = ({
  numRecords,
  resultsPerPage,
  setResultsPerPage,
  nextCursor,
  prevCursor,
  setNextCursor,
  setPrevCursor,
  getRecords,
}: Props): React.ReactElement => {

  const handleLeftArrowPress = () => {
    getRecords("previous");
  };

  const handleRightArrowPress = () => {
    getRecords("next");
  };

  const getNumRecordsStr = () => {
    return `${numRecords} ${numRecords === 1 ? "item" : "items"}`;
  };

  return (
    <Box padding="12px 0px 33px">
      <Flex justifyContent="space-between" alignItems="center">
        <Box>
          <Text color="teal.200">{getNumRecordsStr()}</Text>
        </Box>
        <Box flexGrow={1} >
          <Flex alignItems="center" justifyContent="space-evenly">
            <IconButton
              variant="ghost"
              aria-label="Previous page"
              icon={<ChevronLeftIcon boxSize={7} color="teal.200" />}
              disabled={prevCursor === -1}
              onClick={handleLeftArrowPress}
            />
            <IconButton
              variant="ghost"
              aria-label="Next page"
              icon={<ChevronRightIcon boxSize={7} color="teal.200" />}
              disabled={nextCursor === -1 && prevCursor !== -1}
              onClick={handleLeftArrowPress}
            />
          </Flex>
        </Box>
        <Box>
          <Flex alignItems="center" justifyContent="space-evenly">
            <Text paddingRight="8px">Show</Text>
            <Menu>
              <MenuButton
                as={Button}
                variant="outline"
                width="73px"
                fontWeight="700"
                rightIcon={<ChevronDownIcon color="teal.200" />}
              >
                {resultsPerPage}
              </MenuButton>
              <MenuList>
                {RESULTS_PER_PAGE_OPTIONS.map((opt, ind) => (
                  <MenuItem
                    key={ind}
                    onClick={() => {
                      // TO-DO - Confirm that resetting to page 1 is what's ideal
                      setResultsPerPage(opt);
                    }}
                  >
                    {opt}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

export default CursorPagination;
