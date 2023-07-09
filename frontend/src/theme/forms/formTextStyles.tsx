import type { ComponentStyleConfig } from "@chakra-ui/theme";
import fontStyles from "../fontStyles";

const FormLabel: ComponentStyleConfig = {
  variants: {
    default: {
      ...fontStyles["body-medium"],
    },
  },
  defaultProps: {
    variant: "default",
  },
};

const Modal: ComponentStyleConfig = {
  variants: {
    default: {
      header: {
        ...fontStyles["header-large"],
      },
    },
  },
  defaultProps: {
    variant: "default",
  },
};

export { FormLabel, Modal };
