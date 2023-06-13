import type { ComponentStyleConfig } from "@chakra-ui/theme";
import textStyles from "./textStyles";

const Button: ComponentStyleConfig = {
  baseStyle: {
    color: "white.default",
    background: "grey.50",
    width: "auto",
    ...textStyles["button-medium"],
  },
  variants: {
    primary: {
      background: "teal.400",
      fontWeight: "bold",
      transition: "background-color 0.25s ease !important",
      _hover: {
        background: "teal.500",
        transition: "transition: background-color 0.5s ease !important",
      },
      _active: {
        background: "teal.400",
        boxShadow: "inset 0px 0px 10px #ffffff !important",
      },
    },
    secondary: {
      background: "white.default",
      fontWeight: "bold",
      color: "teal.400",
      border: "1px solid",
      borderColor: "teal.400",
      transition: "transition: color 0.25s ease !important",
      _hover: {
        background: "teal.50",
        transition: " color 0.5s ease !important",
      },
      _active: {
        boxShadow:
          "inset 0px 0px 10px var(--chakra-colors-teal-100) !important",
      },
    },
    tertiary: {
      background: "white.default",
      fontWeight: "bold",
      color: "teal.400",
      transition: "transition: color 0.25s ease !important",
      _hover: {
        color: "teal.500",
        background: "white.default",
        transition: " color 0.5s ease !important",
      },
      _active: {
        color: "teal.400",
        transition: "color 0.1s ease !important",
      },
    },
    navbar: {
      color: "white.default",
      ...textStyles["button-navbar"],
    },
  },
};

export default Button;
