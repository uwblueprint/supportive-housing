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
      fontSize: "40px" 
    }
  },
  defaultProps: {
    variant: "default",
  },
};

export default Text;
