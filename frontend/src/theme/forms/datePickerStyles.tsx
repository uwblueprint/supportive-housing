import colors from "../colors";

export const singleDatePickerStyle = {
  dateNavBtnProps: {
    colorScheme: "gray",
    variant: "outline",
    _hover: {
      borderColor: colors.gray[200],
    },
    _focus: {
      borderColor: colors.gray[200],
    },
  },
  inputProps: {
    boxShadow: "none",
    borderColor: colors.teal[100],
    color: colors.teal[300],
    _hover: {
      borderColor: colors.teal[400],
    },
    _focus: {
      borderColor: colors.teal[400],
    },
  },
  popoverCompProps: {
    popoverContentProps: {
      background: "white",
    },
  },
  dayOfMonthBtnProps: {
    defaultBtnProps: {
      _hover: {
        background: colors.teal[50],
        boxShadow: "none",
      },
    },
    selectedBtnProps: {
      background: colors.teal[100],
      boxShadow: "none",
    },
  },
};

export default singleDatePickerStyle;
