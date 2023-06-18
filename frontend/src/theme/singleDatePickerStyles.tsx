import colors from "./colors";

const singleDatePickerStyle = {
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
    borderColor: colors.gray[200],
    color: colors.gray[500],
    _hover: {
      borderColor: colors.gray[200],
    },
    _focus: {
      borderColor: colors.gray[200],
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