import colors from "./colors";

const optionBackgroundColor = (isSelected: boolean, isFocused: boolean) => {
  if (isSelected) {
    return colors.teal[100];
  }
  if (isFocused) {
    return colors.teal[50];
  }
  return colors.white.default;
};

const selectStyle: any = {
  singleValue: (provided: any) => ({
    ...provided,
    color: colors.gray[500],
    borderColor: colors.gray[200],
    boxShadow: "none",
  }),
  control: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isDisabled ? colors.teal[50] : colors.white.default,
    borderColor: colors.gray[200],
    boxShadow: "none",
    borderRadius: "4px",
    "&:hover": {
      border: `1px solid ${colors.gray[200]}`,
      cursor: "pointer",
    },
  }),
  option: (provided: any, state: any) => {
    return {
      ...provided,
      backgroundColor: optionBackgroundColor(state.isSelected, state.isFocused),
      color: colors.gray[500],
      ":active": {
        backgroundColor: colors.teal[100],
      },
    };
  },
  multiValue: (provided: any) => {
    return {
      ...provided,
      backgroundColor: colors.teal[50],
      border: `1px solid ${colors.gray[200]}`,
      boxShadow: "none",
      "&:hover": {
        border: `1px solid ${colors.gray[200]}`,
        cursor: "pointer",
      },
    };
  },
};

export default selectStyle;
