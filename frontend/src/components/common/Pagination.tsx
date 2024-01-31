import React from "react";
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
  Input,
} from "@chakra-ui/react";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
} from "@chakra-ui/icons";

type Props = {
  numRecords: number;
  resultsPerPage: number;
  pageNum: number;
  userPageNum: number;
  setUserPageNum: React.Dispatch<React.SetStateAction<number>>;
  setResultsPerPage: React.Dispatch<React.SetStateAction<number>>;
  getRecords: (pageNumber: number) => Promise<void>;
};

const RESULTS_PER_PAGE_OPTIONS = [10, 25, 50];

const Pagination = ({
  numRecords,
  resultsPerPage,
  pageNum,
  userPageNum,
  setUserPageNum,
  setResultsPerPage,
  getRecords,
}: Props): React.ReactElement => {
  const numPages = Math.ceil(Math.max(1, numRecords) / resultsPerPage);

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value as string;

    if (input === "") {
      setUserPageNum(NaN);
      return;
    }

    const numericInput = input.replace(/[^0-9]/g, "");

    if (numericInput !== "") {
      const newUserPageNum = Number(numericInput);
      if (newUserPageNum < 1 || newUserPageNum > numPages) {
        return;
      }
      setUserPageNum(newUserPageNum);
    }
  };

  // Only fetch records if a valid page num is present AND the page num has changed
  const fetchRecords = () => {
    if (!Number.isNaN(userPageNum) && userPageNum !== pageNum) {
      getRecords(userPageNum);
    }
  };

  // Treat the enter key as an alt method of triggering onBlur (lose focus)
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const handleKeyUp = (event: any) => {
    if (event.keyCode === 13) {
      event.target.blur();
    }
  };

  const handleBlur = () => {
    if (Number.isNaN(userPageNum)) {
      setUserPageNum(pageNum);
      return;
    }
    fetchRecords();
  };

  const handlePageArrowPress = (newUserPageNum: number) => {
    setUserPageNum(newUserPageNum);
    getRecords(newUserPageNum);
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
        <Box>
          <Flex alignItems="center" justifyContent="space-evenly">
            <IconButton
              variant="ghost"
              aria-label="Previous page"
              icon={<ChevronLeftIcon boxSize={7} color="teal.200" />}
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
              <Input
                maxW="60px"
                value={!Number.isNaN(userPageNum) ? userPageNum : ""}
                max={numPages}
                size="sm"
                onChange={handleNumberInputChange}
                onBlur={() => handleBlur()}
                fontWeight="700"
                color="gray.750"
                onKeyUp={(e) => handleKeyUp(e)}
              />
              <Text>of {numPages}</Text>
            </Flex>
            <IconButton
              variant="ghost"
              aria-label="Next page"
              disabled={userPageNum >= numPages}
              icon={<ChevronRightIcon boxSize={7} color="teal.200" />}
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

export default Pagination;
