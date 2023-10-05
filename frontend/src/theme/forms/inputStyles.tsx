import type { ComponentStyleConfig } from "@chakra-ui/theme";
import fontStyles from "../fontStyles";

const Input: ComponentStyleConfig = {
  sizes: {
    sm: {
      fontSize: "sm",
      px: "12",
    },
    md: {
      fontSize: "md",
    },
    lg: {
      fontSize: "lg",
    },
  },
  variants: {
    default: {
      field: {
        border: "1px solid",
        borderColor: "teal.100",
        borderRadius: "4px",
        color: "teal.300",
        height: "36px",
        _placeholder: {
          color: "gray.600",
        },
        _hover: {
          borderColor: "teal.400",
        },
        _focus: {
          borderColor: "teal.400",
        },
        ...fontStyles["body-medium"],
      },
    },
    login: {
      field: {
        height: "7vh",
        fontWeight: "400",
        fontSize: "22px",
        lineHeight: "29px",
        color: "gray.650",
        _placeholder: {
          color: "gray.150"
        }
      },
    },
  },
  defaultProps: {
    variant: "default",
    size: "sm",
  },
};

const Textarea: ComponentStyleConfig = {
  sizes: {
    sm: {
      fontSize: "sm",
    },
    md: {
      fontSize: "md",
    },
    lg: {
      fontSize: "lg",
    },
  },
  variants: {
    default: {
      border: "1px solid",
      borderColor: "teal.100",
      borderRadius: "4px",
      color: "teal.300",
      height: "36px",
      _placeholder: {
        color: "gray.600",
      },
      _hover: {
        borderColor: "teal.400",
      },
      _focus: {
        borderColor: "teal.400",
      },
      ...fontStyles["body-medium"],
    },
  },
  defaultProps: {
    variant: "default",
    size: "sm",
  },
};

export { Input, Textarea };
