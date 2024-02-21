import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  GridItem,
  FormControl,
  FormLabel,
  Text,
} from "@chakra-ui/react";
import { Card } from "react-bootstrap";
import Select, { MultiValue } from "react-select";
import { selectStyle } from "../../../theme/forms/selectStyles";
import { singleDatePickerStyle } from "../../../theme/forms/datePickerStyles";
import {
  Resident,
  ResidentStatus,
  StatusLabel,
} from "../../../types/ResidentTypes";
import ResidentAPIClient from "../../../APIClients/ResidentAPIClient";
import CreateToast from "../../common/Toasts";
import { SelectLabel } from "../../../types/SharedTypes";
import { SingleDatepicker } from "../../common/Datepicker";

type Props = {
  residentSelections: SelectLabel[];
  buildingSelections: SelectLabel[];
  statusSelections: StatusLabel[];
  buildingOptions: SelectLabel[];
  startDate: Date | undefined;
  endDate: Date | undefined;
  setResidentSelections: React.Dispatch<React.SetStateAction<SelectLabel[]>>;
  setBuildingSelections: React.Dispatch<React.SetStateAction<SelectLabel[]>>;
  setStatusSelections: React.Dispatch<React.SetStateAction<StatusLabel[]>>;
  setStartDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  setEndDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
};

const ResidentDirectoryFilters = ({
  residentSelections,
  buildingSelections,
  statusSelections,
  buildingOptions,
  startDate,
  endDate,
  setResidentSelections,
  setBuildingSelections,
  setStatusSelections,
  setStartDate,
  setEndDate,
}: Props): React.ReactElement => {
  const statusOptions: StatusLabel[] = [
    { label: ResidentStatus.CURRENT, value: ResidentStatus.CURRENT },
    { label: ResidentStatus.PAST, value: ResidentStatus.PAST },
    { label: ResidentStatus.FUTURE, value: ResidentStatus.FUTURE },
  ];

  const [residentOptions, setResidentOptions] = useState<SelectLabel[]>();
  const dateChangeToast = CreateToast();

  const getResidentOptions = async () => {
    const data = await ResidentAPIClient.getResidents({ returnAll: true });
    const residentsData = data?.residents;
    if (residentsData) {
      const residentOpts = residentsData.map((resident: Resident) => {
        return {
          label: `${resident.residentId}`,
          value: resident.id,
        } as SelectLabel;
      });
      setResidentOptions(residentOpts);
    }
  };

  const handleBuildingsChange = (
    selectedBuildings: MultiValue<SelectLabel>,
  ) => {
    const mutableSelectedBuildings: SelectLabel[] = Array.from(
      selectedBuildings,
    );
    setBuildingSelections(mutableSelectedBuildings);
  };

  const handleResidentsChange = (
    selectedResidents: MultiValue<SelectLabel>,
  ) => {
    const mutableSelectedResidents: SelectLabel[] = Array.from(
      selectedResidents,
    );
    setResidentSelections(mutableSelectedResidents);
  };

  const handleStatusesChange = (selectedStatuses: MultiValue<StatusLabel>) => {
    const mutableSelectedStatuses: StatusLabel[] = Array.from(selectedStatuses);
    setStatusSelections(mutableSelectedStatuses);
  };

  const handleStartDateChange = (newStartDate: Date | undefined) => {
    if (endDate && newStartDate && newStartDate > endDate) {
      dateChangeToast(
        "Invalid Date",
        "The start date must be before the end date.",
        "error",
      );
      return false;
    }
    setStartDate(newStartDate);
    return true;
  };

  const handleEndDateChange = (newEndDate: Date | undefined) => {
    if (startDate && newEndDate && startDate > newEndDate) {
      dateChangeToast(
        "Invalid Date",
        "The end date must be after the start date.",
        "error",
      );
      return false;
    }
    setEndDate(newEndDate);
    return true;
  };

  useEffect(() => {
    getResidentOptions();
  }, []);

  return (
    <Card style={{ textAlign: "left", zIndex: 2 }}>
      <Box padding="8px 16px 20px">
        <Text fontSize="12px" fontWeight="700" color="#6D8788" align="left">
          FILTER BY
        </Text>
        <FormControl>
          <Grid padding="10px 0px" templateColumns="repeat(9, 1fr)" gap={7}>
            <GridItem colSpan={2}>
              <FormLabel fontWeight="700">Residents</FormLabel>{" "}
              <Select
                value={residentSelections}
                options={residentOptions}
                isMulti
                closeMenuOnSelect={false}
                placeholder="Select Residents"
                onChange={handleResidentsChange}
                styles={selectStyle}
              />
            </GridItem>
            <GridItem colSpan={2}>
              <FormLabel fontWeight="700">Building</FormLabel>
              <Select
                value={buildingSelections}
                options={buildingOptions}
                isMulti
                placeholder="Building No."
                onChange={handleBuildingsChange}
                styles={selectStyle}
              />
            </GridItem>
            <GridItem colSpan={2}>
              <FormLabel fontWeight="700">Status</FormLabel>
              <Select
                value={statusSelections}
                options={statusOptions}
                isMulti
                placeholder="Select Status"
                onChange={handleStatusesChange}
                styles={selectStyle}
              />
            </GridItem>
            <GridItem colSpan={3}>
              <FormLabel fontWeight="700">Date Range</FormLabel>
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
                        placeholder: "YYYY-MM-DD",
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
                        placeholder: "YYYY-MM-DD",
                      },
                    }}
                  />
                </GridItem>
              </Grid>
            </GridItem>
          </Grid>
        </FormControl>
      </Box>
    </Card>
  );
};

export default ResidentDirectoryFilters;
