import React from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  Button,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  IconButton,
  Flex,
  Grid,
  GridItem,
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
  setResultsPerPage: React.Dispatch<React.SetStateAction<number>>;
  setPageNum: React.Dispatch<React.SetStateAction<number>>;
};

const RESULTS_PER_PAGE_OPTIONS = [10, 25, 50];

const Pagination = ({
  numRecords,
  resultsPerPage,
  pageNum,
  setResultsPerPage,
  setPageNum,
}: Props): React.ReactElement => {
  const numPages = Math.ceil(numRecords / resultsPerPage);

  const handleChange = (newPageVal: number) => {
    setPageNum(newPageVal);
  };

  return (
    <div>
      <Grid templateColumns="repeat(3, 1fr)" gap={100}>
        <GridItem>
          <h1>{numRecords} items</h1>
        </GridItem>
        <GridItem>
          <Flex flexDirection="row">
            <IconButton
              aria-label="Previous page"
              icon={<ChevronLeftIcon />}
              disabled={pageNum === 1}
              onClick={() => (pageNum > 1 ? setPageNum(pageNum - 1) : null)}
            />
            <h1>Page</h1>
            <NumberInput
              maxW="64px"
              value={pageNum}
              min={1}
              max={numPages}
              size="xs"
              onChange={handleChange}
            >
              <NumberInputField />
            </NumberInput>
            <h1>of {numPages}</h1>
            <IconButton
              aria-label="Next page"
              disabled={pageNum === numPages}
              icon={<ChevronRightIcon />}
              onClick={() =>
                pageNum < numPages ? setPageNum(pageNum + 1) : null
              }
            />
          </Flex>
        </GridItem>
        <GridItem>
          <Menu>
            <MenuButton as={Button}>
              {resultsPerPage} <ChevronDownIcon />
            </MenuButton>
            <MenuList>
              {RESULTS_PER_PAGE_OPTIONS.map((opt, ind) => (
                <MenuItem
                  key={ind}
                  onClick={() => {
                    // TO-DO - Confirm that resetting to page 1 is what's ideal
                    setPageNum(1);
                    setResultsPerPage(opt);
                  }}
                >
                  {opt}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </GridItem>
      </Grid>
    </div>
  );
};

export default Pagination;
