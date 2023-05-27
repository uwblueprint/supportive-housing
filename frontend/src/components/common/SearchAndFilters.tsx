import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Grid,
  GridItem,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Input,
  InputLeftElement,
  Icon,
  InputGroup,
  Select,
  Divider,
  Text,
} from "@chakra-ui/react";
import { Card } from "react-bootstrap";
import commonAPIClient from "../../APIClients/CommonAPIClient";
import { LogRecord } from "./types/LogRecord";

type Props = {
  setLogRecords: React.Dispatch<React.SetStateAction<LogRecord[]>>;
  setNumRecords: React.Dispatch<React.SetStateAction<number>>;
  pageNum: number;
  resultsPerPage: number;
};

const SearchAndFilters = ({
  setLogRecords,
  setNumRecords,
  pageNum,
  resultsPerPage,
}: Props): React.ReactElement => {
  /* TODO: change inputs to correct types
  - this is possible when the data in LogRecords comes from the API since the API will have the employees/attnTos names + userId
    names + userId and we can query using the /users route based on that
    e.g.:
      - for employee -> we'll need to get an employee's ID by their name to pass into the route
      - for attention to -> same as above
      - for startDate & endDate the date format should be 'YYYY-MM-DD'
       - for tags -> change to an actual array of strings instead of a string
  */
  // TODO: search by resident
  const [residents, setResidents] = useState("");
  const [employees, setEmployees] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [tags, setTags] = useState("");
  const [attentionTo, setAttentionTo] = useState("");
  const [building, setBuilding] = useState("");
  const [flagged, setFlagged] = useState(false);

  const getLogRecordsAfterFiltering = async (page_number = 1) => {
    const employeeIds = employees
      ? employees.replaceAll(`"`, "").split(",")
      : [];
    const attentionTos = attentionTo
      ? attentionTo.replaceAll(`"`, "").split(",")
      : [];
    const dateRange = startDate && endDate ? [startDate, endDate] : [];

    const data = await commonAPIClient.filterLogRecords(
      building,
      employeeIds,
      attentionTos,
      dateRange,
      tags ? [tags] : [],
      flagged,
      resultsPerPage,
      page_number,
    );
    setLogRecords(data.logRecords);
    setNumRecords(data.numResults);
  };

  useEffect(() => {
    getLogRecordsAfterFiltering();
  }, [
    building,
    employees,
    attentionTo,
    startDate,
    endDate,
    tags,
    flagged,
    setLogRecords,
    resultsPerPage,
  ]);

  useEffect(() => {
    getLogRecordsAfterFiltering(pageNum);
  }, [pageNum]);

  // console.log("data", data);
  return (
    <Card>
      <Box padding="8px 16px 20px">
        <Text fontSize="12px" fontWeight="700" color="#6D8788" align="left">
          FILTER BY
        </Text>
        <FormControl>
          <Grid padding="10px 0px" templateColumns="repeat(7, 1fr)" gap={7}>
            <GridItem colSpan={2}>
              <FormLabel fontWeight="700">Residents</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon />
                </InputLeftElement>
                <Input
                  placeholder="Text here"
                  value={residents}
                  onChange={(e) => setResidents(e.target.value)}
                />
              </InputGroup>
            </GridItem>
            <GridItem colSpan={2}>
              <FormLabel fontWeight="700">Employees</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon />
                </InputLeftElement>
                <Input
                  value={employees}
                  placeholder="Employee ID"
                  onChange={(e) => setEmployees(e.target.value)}
                />
              </InputGroup>
            </GridItem>
            <GridItem colSpan={2}>
              <FormLabel fontWeight="700">Date</FormLabel>
              <Grid templateColumns="repeat(7, 1fr)">
                <GridItem colSpan={3}>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon />
                    </InputLeftElement>
                    <Input
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      placeholder="YYYY-MM-DD"
                    />
                  </InputGroup>
                </GridItem>
                <GridItem
                  colSpan={1}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Text fontSize="14px" color="#6D8788" fontWeight="700">
                    TO
                  </Text>
                </GridItem>
                <GridItem colSpan={3}>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon />
                    </InputLeftElement>
                    <Input
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      placeholder="YYYY-MM-DD"
                    />
                  </InputGroup>
                </GridItem>
              </Grid>
            </GridItem>
            <GridItem colSpan={1} paddingTop="32px" justifySelf="left">
              <Button background="#FFFFFF" borderColor="#285E61" border="1px">
                Clear all
              </Button>
            </GridItem>
          </Grid>
        </FormControl>
      </Box>

      <Accordion allowToggle>
        <AccordionItem borderBottom="none">
          {({ isExpanded }) => (
            <>
              <AccordionPanel>
                <FormControl>
                  <Grid
                    padding="10px 0px"
                    templateColumns="repeat(7, 1fr)"
                    gap={6}
                  >
                    <GridItem colSpan={2}>
                      {/* TODO: change this to multiselect tag items */}
                      <FormLabel fontWeight="700">Tags</FormLabel>
                      <InputGroup>
                        <InputLeftElement pointerEvents="none">
                          <Icon />
                        </InputLeftElement>
                        <Input
                          value={tags}
                          placeholder="[tag1, tag2]"
                          onChange={(e) => setTags(e.target.value)}
                        />
                      </InputGroup>
                    </GridItem>
                    <GridItem colSpan={2}>
                      <FormLabel fontWeight="700">Attention To</FormLabel>
                      <InputGroup>
                        <InputLeftElement pointerEvents="none">
                          <Icon />
                        </InputLeftElement>
                        <Input
                          value={attentionTo}
                          placeholder="AttentionTo ID"
                          onChange={(e) => setAttentionTo(e.target.value)}
                        />
                      </InputGroup>
                    </GridItem>
                    <GridItem colSpan={2}>
                      <FormLabel fontWeight="700">Building</FormLabel>
                      {/* TODO: add an icon to the left */}
                      <Select
                        value={building}
                        placeholder="Building No."
                        onChange={(e) => setBuilding(e.target.value)}
                      >
                        <option value="Building A">Building A</option>
                        <option value="Building B">Building B</option>
                        <option value="Building C">Building C</option>
                      </Select>
                    </GridItem>
                    <GridItem colSpan={1} justifySelf="left">
                      <FormLabel fontWeight="700">Flagged</FormLabel>
                      <Checkbox onChange={(e) => setFlagged(e.target.checked)}>
                        Flagged
                      </Checkbox>
                    </GridItem>
                  </Grid>
                </FormControl>
              </AccordionPanel>
              <h2>
                <AccordionButton
                  borderTop={isExpanded ? "1px solid #EAF0EF" : "none"}
                >
                  <Box as="span" flex="1" textAlign="center">
                    {isExpanded ? "CLOSE FILTERS" : "OPEN FILTERS"}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
            </>
          )}
        </AccordionItem>
      </Accordion>
    </Card>
  );
};

export default SearchAndFilters;
