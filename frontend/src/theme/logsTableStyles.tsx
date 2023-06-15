import type { ComponentStyleConfig } from "@chakra-ui/theme";
import textStyles from "./textStyles";

const Table: ComponentStyleConfig = {
  variants: {
    logRecordsTable: {
      thead: {
        background: "teal.50",
        color: "teal.500",
        textTransform: "none",
      },
      th: {
        textTransform: "none",
        ...textStyles["header-medium"],
      },
      td: {
        ...textStyles["body-medium"],
      },
    },
  },
};

export default Table;
