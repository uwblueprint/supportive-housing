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
import commonAPIClient from "../../APIClients/CommonAPIClient";

/* TODO: change inputs to correct types
  - for employee -> we'll need to get an employee's ID by their name to pass into the route
  - for attention to -> same as above
  - for startDate & endDate the date format should be 'YYYY-MM-DD'
  - for tags -> change to an actual array of strings instead of a string
*/

const SearchAndFilters = (
  logRecords: any,
  setLogRecords: React.Dispatch<React.SetStateAction<{
    id: number;
    Date: string;
    Time: string;
    Resident: string;
    Note: string;
    Employee: string;
    Attn_To: string;
}>>,
): React.ReactElement => {
  const [residents, setResidents] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [tags, setTags] = useState("");
  const [attentionTo, setAttentionTo] = useState("");
  const [building, setBuilding] = useState("");
  const [flagged, setFlagged] = useState(false);

  useEffect(() => {
    const getLogRecordsAfterFiltering = async () => {
      const data = await commonAPIClient.filterLogRecords(
        building,
        employeeId,
        attentionTo,
        [startDate, endDate],
        tags,
        flagged,
      );
      // setxLogRecords(data);
      console.log(data);
    };

    getLogRecordsAfterFiltering();
  });

  // console.log("data", data);
  return (
    <Accordion allowToggle padding="20px">
      <AccordionItem>
        <AccordionPanel>
          <Box className="card">
            <Box className="container" as="span" w="100%">
              <Text fontSize="12px" fontWeight="700" color="#6D8788">
                FILTER BY
              </Text>
              <FormControl>
                <Grid
                  padding="10px 0px"
                  templateColumns="repeat(7, 1fr)"
                  gap={7}
                >
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
                        value={employeeId}
                        placeholder="Employee ID"
                        onChange={(e) => setEmployeeId(e.target.value)}
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
                  <GridItem colSpan={1} paddingTop="32px">
                    <Button
                      background="#FFFFFF"
                      borderColor="#285E61"
                      border="1px"
                    >
                      Clear all
                    </Button>
                  </GridItem>
                </Grid>
                <Divider />
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
                  <GridItem colSpan={1}>
                    <FormLabel fontWeight="700">Flagged</FormLabel>
                    <Checkbox onChange={(e) => setFlagged(e.target.checked)}>
                      Flagged
                    </Checkbox>
                  </GridItem>
                </Grid>
              </FormControl>
            </Box>
          </Box>
        </AccordionPanel>
        <h2>
          <AccordionButton>
            <Box as="span" flex="1" textAlign="center">
              CLOSE FILTERS
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
      </AccordionItem>
    </Accordion>
  );
};

export default SearchAndFilters;
