import React, { useState } from 'react';
import {
  Flex,
  IconButton,
  Input,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  useDisclosure,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import FocusLock from 'react-focus-lock';
import { CalendarIcon, } from '@chakra-ui/icons';
import { Month_Names_Short, Weekday_Names_Short } from './utils/calanderUtils';
import { CalendarPanel } from './components/calendarPanel';
import {
  DatepickerConfigs,
  DatepickerProps,
  OnDateSelected,
} from './utils/commonTypes';
import { isValid } from 'date-fns';
import { convertToDate, convertToString } from '../../../helper/dateHelpers';



export interface SingleDatepickerProps extends DatepickerProps {
  date?: Date;
  onDateChange: (date: Date | undefined, isEmpty: boolean) => boolean;
  setIsEmpty?: React.Dispatch<React.SetStateAction<boolean>>;
  configs?: DatepickerConfigs;
  disabled?: boolean;
  /**
   * disabledDates: `Uses startOfDay as comparison`
   */
  disabledDates?: Set<number>;
  defaultIsOpen?: boolean;
  closeOnSelect?: boolean;
  id?: string;
  name?: string;
  usePortal?: boolean;
}

const DefaultConfigs: Required<DatepickerConfigs> = {
  dateFormat: 'yyyy-MM-dd',
  monthNames: Month_Names_Short,
  dayNames: Weekday_Names_Short,
  firstDayOfWeek: 0,
  monthsToDisplay: 1,
};

export const SingleDatepicker: React.FC<SingleDatepickerProps> = ({
  configs,
  propsConfigs,
  usePortal,
  disabledDates,
  defaultIsOpen = false,
  closeOnSelect = true,
  ...props
}) => {
  const {
    date: selectedDate,
    name,
    disabled,
    onDateChange,
    setIsEmpty,
    id,
    minDate,
    maxDate,
  } = props;

  const [dateInView, setDateInView] = useState(selectedDate);
  const [inputDate, setInputDate] = useState(selectedDate ? convertToString(selectedDate) : "")

  const [offset, setOffset] = useState(0);

  const { onOpen, onClose, isOpen } = useDisclosure({ defaultIsOpen });

  const datepickerConfigs = {
    ...DefaultConfigs,
    ...configs,
  };

  const onPopoverClose = () => {
    onClose();
    setDateInView(selectedDate);
    setOffset(0);
  };

  // dayzed utils
  const handleOnDateSelected: OnDateSelected = ({ selectable, date }) => {
    if (!selectable) return;
    if (date instanceof Date && !isNaN(date.getTime())) {
      if (onDateChange(date, false)) {
        setInputDate(format(date, datepickerConfigs.dateFormat))
        if (setIsEmpty) {
          setIsEmpty(false)
        }
      }
      if (closeOnSelect) onClose();
      return;
    }
  };

  const isValidDateParts = (dateString: string) => {
    // Parse the date string into year, month, and day parts
    const [year, month, day] = dateString.split('-').map(Number);
  
    // Validate year (between 1900 and 9999)
    if (year < 1900 || year > 9999) {
      return false;
    }
  
    // Validate month (between 1 and 12)
    if (month < 1 || month > 12) {
      return false;
    }
  
    // Validate day based on the month
    const daysInMonth = new Date(year, month, 0).getDate();
    if (day < 1 || day > daysInMonth) {
      return false;
    }
  
    return true;
  };

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputDate = e.target.value;
    const isValidFormat = /^(\d{0,4})-?(\d{0,2})-?(\d{0,2})$/.test(inputDate);
    if (isValidFormat || inputDate === '') {
      if (/^\d{4}-\d{2}-\d{2}$/.test(inputDate)) {
        if (isValidDateParts(inputDate)) {
          const convertedDate = convertToDate(inputDate)
          if (onDateChange(convertedDate, false)) {
            setInputDate(inputDate);
            setDateInView(convertedDate);
          }
        }
        else {
          setInputDate(inputDate);
          onDateChange(undefined, false)
        }
      }
      else {
        setInputDate(inputDate);
        onDateChange(undefined, inputDate.length === 0)
      }
    }
  };

  const formatDateString = (dateString: string) => {
    // Remove all non-numeric characters and limit to a maximum length of 8 characters
    const formattedDate = dateString.replace(/\D/g, '').slice(0, 8);
  
    // Insert dashes between segments
    let formattedWithDashes = '';
    if (formattedDate.length > 4) {
      formattedWithDashes += formattedDate.slice(0, 4) + '-';
      if (formattedDate.length > 6) {
        formattedWithDashes += formattedDate.slice(4, 6) + '-';
        formattedWithDashes += formattedDate.slice(6);
      } else {
        formattedWithDashes += formattedDate.slice(4);
      }
    } else {
      formattedWithDashes = formattedDate;
    }
  
    return formattedWithDashes;
  };

  const PopoverContentWrapper = usePortal ? Portal : React.Fragment;

  return (
    <Flex gap="8px">
      <Input
        onKeyPress={(e) => {
          if (e.key === ' ' && !isOpen) {
            e.preventDefault();
            onOpen();
          }
        }}
        id={id}
        autoComplete="off"
        isDisabled={disabled}
        name={name}
        value={formatDateString(inputDate)}
        onChange={handleDateInputChange}
        {...propsConfigs?.inputProps}
      />
      <Popover
        placement="bottom-end"
        variant="responsive"
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onPopoverClose}
        isLazy
      >
        <PopoverTrigger>
          <IconButton aria-label="calendar" size="sm" h="36px" variant="secondary" icon={<CalendarIcon />} />
        </PopoverTrigger>
        <PopoverContentWrapper>
          <PopoverContent
            width="100%"
            {...propsConfigs?.popoverCompProps?.popoverContentProps}
          >
            <PopoverBody {...propsConfigs?.popoverCompProps?.popoverBodyProps}>
              <FocusLock>
                <CalendarPanel
                  dayzedHookProps={{
                    showOutsideDays: true,
                    monthsToDisplay: datepickerConfigs.monthsToDisplay,
                    onDateSelected: handleOnDateSelected,
                    selected: selectedDate,
                    date: dateInView,
                    minDate: minDate,
                    maxDate: maxDate,
                    offset: offset,
                    onOffsetChanged: setOffset,
                    firstDayOfWeek: datepickerConfigs.firstDayOfWeek,
                  }}
                  configs={datepickerConfigs}
                  propsConfigs={propsConfigs}
                  disabledDates={disabledDates}
                />
              </FocusLock>
            </PopoverBody>
          </PopoverContent>
        </PopoverContentWrapper>
      </Popover>
    </Flex>
  );
};
