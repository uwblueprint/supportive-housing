import type { ComponentStyleConfig } from "@chakra-ui/theme";
import fontStyles from "../fontStyles";

const Text: ComponentStyleConfig = {
  variants: {
    default: {
      ...fontStyles["body-medium"],
    },
  },
  defaultProps: {
    variant: "default",
  },
};

export default Text;