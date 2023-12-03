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
import { BuildingLabel } from "../../../types/BuildingTypes";
import { Resident, ResidentLabel } from "../../../types/ResidentTypes";
import { Tag } from "../../../types/TagsTypes";
import { User, UserLabel } from "../../../types/UserTypes";
import UserAPIClient from "../../../APIClients/UserAPIClient";
import ResidentAPIClient from "../../../APIClients/ResidentAPIClient";
import CreateToast from "../../common/Toasts";

type Props = {
  residents: ResidentLabel[];
  employees: UserLabel[];
  startDate: Date | undefined;
  endDate: Date | undefined;
  tags: Tag[];
  attentionTos: UserLabel[];
  buildings: BuildingLabel[];
  flagged: boolean;
  setResidents: React.Dispatch<React.SetStateAction<ResidentLabel[]>>;
  setEmployees: React.Dispatch<React.SetStateAction<UserLabel[]>>;
  setStartDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  setEndDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  setTags: React.Dispatch<React.SetStateAction<Tag[]>>;
  setAttentionTos: React.Dispatch<React.SetStateAction<UserLabel[]>>;
  setBuildings: React.Dispatch<React.SetStateAction<BuildingLabel[]>>;
  setFlagged: React.Dispatch<React.SetStateAction<boolean>>;
};
// Ideally we should be storing this information in the database
const BUILDINGS = [
  { label: "144", value: 1 },
  { label: "362", value: 2 },
  { label: "402", value: 3 },
];

// Replace this with the tags from the db once the API and table are made
const TAGS: Tag[] = [
  { label: "Tag A", value: "A" },
  { label: "Tag B", value: "B" },
  { label: "Tag C", value: "C" },
];

const SearchAndFilters = ({
  residents,
  employees,
  startDate,
  endDate,
  tags,
  attentionTos,
  buildings,
  flagged,
  setResidents,
  setEmployees,
  setStartDate,
  setEndDate,
  setTags,
  setAttentionTos,
  setBuildings,
  setFlagged,
}: Props): React.ReactElement => {
  const [userLabels, setUserLabels] = useState<UserLabel[]>();
  const [residentLabels, setResidentLabels] = useState<ResidentLabel[]>();

  const dateChangeToast = CreateToast();

  const getUsers = async () => {
    const data = await UserAPIClient.getUsers({ returnAll: true });
    const users = data?.users;
    if (users) {
      const labels = users.map((user: User) => {
        return {
          label: `${user.firstName} ${user.lastName}`,
          value: user.id,
        } as UserLabel;
      });
      setUserLabels(labels);
    }
  };

  const getResidents = async () => {
    const data = await ResidentAPIClient.getResidents({ returnAll: true });
    const residentsData = data?.residents;
    if (residentsData) {
      const labels = residentsData.map((resident: Resident) => {
        return {
          label: `${resident.residentId}`,
          value: resident.id,
        } as ResidentLabel;
      });
      setResidentLabels(labels);
    }
  };

  const handleBuildingChange = (
    selectedBuildings: MultiValue<BuildingLabel>,
  ) => {
    const mutableSelectedBuildings: BuildingLabel[] = Array.from(
      selectedBuildings,
    );
    setBuildings(mutableSelectedBuildings);
  };

  const handleAttnToChange = (selectedAttnTos: MultiValue<UserLabel>) => {
    const mutableSelectedAttnTos: UserLabel[] = Array.from(selectedAttnTos);
    setAttentionTos(mutableSelectedAttnTos);
  };

  const handleEmployeesChange = (selectedEmployees: MultiValue<UserLabel>) => {
    const mutableSelectedEmployees: UserLabel[] = Array.from(selectedEmployees);
    setEmployees(mutableSelectedEmployees);
  };

  const handleStartDateChange = (newStartDate: Date) => {
    if (endDate && newStartDate > endDate) {
      dateChangeToast(
        "Invalid Date",
        "The start date must be before the end date.",
        "error",
      );
      return;
    }
    setStartDate(newStartDate);
  };

  const handleEndDateChange = (newEndDate: Date) => {
    if (startDate && startDate > newEndDate) {
      dateChangeToast(
        "Invalid Date",
        "The end date must be after the start date.",
        "error",
      );
      return;
    }
    setEndDate(newEndDate);
  };

  const handleResidentsChange = (
    selectedResidents: MultiValue<ResidentLabel>,
  ) => {
    const mutableSelectedResidents: ResidentLabel[] = Array.from(
      selectedResidents,
    );
    setResidents(mutableSelectedResidents);
  };

  const handleTagsChange = (selectedTags: MultiValue<Tag>) => {
    const mutableSelectedTags: Tag[] = Array.from(selectedTags);
    setTags(mutableSelectedTags);
  };

  const handleClearAll = () => {
    setAttentionTos([]);
    setBuildings([]);
    setEmployees([]);
    setEndDate(undefined);
    setFlagged(false);
    setResidents([]);
    setStartDate(undefined);
    setTags([]);
  };

  useEffect(() => {
    getUsers();
    getResidents();
  }, []);

  return (
    <Card style={{ textAlign: "left", zIndex: 9999 }}>
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
                options={residentLabels}
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
                options={userLabels}
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
                        isDisabled
                      />
                    </GridItem>
                    <GridItem colSpan={2}>
                      <FormLabel fontWeight="700">Attention To</FormLabel>
                      <Select
                        value={attentionTos}
                        options={userLabels}
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
                        value={buildings}
                        options={BUILDINGS}
                        isMulti
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
