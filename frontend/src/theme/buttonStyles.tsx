import type { ComponentStyleConfig } from "@chakra-ui/theme";
import textStyles from "./textStyles";

const Button: ComponentStyleConfig = {
  baseStyle: {
    color: "white.default",
    width: "auto",
    ...textStyles["button-medium"],
  },
  variants: {
    primary: {
      background: "cyan.300",
      transition: "background-color 0.25s ease !important",
      _hover: {
        background: "cyan.600",
        transition: "transition: background-color 0.5s ease !important",
      },
      _active: {
        background: "cyan.300",
        boxShadow: "inset 0px 0px 10px #ffffff !important",
      },
    },
    secondary: {
      background: "cyan.300",
      transition: "transition: color 0.25s ease !important",
      _hover: {
        color: "cyan.600",
        background: "white.default",
        transition: " color 0.5s ease !important",
      },
      _active: {
        color: "cyan.300",
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
