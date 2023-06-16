import React, { useState } from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  NumberInput,
  NumberInputField,
  IconButton,
  Flex,
  Box,
  Text,
  GridItem,
} from "@chakra-ui/react";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  TriangleDownIcon,
} from "@chakra-ui/icons";
import { getLocalStorageObjProperty } from "../../utils/LocalStorageUtils";

type Props = {
  numRecords: number;
  resultsPerPage: number;
  pageNum: number;
  userPageNum: number;
  setUserPageNum: React.Dispatch<React.SetStateAction<number>>;
  setResultsPerPage: React.Dispatch<React.SetStateAction<number>>;
  getLogRecords: (page_number: number) => Promise<void>;
};

const RESULTS_PER_PAGE_OPTIONS = [10, 25, 50];

const Pagination = ({
  numRecords,
  resultsPerPage,
  pageNum,
  userPageNum,
  setUserPageNum,
  setResultsPerPage,
  getLogRecords,
}: Props): React.ReactElement => {
  const numPages = Math.ceil(numRecords / resultsPerPage);

  const handleNumberInputChange = (
    newUserPageNumString: string,
    newUserPageNum: number,
  ) => {
    if (
      newUserPageNum === pageNum ||
      newUserPageNum < 1 ||
      newUserPageNum > numPages
    ) {
      return;
    }
    setUserPageNum(newUserPageNum);
    if (!Number.isNaN(newUserPageNum)) {
      getLogRecords(newUserPageNum);
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (Number.isNaN(userPageNum)) {
      setUserPageNum(pageNum);
    }
  };

  const handlePageArrowPress = (newUserPageNum: number) => {
    setUserPageNum(newUserPageNum);
    getLogRecords(newUserPageNum);
  };

  const getNumRecordsStr = () => {
    return `${numRecords} ${numRecords === 1 ? "item" : "items"}`;
  };

  return (
    <Box padding="12px 0px 33px">
      <Flex justifyContent="space-between" alignItems="center">
        <Box>
          <Text color="#6D8788">{getNumRecordsStr()}</Text>
        </Box>
        <Box>
          <Flex alignItems="center" justifyContent="space-evenly">
            <IconButton
              className="icon-button"
              variant="ghost"
              aria-label="Previous page"
              icon={<ChevronLeftIcon boxSize={7} color="#6D8788" />}
              disabled={userPageNum <= 1}
              onClick={() => handlePageArrowPress(userPageNum - 1)}
            />
            <Flex
              alignItems="center"
              justifyContent="space-evenly"
              padding="0px 25px 0px"
              width="210px"
            >
              <Text>Page</Text>
              <NumberInput
                maxW="60px"
                value={!Number.isNaN(userPageNum) ? userPageNum : ""}
                max={numPages}
                size="sm"
                onChange={handleNumberInputChange}
                onBlur={(e) => handleBlur(e)}
              >
                <NumberInputField fontWeight="bold" />
              </NumberInput>
              <Text>of {numPages}</Text>
            </Flex>
            <IconButton
              className="icon-button"
              variant="ghost"
              aria-label="Next page"
              disabled={userPageNum >= numPages}
              icon={<ChevronRightIcon boxSize={7} color="#6D8788" />}
              onClick={() => handlePageArrowPress(userPageNum + 1)}
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
                rightIcon={<ChevronDownIcon color="#6D8788" />}
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

export default Pagination;
