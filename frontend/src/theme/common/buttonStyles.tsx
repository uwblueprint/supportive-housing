import type { ComponentStyleConfig } from "@chakra-ui/theme";
import fontStyles from "../fontStyles";

const Button: ComponentStyleConfig = {
  baseStyle: {
    color: "white.default",
    background: "grey.50",
    width: "auto",
    ...fontStyles["button-medium"],
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
      ...fontStyles["button-navbar"],
    },
    login: {
      background: "teal.400",
      fontWeight: "400",
      fontSize: "22px",
      fontFamily: "DM Sans",
      lineHeight: "29px",
      color: "white.default",
      borderRadius: "4px",
      height: "9vh",
      width: "100%",
      transition: "background-color 0.25s ease !important",
      _active: {
        background: "teal.400",
        boxShadow: "inset 0px 0px 10px #ffffff !important",
      },

    }
  },
};

export default Button;
