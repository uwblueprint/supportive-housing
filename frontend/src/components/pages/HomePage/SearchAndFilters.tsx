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
  Text,
} from "@chakra-ui/react";
import { Card } from "react-bootstrap";
import Select, { MultiValue, SingleValue } from "react-select";
import { SingleDatepicker } from "chakra-dayzed-datepicker";
import selectStyle from "../../../theme/forms/selectStyles";
import { singleDatePickerStyle } from "../../../theme/forms/datePickerStyles";
import { Building } from "../../../types/BuildingTypes";
import { Resident } from "../../../types/ResidentTypes";
import { Tag } from "../../../types/TagsTypes";
import { User } from "../../../types/UserTypes";

type Props = {
  residents: Resident[];
  employees: User[];
  startDate: Date | undefined;
  endDate: Date | undefined;
  tags: Tag[];
  attentionTos: User[];
  building: Building | null;
  flagged: boolean;
  setResidents: React.Dispatch<React.SetStateAction<Resident[]>>;
  setEmployees: React.Dispatch<React.SetStateAction<User[]>>;
  setStartDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  setEndDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  setTags: React.Dispatch<React.SetStateAction<Tag[]>>;
  setAttentionTos: React.Dispatch<React.SetStateAction<User[]>>;
  setBuilding: React.Dispatch<React.SetStateAction<Building | null>>;
  setFlagged: React.Dispatch<React.SetStateAction<boolean>>;
};
// Ideally we should be storing this information in the database
const BUILDINGS: Building[] = [
  { label: "144", value: "144 Erb St. West" },
  { label: "362", value: "362 Erb St. West" },
  { label: "402", value: "402 Erb St. West" },
];

// Replace this with the tags from the db once the API and table are made
const TAGS: Tag[] = [
  { label: "Tag A", value: "A" },
  { label: "Tag B", value: "B" },
  { label: "Tag C", value: "C" },
];

// Replace this with the residents from the db
const RESIDENTS: Resident[] = [
  { id: "1", label: "DE307", value: "DE307" },
  { id: "2", label: "AH206", value: "AH206" },
  { id: "3", label: "MB404", value: "MB404" },
];

// Replace this with the users from the db
const EMPLOYEES: User[] = [
  { id: "4", label: "Huseyin", value: "Huseyin" },
  { id: "5", label: "John Doe", value: "John Doe" },
];

const SearchAndFilters = ({
  residents,
  employees,
  startDate,
  endDate,
  tags,
  attentionTos,
  building,
  flagged,
  setResidents,
  setEmployees,
  setStartDate,
  setEndDate,
  setTags,
  setAttentionTos,
  setBuilding,
  setFlagged,
}: Props): React.ReactElement => {
  const handleBuildingChange = (selectedOption: SingleValue<Building>) => {
    if (selectedOption !== null) {
      setBuilding(selectedOption);
    }
  };

  const handleAttnToChange = (selectedAttnTos: MultiValue<User>) => {
    const mutableSelectedAttnTos: User[] = Array.from(selectedAttnTos);
    setAttentionTos(mutableSelectedAttnTos);
  };

  const handleEmployeesChange = (
    selectedEmployees: MultiValue<{ id: string; label: string; value: string }>,
  ) => {
    const mutableSelectedEmployees: User[] = Array.from(selectedEmployees);
    setEmployees(mutableSelectedEmployees);
  };

  const handleEndDateChange = (newEndDate: Date) => {
    setEndDate(newEndDate);
  };

  const handleResidentsChange = (selectedResidents: MultiValue<Resident>) => {
    const mutableSelectedResidents: Resident[] = Array.from(selectedResidents);
    setResidents(mutableSelectedResidents);
  };

  const handleStartDateChange = (newStartDate: Date) => {
    setStartDate(newStartDate);
  };

  const handleTagsChange = (selectedTags: MultiValue<Tag>) => {
    const mutableSelectedTags: Tag[] = Array.from(selectedTags);
    setTags(mutableSelectedTags);
  };

  const handleClearAll = () => {
    console.log(flagged);
    setAttentionTos([]);
    setBuilding(null);
    setEmployees([]);
    setEndDate(undefined);
    setFlagged(false);
    setResidents([]);
    setStartDate(undefined);
    setTags([]);
  };

  return (
    <Card style={{ textAlign: "left" }}>
      <Box padding="8px 16px 20px">
        <Text fontSize="12px" fontWeight="700" color="#6D8788" align="left">
          FILTER BY
        </Text>
        <FormControl>
          <Grid padding="10px 0px" templateColumns="repeat(7, 1fr)" gap={7}>
            <GridItem colSpan={2}>
              <FormLabel fontWeight="700">Residents</FormLabel>{" "}
              <Select
                value={residents}
                options={RESIDENTS}
                isMulti
                closeMenuOnSelect={false}
                placeholder="Select Resident"
                onChange={handleResidentsChange}
                styles={selectStyle}
              />
            </GridItem>
            <GridItem colSpan={2}>
              <FormLabel fontWeight="700">Employees</FormLabel>
              <Select
                value={employees}
                options={EMPLOYEES}
                isMulti
                closeMenuOnSelect={false}
                placeholder="Select Employee"
                onChange={handleEmployeesChange}
                styles={selectStyle}
              />
            </GridItem>
            <GridItem colSpan={2}>
              <FormLabel fontWeight="700">Date</FormLabel>
              <Grid templateColumns="repeat(7, 1fr)">
                <GridItem colSpan={3}>
                  <SingleDatepicker
                    name="start-date-input"
                    date={startDate}
                    onDateChange={handleStartDateChange}
                    propsConfigs={{
                      ...singleDatePickerStyle,
                      inputProps: {
                        ...singleDatePickerStyle.inputProps,
                        placeholder: "Start Date",
                      },
                    }}
                  />
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
                  <SingleDatepicker
                    name="end-date-input"
                    date={endDate}
                    onDateChange={handleEndDateChange}
                    propsConfigs={{
                      ...singleDatePickerStyle,
                      inputProps: {
                        ...singleDatePickerStyle.inputProps,
                        placeholder: "End Date",
                      },
                    }}
                  />
                </GridItem>
              </Grid>
            </GridItem>
            <GridItem colSpan={1} paddingTop="32px" justifySelf="left">
              <Button variant="secondary" onClick={handleClearAll}>
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
                      <FormLabel fontWeight="700">Tags</FormLabel>
                      <Select
                        value={tags}
                        options={TAGS}
                        isMulti
                        closeMenuOnSelect={false}
                        placeholder="Select Tags"
                        onChange={handleTagsChange}
                        styles={selectStyle}
                      />
                    </GridItem>
                    <GridItem colSpan={2}>
                      <FormLabel fontWeight="700">Attention To</FormLabel>
                      <Select
                        value={attentionTos}
                        options={EMPLOYEES}
                        isMulti
                        closeMenuOnSelect={false}
                        placeholder="Select Attn To"
                        onChange={handleAttnToChange}
                        styles={selectStyle}
                      />
                    </GridItem>
                    <GridItem colSpan={2}>
                      <FormLabel fontWeight="700">Building</FormLabel>
                      <Select
                        value={building}
                        options={BUILDINGS}
                        placeholder="Building No."
                        onChange={handleBuildingChange}
                        styles={selectStyle}
                      />
                    </GridItem>
                    <GridItem colSpan={1} justifySelf="left">
                      <FormLabel fontWeight="700">Flagged</FormLabel>
                      <Checkbox
                        isChecked={flagged}
                        onChange={(e) => setFlagged(e.target.checked)}
                      >
                        <Text>Flagged</Text>
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
                    <Text>{isExpanded ? "CLOSE FILTERS" : "OPEN FILTERS"}</Text>
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
