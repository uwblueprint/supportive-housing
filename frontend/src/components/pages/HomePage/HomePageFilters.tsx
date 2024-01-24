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
  IconButton,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { SmallCloseIcon } from "@chakra-ui/icons";
import { Card } from "react-bootstrap";
import Select, { MultiValue, SingleValue } from "react-select";
import { SingleDatepicker } from "chakra-dayzed-datepicker";
import { selectStyle } from "../../../theme/forms/selectStyles";
import { singleDatePickerStyle } from "../../../theme/forms/datePickerStyles";
import { Resident } from "../../../types/ResidentTypes";
import { Tag } from "../../../types/TagTypes";
import { User } from "../../../types/UserTypes";
import UserAPIClient from "../../../APIClients/UserAPIClient";
import ResidentAPIClient from "../../../APIClients/ResidentAPIClient";
import TagAPIClient from "../../../APIClients/TagAPIClient";
import BuildingAPIClient from "../../../APIClients/BuildingAPIClient";
import CreateToast from "../../common/Toasts";
import { SelectLabel } from "../../../types/SharedTypes";

type Props = {
  residents: SelectLabel[];
  employees: SelectLabel[];
  startDate: Date | undefined;
  endDate: Date | undefined;
  tags: SelectLabel[];
  attentionTos: SelectLabel[];
  buildings: SelectLabel[];
  flagged: boolean;
  setResidents: React.Dispatch<React.SetStateAction<SelectLabel[]>>;
  setEmployees: React.Dispatch<React.SetStateAction<SelectLabel[]>>;
  setStartDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  setEndDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  setTags: React.Dispatch<React.SetStateAction<SelectLabel[]>>;
  setAttentionTos: React.Dispatch<React.SetStateAction<SelectLabel[]>>;
  setBuildings: React.Dispatch<React.SetStateAction<SelectLabel[]>>;
  setFlagged: React.Dispatch<React.SetStateAction<boolean>>;
};

const HomePageFilters = ({
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
  const [buildingOptions, setBuildingOptions] = useState<SelectLabel[]>([]);
  const [userLabels, setUserLabels] = useState<SelectLabel[]>();
  const [residentLabels, setResidentLabels] = useState<SelectLabel[]>();
  const [tagLabels, setTagLabels] = useState<SelectLabel[]>();

  const dateChangeToast = CreateToast();

  const getBuildingsOptions = async () => {
    const buildingsData = await BuildingAPIClient.getBuildings();

    if (buildingsData && buildingsData.buildings.length !== 0) {
      const buildingLabels: SelectLabel[] = buildingsData.buildings.map(
        (building) => ({ label: building.name!, value: building.id! }),
      );
      setBuildingOptions(buildingLabels);
    }
  };

  const getUsers = async () => {
    const data = await UserAPIClient.getUsers({ returnAll: true });
    const users = data?.users;
    if (users) {
      const labels = users.map((user: User) => {
        return {
          label: `${user.firstName} ${user.lastName}`,
          value: user.id,
        } as SelectLabel;
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
        } as SelectLabel;
      });
      setResidentLabels(labels);
    }
  };

  const getTags = async () => {
    const data = await TagAPIClient.getTags({ returnAll: true });
    const tagsData = data?.tags;
    if (tagsData) {
      const labels = tagsData.map((tag: Tag) => {
        return {
          label: tag.name,
          value: tag.tagId,
        } as SelectLabel;
      });
      setTagLabels(labels);
    }
  };

  const handleBuildingChange = (selectedBuildings: MultiValue<SelectLabel>) => {
    const mutableSelectedBuildings: SelectLabel[] = Array.from(
      selectedBuildings,
    );
    setBuildings(mutableSelectedBuildings);
  };

  const handleAttnToChange = (selectedAttnTos: MultiValue<SelectLabel>) => {
    const mutableSelectedAttnTos: SelectLabel[] = Array.from(selectedAttnTos);
    setAttentionTos(mutableSelectedAttnTos);
  };

  const handleEmployeesChange = (
    selectedEmployees: MultiValue<SelectLabel>,
  ) => {
    const mutableSelectedEmployees: SelectLabel[] = Array.from(
      selectedEmployees,
    );
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
    selectedResidents: MultiValue<SelectLabel>,
  ) => {
    const mutableSelectedResidents: SelectLabel[] = Array.from(
      selectedResidents,
    );
    setResidents(mutableSelectedResidents);
  };

  const handleTagsChange = (selectedTags: MultiValue<SelectLabel>) => {
    const mutableSelectedTags: SelectLabel[] = Array.from(selectedTags);
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
    getBuildingsOptions();
    getUsers();
    getResidents();
    getTags();
  }, []);

  return (
    <Card style={{ textAlign: "left", zIndex: 2 }}>
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
                placeholder="Select Residents"
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
                placeholder="Select Employees"
                onChange={handleEmployeesChange}
                styles={selectStyle}
              />
            </GridItem>
            <GridItem colSpan={3}>
              <FormLabel fontWeight="700">Date</FormLabel>
              <Grid templateColumns="repeat(7, 1fr)">
                <GridItem colSpan={3}>
                  <InputGroup>
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
                    {startDate && (
                      <InputRightElement>
                        <IconButton
                          onClick={() => setStartDate(undefined)}
                          aria-label="clear"
                          variant="icon"
                          icon={
                            <SmallCloseIcon
                              boxSize="5"
                              color="gray.200"
                              _hover={{ color: "gray.400" }}
                              transition="color 0.1s ease-in-out"
                            />
                          }
                        />
                      </InputRightElement>
                    )}
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
                    {endDate && (
                      <InputRightElement>
                        <IconButton
                          onClick={() => setEndDate(undefined)}
                          aria-label="clear"
                          variant="icon"
                          icon={
                            <SmallCloseIcon
                              boxSize="5"
                              color="gray.200"
                              _hover={{ color: "gray.400" }}
                              transition="color 0.1s ease-in-out"
                            />
                          }
                        />
                      </InputRightElement>
                    )}
                  </InputGroup>
                </GridItem>
              </Grid>
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
                      <FormLabel fontWeight="700" pointerEvents="none">
                        Tags
                      </FormLabel>
                      <Select
                        value={tags}
                        options={tagLabels}
                        isMulti
                        closeMenuOnSelect={false}
                        placeholder="Select Tags"
                        onChange={handleTagsChange}
                        styles={selectStyle}
                      />
                    </GridItem>
                    <GridItem colSpan={2}>
                      <FormLabel fontWeight="700" pointerEvents="none">
                        Attention To
                      </FormLabel>
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
                      <FormLabel fontWeight="700" pointerEvents="none">
                        Building
                      </FormLabel>
                      <Select
                        value={buildings}
                        options={buildingOptions}
                        isMulti
                        placeholder="Building No."
                        onChange={handleBuildingChange}
                        styles={selectStyle}
                      />
                    </GridItem>
                    <GridItem colSpan={1}>
                      <FormLabel fontWeight="700" pointerEvents="none">
                        Flagged
                      </FormLabel>
                      <Checkbox
                        isChecked={flagged}
                        onChange={(e) => setFlagged(e.target.checked)}
                        colorScheme="teal"
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

export default HomePageFilters;
