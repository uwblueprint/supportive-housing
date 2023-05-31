import React from "react";
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

type Props = {
  numRecords: number;
  resultsPerPage: number;
  pageNum: number;
  setResultsPerPage: React.Dispatch<React.SetStateAction<number>>;
  getLogRecords: (page_number: number) => Promise<void>;
};

const RESULTS_PER_PAGE_OPTIONS = [10, 25, 50];

const Pagination = ({
  numRecords,
  resultsPerPage,
  pageNum,
  setResultsPerPage,
  getLogRecords,
}: Props): React.ReactElement => {
  const numPages = Math.ceil(numRecords / resultsPerPage);

  const handleNumberInputChange = (
    newPageNumString: string,
    newPageNum: number,
  ) => {
    if (newPageNum !== pageNum && newPageNum >= 1 && newPageNum <= numPages) {
      getLogRecords(newPageNum);
    }
  };

  const getNumRecordsStr = () => {
    return `${numRecords} ${numRecords === 1 ? 'item' : 'items'}`
  }

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
              disabled={pageNum <= 1}
              onClick={() => (pageNum > 1 ? getLogRecords(pageNum - 1) : null)}
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
                value={pageNum}
                size="sm"
                onChange={handleNumberInputChange}
              >
                <NumberInputField fontWeight="bold" />
              </NumberInput>
              <Text>of {numPages}</Text>
            </Flex>
            <IconButton
              className="icon-button"
              variant="ghost"
              aria-label="Next page"
              disabled={pageNum >= numPages}
              icon={<ChevronRightIcon boxSize={7} color="#6D8788" />}
              onClick={() =>
                pageNum < numPages ? getLogRecords(pageNum + 1) : null
              }
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
