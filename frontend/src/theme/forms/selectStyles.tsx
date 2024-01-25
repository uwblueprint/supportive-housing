import colors from "../colors";
import fontStyles from "../fontStyles";

const optionBackgroundColor = (isSelected: boolean, isFocused: boolean) => {
  if (isSelected) {
    return colors.teal[100];
  }
  if (isFocused) {
    return colors.teal[50];
  }
  return colors.white.default;
};

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const selectStyle: any = {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  singleValue: (provided: any) => ({
    ...provided,
    color: colors.teal[300],
    border: "none",
    boxShadow: "none",
  }),
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  control: (provided: any, state: any) => ({
    ...provided,
    ...fontStyles["body-medium"],
    "&:hover": {
      border: `1px solid ${colors.teal[300]}`,
      cursor: "pointer",
    },
    "&:focus": {
      border: `1px solid ${colors.teal[300]}`,
    },
    border: `1px solid ${colors.teal[100]}`,
    borderColor: state.isFocused ? colors.teal[400] : colors.teal[100],
    boxShadow: "none",
  }),
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  option: (provided: any, state: any) => ({
    ...provided,
    ...fontStyles["body-medium"],
    backgroundColor: optionBackgroundColor(state.isSelected, state.isFocused),
    color: colors.teal[300],
    ":active": {
      backgroundColor: colors.teal[100],
    },
  }),
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  multiValue: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: colors.teal[50],
    border: `1px solid ${colors.teal[100]}`,
    borderColor: state.isFocused ? colors.teal[400] : colors.teal[100],
    boxShadow: "none",
    color: state.isFocused ? colors.teal[400] : colors.teal[300],
    "&:hover": {
      border: `1px solid ${colors.teal[300]}`,
      cursor: "pointer",
    },
  }),
};

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const viewStyle: any = {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  singleValue: (provided: any) => ({
    ...provided,
    color: colors.teal[300],
    border: "none",
    boxShadow: "none",
  }),
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  control: (provided: any, state: any) => ({
    ...provided,
    ...fontStyles["body-medium"],
    "&:hover": {
      border: `1px solid ${colors.teal[300]}`,
      cursor: "pointer",
    },
    "&:focus": {
      border: `1px solid ${colors.teal[300]}`,
    },
    border: `1px solid ${colors.teal[100]}`,
    borderColor: state.isFocused ? colors.teal[400] : colors.teal[100],
    boxShadow: "none",
    backgroundColor: state.isDisabled
      ? "transparent"
      : provided.backgroundColor,
  }),
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  option: (provided: any, state: any) => ({
    ...provided,
    ...fontStyles["body-medium"],
    backgroundColor: optionBackgroundColor(state.isSelected, state.isFocused),
    color: colors.teal[300],
    ":active": {
      backgroundColor: colors.teal[100],
    },
  }),
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  multiValue: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: colors.teal[50],
    border: `1px solid ${colors.teal[100]}`,
    borderColor: state.isFocused ? colors.teal[400] : colors.teal[100],
    boxShadow: "none",
    color: state.isFocused ? colors.teal[400] : colors.teal[300],
    "&:hover": {
      border: `1px solid ${colors.teal[300]}`,
      cursor: "pointer",
    },
  }),
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  indicatorSeparator: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isDisabled
      ? "transparent"
      : provided.backgroundColor,
  }),
};

export { selectStyle, viewStyle };
