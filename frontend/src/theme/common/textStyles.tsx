import type { ComponentStyleConfig } from "@chakra-ui/theme";
import fontStyles from "../fontStyles";

const Text: ComponentStyleConfig = {
  variants: {
    default: {
      ...fontStyles["body-medium"],
      color: "teal.300",
    },
    login: {
      color: "black.default",
      fontWeight: "700",
      fontSize: "40px",
      fontFamily: "DM Sans",
    },
    authyDigit: {
      color: "black.default",
      fontWeight: "500",
      fontSize: "40px",
      fontFamily: "DM Sans",
    },
    loginSecondary: {
      color: "gray.650",
      fontWeight: "400",
      fontSize: "18px",
      fontFamily: "DM Sans",
      lineHeight: "23.44px",
    },
    loginTertiary: {
      color: "teal.400",
      fontWeight: "500",
      fontSize: "18px",
      fontFamily: "DM Sans",
      lineHeight: "23.44px",
      _hover: {
        cursor: "pointer",
        textDecor: "underline",
      },
    },
  },
  defaultProps: {
    variant: "default",
  },
};

export default Text;
